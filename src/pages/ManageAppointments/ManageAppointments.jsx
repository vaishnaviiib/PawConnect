import "./ManageAppointments.css";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PhoneLayout from "../../components/PhoneLayout/PhoneLayout";
import shelterAppointments from "../../mockData/shelterAppointments";
import { getAppointments } from "../../lib/pawApi";

// Shows the shelter's scheduled visits by combining mock and locally created appointments.
function ManageAppointments() {
  const navigate = useNavigate();
  const localAppointments = useMemo(() => getAppointments(), []);
  const combinedAppointments = [...localAppointments, ...shelterAppointments];

  return (
    <PhoneLayout className="manage-appointments-page">
      <main className="manage-appointments-shell">
          <button
            type="button"
            className="shelter-back-btn"
            onClick={() => navigate("/shelter-dashboard")}
          >
            ← Back
          </button>
          {/* Summary cards surface the day's overall visit workload. */}
          <header className="manage-appointments-header">
            <h1>Manage Appointments</h1>
            <p>Mock visit scheduling for your shelter team, with soft reminders and status chips.</p>
          </header>

          <section className="manage-appointments-summary">
            <article>
              <span>Today</span>
              <strong>{combinedAppointments.length} visits</strong>
            </article>
            <article>
              <span>Pending</span>
              <strong>{combinedAppointments.filter((item) => item.status === "Pending").length} follow-up</strong>
            </article>
          </section>

          {/* Appointment cards are display-only for the seeded shelter examples. */}
          <div className="manage-appointments-list">
            {combinedAppointments.map((appointment) => (
              <article key={appointment.id} className="manage-appointment-card">
                <div className="manage-appointment-top">
                  <div>
                    <h2>{appointment.visitorName}</h2>
                    <p>{appointment.type}</p>
                  </div>
                  <span>{appointment.status}</span>
                </div>
                <p className="manage-appointment-dog">{appointment.dogName}</p>
                <p className="manage-appointment-slot">{appointment.slot}</p>
                <div className="manage-appointment-actions">
                  <button type="button">Confirm</button>
                  <button type="button">Reschedule</button>
                </div>
              </article>
            ))}
          </div>
      </main>
    </PhoneLayout>
  );
}

export default ManageAppointments;
