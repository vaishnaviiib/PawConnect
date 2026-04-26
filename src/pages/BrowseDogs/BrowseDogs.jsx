import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BrowseDogs.css";
import BottomNav from "../../components/BottomNav/BottomNav";
import PhoneLayout from "../../components/PhoneLayout/PhoneLayout";
import { getDogs } from "../../lib/pawApi";

function BrowseDogs() {
  const navigate = useNavigate();

  const [showFilters, setShowFilters] = useState(false);
  const [selectedTab, setSelectedTab] = useState("forYou");
  const [selectedBreed, setSelectedBreed] = useState("All");
  const [selectedAge, setSelectedAge] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDogListings = async () => {
      const result = await getDogs();

      if (!isMounted) {
        return;
      }

      setDogs(result.dogs);
      setIsLoading(false);
      setDataSource(result.source);
      setLoadError(result.error);
    };

    loadDogListings();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredDogs = useMemo(() => {
    return dogs.filter((dog) => {
      const breedMatch = selectedBreed === "All" || dog.breed === selectedBreed;
      const locationMatch =
        selectedLocation === "All" || dog.location === selectedLocation;
      const ageMatch =
        selectedAge === "All" ||
        (selectedAge === "0-2" && dog.age >= 0 && dog.age <= 2) ||
        (selectedAge === "3-5" && dog.age >= 3 && dog.age <= 5) ||
        (selectedAge === "6+" && dog.age >= 6);

      return breedMatch && locationMatch && ageMatch;
    });
  }, [dogs, selectedBreed, selectedAge, selectedLocation]);

  useEffect(() => {
    setCurrentIndex((prev) => {
      if (filteredDogs.length === 0) {
        return 0;
      }

      return prev >= filteredDogs.length ? 0 : prev;
    });
  }, [filteredDogs]);

  const breedOptions = useMemo(
    () => ["All", ...new Set(dogs.map((dog) => dog.breed).filter(Boolean))],
    [dogs]
  );

  const locationOptions = useMemo(
    () => ["All", ...new Set(dogs.map((dog) => dog.location).filter(Boolean))],
    [dogs]
  );

  const currentDog = filteredDogs[currentIndex];

  const handleSkip = () => {
    if (currentIndex < filteredDogs.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(filteredDogs.length);
    }
  };

  const handleLike = () => {
    if (!currentDog) {
      return;
    }

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
    <PhoneLayout>
      <div className="browse-page">
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
              onChange={(event) => setSelectedBreed(event.target.value)}
            >
              {breedOptions.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>

            <label>Age</label>
            <select
              value={selectedAge}
              onChange={(event) => setSelectedAge(event.target.value)}
            >
              <option value="All">All</option>
              <option value="0-2">0-2 years</option>
              <option value="3-5">3-5 years</option>
              <option value="6+">6+ years</option>
            </select>

            <label>Location</label>
            <select
              value={selectedLocation}
              onChange={(event) => setSelectedLocation(event.target.value)}
            >
              {locationOptions.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
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
            {isLoading ? (
              <div className="no-dogs-message">
                <h2>Loading dogs...</h2>
                <p>Fetching the latest listings from PawConnect.</p>
              </div>
            ) : null}

            {!isLoading ? (
              <div className="no-dogs-message">
                <p>
                  {dataSource === "api"
                    ? "Showing live dog listings from the backend."
                    : "Backend unavailable, showing sample dogs."}
                </p>
                {loadError ? <p>{loadError}</p> : null}
              </div>
            ) : null}

            {!isLoading && currentDog ? (
              <div className="dog-card">
                <div className="dog-image-wrapper" onClick={handleCardClick}>
                  <img
                    src={currentDog.image}
                    alt={currentDog.name}
                    className="dog-image"
                  />
                  <div className="dog-decor dog-heart">*</div>
                  <div className="dog-decor dog-crown">+</div>
                  <div className="dog-decor dog-swirl">o</div>
                </div>

                <div className="dog-details" onClick={handleCardClick}>
                  <h2>
                    {currentDog.name} - {currentDog.age} yrs
                  </h2>

                  <div className="dog-location-info">
                    <p>{currentDog.location}</p>
                    {currentDog.distance ? <p>{currentDog.distance}</p> : null}
                  </div>
                </div>

                <div className="dog-actions">
                  <button className="dog-action-btn skip-btn" onClick={handleSkip}>
                    X
                  </button>
                  <button className="dog-action-btn like-btn" onClick={handleLike}>
                    Like
                  </button>
                </div>
              </div>
            ) : null}

            {!isLoading && !currentDog ? (
              <div className="no-dogs-message">
                <h2>No matching dogs found</h2>
                <p>Try changing your filters or check back later.</p>
              </div>
            ) : null}
          </>
        )}

        {selectedTab === "favorites" && (
          <div
            className={`favorites-list ${favorites.length === 0 ? "favorites-list-empty" : ""}`}
          >
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
                    X
                  </button>
                </div>
              ))
            ) : (
              <div className="no-dogs-message">
                <h2>No favorites yet</h2>
                <p>Save a dog to keep it here.</p>
              </div>
            )}
          </div>
        )}

        <BottomNav />
      </div>
    </PhoneLayout>
  );
}

export default BrowseDogs;
