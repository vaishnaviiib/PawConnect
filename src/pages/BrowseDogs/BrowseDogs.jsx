import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BrowseDogs.css";
import BottomNav from "../../components/BottomNav/BottomNav";
import PhoneLayout from "../../components/PhoneLayout/PhoneLayout";
import { getDogs } from "../../lib/pawApi";

// Drives the swipe-style dog discovery flow, filters, and lightweight favorites.
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
  const [loadError, setLoadError] = useState("");

  // Loads dog listings once and ignores late responses after unmount.
  useEffect(() => {
    let isMounted = true;

    const loadDogListings = async () => {
      const result = await getDogs();

      if (!isMounted) return;

      setDogs(result.dogs);
      setIsLoading(false);
      setLoadError(result.error);
    };

    loadDogListings();

    return () => {
      isMounted = false;
    };
  }, []);

  // Applies the selected filter values to the available dog list.
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
      if (filteredDogs.length === 0) return 0;
      return prev >= filteredDogs.length ? 0 : prev;
    });
  }, [filteredDogs]);

  // Builds breed options from the current data set instead of hardcoding them.
  const breedOptions = useMemo(
    () => ["All", ...new Set(dogs.map((dog) => dog.breed).filter(Boolean))],
    [dogs]
  );

  // Builds location options from the current data set instead of hardcoding them.
  const locationOptions = useMemo(
    () => ["All", ...new Set(dogs.map((dog) => dog.location).filter(Boolean))],
    [dogs]
  );

  const currentDog = filteredDogs[currentIndex];

  // Advances past the current card without saving it.
  const handleSkip = () => {
    if (currentIndex < filteredDogs.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(filteredDogs.length);
    }
  };

  // Saves the current dog to favorites and then advances the deck.
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

  // Removes a dog from the local favorites tab.
  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((dog) => dog.id !== id));
  };

  // Opens the detail page for whichever dog is currently in focus.
  const handleCardClick = () => {
    if (currentDog) {
      navigate(`/dog/${currentDog.id}`);
    }
  };

  // Opens a detail page from the favorites list.
  const handleFavoriteClick = (id) => {
    navigate(`/dog/${id}`);
  };

  // Applies the current filter picks and returns to the main browse tab.
  const applyFilters = () => {
    setCurrentIndex(0);
    setShowFilters(false);
    setSelectedTab("forYou");
  };

  // Restores the default filter state and returns to the first card.
  const clearFilters = () => {
    setSelectedBreed("All");
    setSelectedAge("All");
    setSelectedLocation("All");
    setCurrentIndex(0);
    setShowFilters(false);
  };

  return (
    <PhoneLayout className="browse-page">
      {/* Tabs switch between filtering controls, the active deck, and favorites. */}
      <div className="browse-tabs">
        <button
          className={`browse-tab-button ${showFilters ? "browse-tab-active" : ""}`}
          onClick={() => setShowFilters((prev) => !prev)}
        >
          Filter
        </button>

        <button
          className={`browse-tab-button ${
            selectedTab === "forYou" ? "browse-tab-active" : ""
          }`}
          onClick={() => {
            setSelectedTab("forYou");
            setCurrentIndex(0);
          }}
        >
          For you
        </button>

        <button
          className={`browse-tab-button ${
            selectedTab === "favorites" ? "browse-tab-active" : ""
          }`}
          onClick={() => setSelectedTab("favorites")}
        >
          Favorites
        </button>
      </div>

      {showFilters && (
        <div className="filter-panel">
          <h3>Filters</h3>

          {/* Filter inputs narrow the in-memory dog list before rendering cards. */}
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
          {/* Loading and error states keep the card area stable while data arrives. */}
          {isLoading && (
            <div className="no-dogs-message">
              <h2>Loading dogs...</h2>
              <p>Fetching the latest listings from PawConnect.</p>
            </div>
          )}

          {!isLoading && loadError && (
            <div className="no-dogs-message">
              <p>{loadError}</p>
            </div>
          )}

          {!isLoading && currentDog && (
            <div className="dog-card">
              {/* Clicking the image or details opens the full dog profile. */}
              <div className="dog-image-wrapper" onClick={handleCardClick}>
                <img
                  src={currentDog.image || currentDog.photos?.[0]}
                  alt={currentDog.name}
                  className="dog-image"
                />
                <div className="dog-decor dog-heart">₊✩‧₊˚౨ৎ˚₊✩‧₊</div>
                <div className="dog-decor dog-crown"></div>
                <div className="dog-decor dog-swirl">⋅°❀⋆.ೃ࿔*:･</div>
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
                  ✓
                </button>
              </div>
            </div>
          )}

          {!isLoading && !currentDog && (
            <div className="no-dogs-message">
              <h2>No matching dogs found</h2>
              <p>Try changing your filters or check back later.</p>
            </div>
          )}
        </>
      )}

      {selectedTab === "favorites" && (
        <div
          className={`favorites-list ${
            favorites.length === 0 ? "favorites-list-empty" : ""
          }`}
        >
          {/* Favorites are stored only in local state for this browsing session. */}
          {favorites.length > 0 ? (
            favorites.map((dog) => (
              <div className="favorite-card" key={dog.id}>
                <div
                  className="favorite-card-left"
                  onClick={() => handleFavoriteClick(dog.id)}
                >
                  <img
                    src={dog.image || dog.photos?.[0]}
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
    </PhoneLayout>
  );
}

export default BrowseDogs;
