import "./Applications.css";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "../../components/BottomNav/BottomNav";
import PhoneLayout from "../../components/PhoneLayout/PhoneLayout";
import { getApplicationsForUser, getCurrentUser } from "../../lib/pawApi";

// Lists the current user's saved applications and their latest status.
function Applications() {
  const [applications, setApplications] = useState([]);
  const [source, setSource] = useState("loading");

  // Fetches applications once and preserves the last successful result in state.
  useEffect(() => {
    let isMounted = true;

    const loadApplications = async () => {
      const currentUser = getCurrentUser();
      const result = await getApplicationsForUser(currentUser?._id || "");

      if (!isMounted) {
        return;
      }

      setApplications(result.applications);
      setSource(result.source);
    };

    loadApplications();

    return () => {
      isMounted = false;
    };
  }, []);

  const statusDisplay = useMemo(
    () => ({
      Submitted: "Submitted",
      Pending: "Submitted",
      Approved: "Approved",
      Declined: "Declined",
      Rejected: "Declined",
      "Visit Scheduled": "Visit Scheduled",
    }),
    []
  );

  const pageMessage =
    source === "api" ? "Tracking your recent applications." : "Showing saved applications.";

  return (
    <PhoneLayout className="applications-page">
      <div className="applications-shell">
        <section className="applications-hero">
          <h2>Applications ⋆˙⟡</h2>
          <p>{pageMessage}</p>
        </section>

        {applications.length > 0 ? (
          <div className="applications-list">
            {applications.map((application) => {
              const statusLabel =
                statusDisplay[application.status] || application.status || "Submitted";
              const statusClass = statusLabel.toLowerCase().replace(/\s+/g, "-");

              return (
                <article key={application.id} className="application-card">
                  <div className="application-card-top">
                    <div>
                      <h3>{application.dogName || "General Application"}</h3>
                      <p>{application.dogBreed || "Breed details pending"}</p>
                    </div>
                    <span className={`application-status-badge status-${statusClass}`}>
                      {statusLabel}
                    </span>
                  </div>

                  <div className="application-card-meta">
                    <div>
                      <span>Application Type</span>
                      <strong>{application.applicationType || "Adoption"}</strong>
                    </div>
                    <div>
                      <span>Shelter</span>
                      <strong>{application.shelter || "Lone Star Rescue"}</strong>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <section className="applications-empty-state">
            <h3>No applications yet</h3>
            <p>Express interest in a dog to see your saved applications here.</p>
          </section>
        )}

        <BottomNav />
      </div>
    </PhoneLayout>
  );
}

export default Applications;
