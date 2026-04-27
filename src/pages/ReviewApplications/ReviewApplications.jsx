import "./ReviewApplications.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneLayout from "../../components/PhoneLayout/PhoneLayout";
import shelterApplications from "../../mockData/shelterApplications";
import {
  deleteDeclinedApplication,
  getApplicationsForUser,
  updateApplicationStatus,
} from "../../lib/pawApi";

// Gives shelter staff a queue for reviewing applications and scheduling visits.
function ReviewApplications() {
  const navigate = useNavigate();
  const [localApplications, setLocalApplications] = useState([]);
  const [dismissedMockApplicationIds, setDismissedMockApplicationIds] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Loads saved applications and reshapes them to match the seeded review cards.
  useEffect(() => {
    let isMounted = true;

    const loadApplications = async () => {
      const result = await getApplicationsForUser();

      if (!isMounted) {
        return;
      }

      setLocalApplications(
        result.applications.map((application) => ({
          id: application.id,
          applicantName: application.applicantName,
          dogName: application.dogName,
          applicationType: application.applicationType,
          submittedAt: "Just now",
          homeType: application.homeType || "Home details saved in demo application",
          experience: application.experience || "Experience pending",
          status: application.status,
          isLocal: true,
        }))
      );
      setStatusMessage(
        result.source === "api"
          ? "Showing backend applications with local fallback."
          : result.error
            ? `Backend unavailable. ${result.error}`
            : "Showing locally saved applications."
      );
      setIsLoading(false);
    };

    loadApplications();

    return () => {
      isMounted = false;
    };
  }, []);

  // Appends static mock data so the review list stays populated during the demo.
  const combinedApplications = [
    ...localApplications,
    ...shelterApplications.map((application) => ({ ...application, isLocal: false })),
  ].filter((application) => !dismissedMockApplicationIds.includes(application.id));

  // Applies an approval or decline change and refreshes the local review list.
  const handleStatusChange = async (applicationId, status) => {
    const nextApplications = await updateApplicationStatus(applicationId, status);
    setLocalApplications(
      nextApplications.map((application) => ({
        id: application.id,
        applicantName: application.applicantName,
        dogName: application.dogName,
        applicationType: application.applicationType,
        submittedAt: "Just now",
        homeType: application.homeType || "Home details saved in demo application",
        experience: application.experience || "Experience pending",
        status: application.status,
        isLocal: true,
      }))
    );
  };

  const handleDeleteDeclinedApplication = (application) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this declined application?"
    );

    if (!isConfirmed) {
      return;
    }

    if (application.isLocal) {
      const nextApplications = deleteDeclinedApplication(application.id);
      setLocalApplications(
        nextApplications.map((item) => ({
          id: item.id,
          applicantName: item.applicantName,
          dogName: item.dogName,
          applicationType: item.applicationType,
          submittedAt: "Just now",
          homeType: item.homeType || "Home details saved in demo application",
          experience: item.experience || "Experience pending",
          status: item.status,
          isLocal: true,
        }))
      );
      return;
    }

    setDismissedMockApplicationIds((prev) => [...prev, application.id]);
  };

  return (
    <PhoneLayout className="review-applications-page">
      <main className="review-applications-shell">
          <button
            type="button"
            className="shelter-back-btn"
            onClick={() => navigate("/shelter-dashboard")}
          >
            ← Back
          </button>
          {/* Header copy explains that this screen is still backed by mock-first data. */}
          <header className="review-applications-header">
            <h1>Review Applications ⋆˚✿˖°</h1>
            <p>{/*Sort through mock applicant profiles before wiring this page to the API.*/}</p>
            {statusMessage ? <p>{statusMessage}</p> : null}
          </header>

          {/* Each card shows quick review data plus approval controls for the shelter. */}
          <div className="review-applications-list">
            {isLoading ? <article className="review-application-card">Loading applications...</article> : null}
            {combinedApplications.map((application) => (
              <article key={application.id} className="review-application-card">
                <div className="review-application-top">
                  <div>
                    <h2>{application.applicantName} </h2>
                    <p>
                      {application.applicationType} for {application.dogName}
                    </p>
                  </div>
                  <span>{application.status}</span>
                </div>

                <dl className="review-application-meta">
                  <div>
                    <dt>Submitted</dt>
                    <dd>{application.submittedAt}</dd>
                  </div>
                  <div>
                    <dt>Home</dt>
                    <dd>{application.homeType}</dd>
                  </div>
                  <div>
                    <dt>Experience</dt>
                    <dd>{application.experience}</dd>
                  </div>
                </dl>

                <div className="review-application-actions">
                  <button
                    type="button"
                    disabled={!application.isLocal}
                    onClick={() => handleStatusChange(application.id, "Approved")}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={!application.isLocal}
                    onClick={() => handleStatusChange(application.id, "Declined")}
                  >
                    Decline
                  </button>
                </div>

                {["Declined", "Rejected"].includes(application.status) ? (
                  <div className="review-application-delete-row">
                    <button
                      type="button"
                      className="review-application-delete-btn"
                      onClick={() => handleDeleteDeclinedApplication(application)}
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
      </main>
    </PhoneLayout>
  );
}

export default ReviewApplications;
