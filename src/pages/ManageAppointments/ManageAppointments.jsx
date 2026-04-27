import "./ManageAppointments.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneLayout from "../../components/PhoneLayout/PhoneLayout";
import shelterAppointments from "../../mockData/shelterAppointments";
import { getAppointments, updateAppointmentStatus } from "../../lib/pawApi";

// Shows the shelter's scheduled visits by combining mock and locally created appointments.
function ManageAppointments() {
  const navigate = useNavigate();
  const [localAppointments, setLocalAppointments] = useState([]);

  useEffect(() => {
    setLocalAppointments(getAppointments());
  }, []);

  const combinedAppointments = useMemo(
    () => [
      ...localAppointments.map((appointment) => ({ ...appointment, isLocal: true })),
      ...shelterAppointments.map((appointment) => ({ ...appointment, isLocal: false })),
    ],
    [localAppointments]
  );

  const pendingAppointments = combinedAppointments.filter((appointment) =>
    ["Requested", "Pending Shelter Review", "Pending"].includes(appointment.status)
  );

  const handleAppointmentDecision = (appointmentId, status) => {
    setLocalAppointments(updateAppointmentStatus(appointmentId, status));
  };

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
            <h1>Manage Appointments ⋆‧°𓏲ּ𝄢</h1>
            <p>Mock visit scheduling for your shelter team, with soft reminders and status chips.</p>
          </header>

          <section className="manage-appointments-summary">
            <article>
              <span>Today</span>
              <strong>{combinedAppointments.length} visits</strong>
            </article>
            <article>
              <span>Pending</span>
              <strong>{pendingAppointments.length} follow-up</strong>
            </article>
          </section>

          {/* Appointment cards let the shelter review locally requested visits alongside seeded demos. */}
          <div className="manage-appointments-list">
            {combinedAppointments.map((appointment) => (
              <article key={appointment.id} className="manage-appointment-card">
                <div className="manage-appointment-top">
                  <div>
                    <h2>{appointment.visitorName}</h2>
                    <p>{appointment.type}</p>
                  </div>
                  <span className={`manage-appointment-status status-${appointment.status.toLowerCase().replace(/\s+/g, "-")}`}>
                    {appointment.status}
                  </span>
                </div>
                <p className="manage-appointment-dog">{appointment.dogName}</p>
                <p className="manage-appointment-slot">{appointment.slot}</p>
                {appointment.isLocal &&
                ["Requested", "Pending Shelter Review"].includes(appointment.status) ? (
                  <div className="manage-appointment-actions">
                    <button
                      type="button"
                      onClick={() => handleAppointmentDecision(appointment.id, "Confirmed")}
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      className="manage-appointment-decline-btn"
                      onClick={() => handleAppointmentDecision(appointment.id, "Declined")}
                    >
                      Decline
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

export default ManageAppointments;
