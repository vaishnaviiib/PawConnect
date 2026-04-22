import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BrowseDogs.css";
import dogs from "../../mockData/dogs";
import BottomNav from "../../components/BottomNav/BottomNav";

function BrowseDogs() {
  const navigate = useNavigate();

  const [showFilters, setShowFilters] = useState(false);
  const [selectedTab, setSelectedTab] = useState("forYou");
  const [selectedBreed, setSelectedBreed] = useState("All");
  const [selectedAge, setSelectedAge] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);

  const filteredDogs = useMemo(() => {
    return dogs.filter((dog) => {
      const breedMatch =
        selectedBreed === "All" || dog.breed === selectedBreed;

      const locationMatch =
        selectedLocation === "All" || dog.location === selectedLocation;

      const ageMatch =
        selectedAge === "All" ||
        (selectedAge === "0-2" && dog.age >= 0 && dog.age <= 2) ||
        (selectedAge === "3-5" && dog.age >= 3 && dog.age <= 5) ||
        (selectedAge === "6+" && dog.age >= 6);

      return breedMatch && locationMatch && ageMatch;
    });
  }, [selectedBreed, selectedAge, selectedLocation]);

  const currentDog = filteredDogs[currentIndex];

  const handleSkip = () => {
    if (currentIndex < filteredDogs.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(filteredDogs.length);
    }
  };

  const handleLike = () => {
    if (!currentDog) return;

    const alreadyFavorited = favorites.some((dog) => dog.id === currentDog.id);

    if (!alreadyFavorited) {
      setFavorites((prev) => [...prev, currentDog]);
    }

    if (currentIndex < filteredDogs.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(filteredDogs.length);
    }
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((dog) => dog.id !== id));
  };

  const handleCardClick = () => {
    if (currentDog) {
      navigate(`/dog/${currentDog.id}`);
    }
  };

  const handleFavoriteClick = (id) => {
    navigate(`/dog/${id}`);
  };

  const applyFilters = () => {
    setCurrentIndex(0);
    setShowFilters(false);
    setSelectedTab("forYou");
  };

  const clearFilters = () => {
    setSelectedBreed("All");
    setSelectedAge("All");
    setSelectedLocation("All");
    setCurrentIndex(0);
    setShowFilters(false);
  };

  return (
    <div className="browse-page">
      <div className="browse-status-bar">
        <span>9:41</span>
        <span>📶 📡 🔋</span>
      </div>

      <div className="browse-tabs">
        <button
          className={`browse-tab-button ${showFilters ? "browse-tab-active" : ""}`}
          onClick={() => setShowFilters((prev) => !prev)}
        >
          Filter
        </button>

        <button
          className={`browse-tab-button ${selectedTab === "forYou" ? "browse-tab-active" : ""}`}
          onClick={() => {
            setSelectedTab("forYou");
            setCurrentIndex(0);
          }}
        >
          For you
        </button>

        <button
          className={`browse-tab-button ${selectedTab === "favorites" ? "browse-tab-active" : ""}`}
          onClick={() => setSelectedTab("favorites")}
        >
          Favorites
        </button>
      </div>

      {showFilters && (
        <div className="filter-panel">
          <h3>Filters</h3>

          <label>Breed</label>
          <select
            value={selectedBreed}
            onChange={(e) => setSelectedBreed(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Golden Retriever">Golden Retriever</option>
            <option value="Labrador Retriever">Labrador Retriever</option>
            <option value="German Shepherd">German Shepherd</option>
          </select>

          <label>Age</label>
          <select
            value={selectedAge}
            onChange={(e) => setSelectedAge(e.target.value)}
          >
            <option value="All">All</option>
            <option value="0-2">0-2 years</option>
            <option value="3-5">3-5 years</option>
            <option value="6+">6+ years</option>
          </select>

          <label>Location</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Plano, TX">Plano, TX</option>
            <option value="Dallas, TX">Dallas, TX</option>
            <option value="Richardson, TX">Richardson, TX</option>
          </select>

          <div className="filter-actions">
            <button className="filter-clear-btn" onClick={clearFilters}>
              Clear
            </button>
            <button className="filter-apply-btn" onClick={applyFilters}>
              Apply
            </button>
          </div>
        </div>
      )}

      {selectedTab === "forYou" && (
        <>
          {currentDog ? (
            <div className="dog-card">
              <div className="dog-image-wrapper" onClick={handleCardClick}>
                <img
                  src={currentDog.image}
                  alt={currentDog.name}
                  className="dog-image"
                />
                <div className="dog-decor dog-heart">💗</div>
                <div className="dog-decor dog-crown">👑</div>
                <div className="dog-decor dog-swirl">➰</div>
              </div>

              <div className="dog-details" onClick={handleCardClick}>
                <h2>
                  {currentDog.name} • {currentDog.age} yrs
                </h2>

                <div className="dog-location-info">
                  <p>🏠 {currentDog.location}</p>
                  <p>📍 {currentDog.distance}</p>
                </div>
              </div>

              <div className="dog-actions">
                <button className="dog-action-btn skip-btn" onClick={handleSkip}>
                  ✕
                </button>
                <button className="dog-action-btn like-btn" onClick={handleLike}>
                  ✓
                </button>
              </div>
            </div>
          ) : (
            <div className="no-dogs-message">
              <h2>No matching dogs found</h2>
              <p>Try changing your filters or check back later.</p>
            </div>
          )}
        </>
      )}

      {selectedTab === "favorites" && (
        <div className="favorites-list">
          {favorites.length > 0 ? (
            favorites.map((dog) => (
              <div className="favorite-card" key={dog.id}>
                <div
                  className="favorite-card-left"
                  onClick={() => handleFavoriteClick(dog.id)}
                >
                  <img
                    src={dog.image}
                    alt={dog.name}
                    className="favorite-image"
                  />

                  <div className="favorite-info">
                    <h3>{dog.name}</h3>
                    <p>{dog.breed}</p>
                    <p>{dog.location}</p>
                  </div>
                </div>

                <button
                  className="remove-favorite-btn"
                  onClick={() => removeFavorite(dog.id)}
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <div className="no-dogs-message">
              <h2>No favorites yet</h2>
              <p>Tap ✓ on a dog to save it here.</p>
            </div>
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
}

export default BrowseDogs;