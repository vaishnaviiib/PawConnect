import { useParams, useNavigate } from "react-router-dom";
import dogs from "../../mockData/dogs";
import "./DogProfile.css";

function DogProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const dog = dogs.find((d) => d.id === Number(id));

  if (!dog) {
    return (
      <div className="dog-profile-page">
        <h2>Dog not found</h2>
        <button onClick={() => navigate("/")}>Back to Browse</button>
      </div>
    );
  }

  return (
    <div className="dog-profile-page">
      <div className="profile-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          ←
        </button>
        <h1>{dog.name}</h1>
      </div>

      <div className="profile-card">
        <img src={dog.image} alt={dog.name} className="profile-image" />

        <div className="profile-info">
          <h2>
            {dog.name} • {dog.age} yrs
          </h2>
          <p><strong>Breed:</strong> {dog.breed}</p>
          <p><strong>Location:</strong> {dog.location}</p>
          <p><strong>Distance:</strong> {dog.distance}</p>
          <p><strong>Temperament:</strong> Friendly, playful, affectionate</p>
          <p><strong>Health:</strong> Vaccinated, neutered, microchipped</p>
          <p><strong>Shelter:</strong> Lone Star Rescue</p>

          <button className="interest-btn">Express Interest</button>
        </div>
      </div>
    </div>
  );
}

export default DogProfile;
