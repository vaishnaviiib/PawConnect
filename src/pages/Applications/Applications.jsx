import "./Applications.css";
import { useEffect, useState } from "react";
import BottomNav from "../../components/BottomNav/BottomNav";
import PhoneLayout from "../../components/PhoneLayout/PhoneLayout";
import { getApplicationsForUser, getCurrentUser } from "../../lib/pawApi";

// Lists the current user''s saved applications and their latest status.
// Lists the current user's saved applications and their latest status.
function Applications() {
  const [applications, setApplications] = useState([]);
  const [source, setSource] = useState("loading");
  const [error, setError] = useState("");

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
      setError(result.error);
    };

    loadApplications();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PhoneLayout>
      <div className="applications-page">
        <section className="page-placeholder">
          {/* The source label explains whether data came from local storage or the API. */}
          <h2>Applications</h2>
          <p>
            {source === "local"
              ? "Showing locally saved applications."
              : "Showing applications from the backend."}
          </p>
          {error ? <p>{error}</p> : null}

          {applications.length > 0 ? (
            applications.map((application) => (
              <article key={application.id} className="applications-entry">
                <h3>{application.dogName || "General Application"}</h3>
                <p>{application.applicationType || "Adoption/Foster Application"}</p>
                <p>Status: {application.status || "Saved"}</p>
                {application.dogBreed ? <p>{application.dogBreed}</p> : null}
              </article>
            ))
          ) : (
            <p>No applications yet.</p>
          )}
        </section>

        <BottomNav />
      </div>
    </PhoneLayout>
  );
}

export default Applications;
