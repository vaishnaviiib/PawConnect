import "./ShelterDashboard.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PhoneLayout from "../../components/PhoneLayout/PhoneLayout";
import shelterDogs from "../../mockData/shelterDogs";
import shelterApplications from "../../mockData/shelterApplications";
import shelterAppointments from "../../mockData/shelterAppointments";
import {
  deleteLocalShelterDog,
  getAppointments,
  getLocalShelterDogs,
  getSubmittedApplications,
} from "../../lib/pawApi";

// Summarizes shelter activity and links staff into the main management flows.
function ShelterDashboard() {
  const [savedDogs, setSavedDogs] = useState([]);

  useEffect(() => {
    setSavedDogs(getLocalShelterDogs());
  }, []);

  // Combines seeded mock counts with locally created data for a fuller demo dashboard.
  const availableCount =
    shelterDogs.filter((dog) => dog.status === "Available").length + savedDogs.length;
  const reviewCount = shelterApplications.filter(
    (application) => application.status === "Needs Review"
  ).length;
  const localReviewCount = getSubmittedApplications().length;
  const upcomingCount =
    shelterAppointments.filter((appointment) => appointment.status !== "Reschedule").length +
    getAppointments().length;

  const handleDeleteDog = (dogId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this dog listing?");

    if (!isConfirmed) {
      return;
    }

    setSavedDogs(deleteLocalShelterDog(dogId));
  };

  return (
    <PhoneLayout className="shelter-dashboard-page">
      <main className="shelter-dashboard-shell">
          {/* Hero copy frames the shelter dashboard as an operational home base. */}
          <header className="shelter-dashboard-hero">
            <p className="shelter-dashboard-kicker">PawConnect Shelter</p>
            <h1>Lone Star Rescue</h1>
            <p>
              Track dog profiles, review applicants, and keep visit schedules moving.
            </p>
          </header>

          {/* High-level counts surface the shelter's current workload at a glance. */}
          <section className="shelter-dashboard-metrics">
            <article className="shelter-metric-card">
              <span className="shelter-metric-label">Available dogs</span>
              <strong>{availableCount}</strong>
            </article>
            <article className="shelter-metric-card">
              <span className="shelter-metric-label">Needs review</span>
              <strong>{reviewCount + localReviewCount}</strong>
            </article>
            <article className="shelter-metric-card">
              <span className="shelter-metric-label">Upcoming visits</span>
              <strong>{upcomingCount}</strong>
            </article>
          </section>

          {/* Action cards route staff into dog creation, review, and scheduling tasks. */}
          <nav className="shelter-dashboard-actions" aria-label="Shelter actions">
            <Link className="shelter-action-card" to="/create-dog">
              <span>Create dog profile</span>
              <strong>Add a new listing</strong>
            </Link>
            <Link className="shelter-action-card" to="/review-applications">
              <span>Review applications</span>
              <strong>See applicant queue</strong>
            </Link>
            <Link className="shelter-action-card" to="/manage-appointments">
              <span>Manage visits</span>
              <strong>Plan your week</strong>
            </Link>
          </nav>

          {/* Locally created shelter dogs appear here alongside the dashboard summary. */}
          <section className="shelter-dashboard-section">
            <div className="shelter-section-heading">
              <h2>My Dog Listings</h2>
              <Link to="/create-dog">Add Dog Profile</Link>
            </div>
            <div className="shelter-dog-list">
              {savedDogs.length > 0 ? (
                savedDogs.map((dog) => (
                  <article key={dog.id} className="shelter-dog-card">
                    <img
                      src={dog.image || dog.photos?.[0] || shelterDogs[0].image}
                      alt={dog.name}
                    />
                    <div className="shelter-dog-copy">
                      <div className="shelter-dog-copy-top">
                        <h3>{dog.name}</h3>
                        <button
                          type="button"
                          className="shelter-delete-btn"
                          onClick={() => handleDeleteDog(dog.id)}
                        >
                          Delete
                        </button>
                      </div>
                      <div>
                        <p>{dog.breed}</p>
                      </div>
                      <span className="shelter-status-pill">{dog.status}</span>
                      <p>{dog.age} yrs</p>
                      <p>{dog.location}</p>
                    </div>
                  </article>
                ))
              ) : (
                <article className="shelter-empty-card">
                  <h3>No saved mock dog profiles yet</h3>
                  <p>Create a new dog listing to see it appear here.</p>
                </article>
              )}
            </div>
          </section>
      </main>
    </PhoneLayout>
  );
}

export default ShelterDashboard;
