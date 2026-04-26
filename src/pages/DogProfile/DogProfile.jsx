import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DogProfile.css";
import PhoneLayout from "../../components/PhoneLayout/PhoneLayout";
import { getDogById, submitDogInterest } from "../../lib/pawApi";

function DogProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dog, setDog] = useState(null);
  const [dataSource, setDataSource] = useState("loading");
  const [loadError, setLoadError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDog = async () => {
      const result = await getDogById(id);

      if (!isMounted) {
        return;
      }

      setDog(result.dog);
      setDataSource(result.source);
      setLoadError(result.error);
    };

    loadDog();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (dataSource === "loading") {
    return (
      <PhoneLayout>
        <div className="dog-profile-page">
          <h2>Loading dog profile...</h2>
        </div>
      </PhoneLayout>
    );
  }

  if (!dog) {
    return (
      <PhoneLayout>
        <div className="dog-profile-page">
          <h2>Dog not found</h2>
          {loadError ? <p>{loadError}</p> : null}
          <button onClick={() => navigate("/browse")}>Back to Browse</button>
        </div>
      </PhoneLayout>
    );
  }

  return (
    <PhoneLayout>
      <div className="dog-profile-page">
        <div className="profile-header">
          <button className="back-btn" onClick={() => navigate("/browse")}>
            Back
          </button>
          <h1>{dog.name}</h1>
        </div>

        <div className="profile-card">
          <img src={dog.image} alt={dog.name} className="profile-image" />

          <div className="profile-info">
            <h2>
              {dog.name} - {dog.age} yrs
            </h2>
            <p>{dataSource === "api" ? "Live backend profile" : "Sample fallback profile"}</p>
            <p><strong>Breed:</strong> {dog.breed}</p>
            <p><strong>Location:</strong> {dog.location}</p>
            {dog.distance ? <p><strong>Distance:</strong> {dog.distance}</p> : null}
            <p><strong>Temperament:</strong> {dog.temperamentText || "Not provided yet."}</p>
            <p><strong>Health:</strong> {dog.healthInfo || "Not provided yet."}</p>
            {dog.description ? <p><strong>About:</strong> {dog.description}</p> : null}
            {dog.specialNeeds ? <p><strong>Special needs:</strong> {dog.specialNeeds}</p> : null}
            {actionMessage ? <p>{actionMessage}</p> : null}

            <button
              className="interest-btn"
              onClick={async () => {
                try {
                  const result = await submitDogInterest(dog);
                  if (result.error) {
                    setActionMessage(`Application saved locally. ${result.error}`);
                  }
                  navigate("/applications");
                } catch (error) {
                  setActionMessage(error.message);
                }
              }}
            >
              Express Interest
            </button>
          </div>
        </div>
      </div>
    </PhoneLayout>
  );
}

export default DogProfile;
