/* 
written by: Karla
tested by: Andria & Karla
debugged by: Andria & Karla
*/


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DogProfile.css";
import PhoneLayout from "../../components/PhoneLayout/PhoneLayout";
import {
  findExistingApplicationForDog,
  getDogById,
  submitDogInterest,
} from "../../lib/pawApi";

// Shows a single dog's details and lets the adopter express interest.
function DogProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dog, setDog] = useState(null);
  const [dataSource, setDataSource] = useState("loading");
  const [loadError, setLoadError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  // Loads the requested dog whenever the route id changes.
  useEffect(() => {
    let isMounted = true;

    const loadDog = async () => {
      const result = await getDogById(id);

      if (!isMounted) return;

      setDog(result.dog);
      setDataSource(result.source);
      setLoadError(result.error);
    };

    loadDog();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Keeps a lightweight loading state visible while dog data is fetched.
  if (dataSource === "loading") {
    return (
      <PhoneLayout className="dog-profile-page">
        <h2>Loading dog profile...</h2>
      </PhoneLayout>
    );
  }

  // Provides a clear fallback when the requested dog id cannot be resolved.
  if (!dog) {
    return (
      <PhoneLayout className="dog-profile-page">
        <h2>Dog not found</h2>
        {loadError ? <p>{loadError}</p> : null}
        <button onClick={() => navigate("/browse")}>Back to Browse</button>
      </PhoneLayout>
    );
  }

  return (
    <PhoneLayout className="dog-profile-page">
      {/* The header provides a fast way back to the browse deck. */}
      <div className="profile-header">
        <button className="back-btn" onClick={() => navigate("/browse")}>
          ←
        </button>
        <h1>{dog.name}</h1>
      </div>

      <div className="profile-card">
        <img
          src={dog.image || dog.photos?.[0]}
          alt={dog.name}
          className="profile-image"
        />

        <div className="profile-info">
          <h2>
            {dog.name} - {dog.age} yrs
          </h2>

          <p>
            {dataSource === "api"
              ? "Live backend profile"
              : "Sample fallback profile"}
          </p>

          <p>
            <strong>Breed:</strong> {dog.breed}
          </p>
          <p>
            <strong>Location:</strong> {dog.location}
          </p>

          {dog.distance ? (
            <p>
              <strong>Distance:</strong> {dog.distance}
            </p>
          ) : null}

          <p>
            <strong>Temperament:</strong>{" "}
            {dog.temperamentText || "Not provided yet."}
          </p>
          <p>
            <strong>Health:</strong> {dog.healthInfo || "Not provided yet."}
          </p>

          {dog.description ? (
            <p>
              <strong>About:</strong> {dog.description}
            </p>
          ) : null}

          {dog.specialNeeds ? (
            <p>
              <strong>Special needs:</strong> {dog.specialNeeds}
            </p>
          ) : null}

          {actionMessage ? <p>{actionMessage}</p> : null}

          <button
            className="interest-btn"
            onClick={async () => {
              // Saves an application locally when the backend is unavailable.
              try {
                const existingApplication = findExistingApplicationForDog(dog);

                if (existingApplication) {
                  navigate("/applications");
                  return;
                }

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
    </PhoneLayout>
  );
}

export default DogProfile;
