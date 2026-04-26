import "./ManageAppointments.css";
import { useMemo } from "react";
import PhoneLayout from "../../components/PhoneLayout/PhoneLayout";
import shelterAppointments from "../../mockData/shelterAppointments";
import { getAppointments } from "../../lib/pawApi";

function ManageAppointments() {
  const localAppointments = useMemo(() => getAppointments(), []);
  const combinedAppointments = [...localAppointments, ...shelterAppointments];

  return (
    <PhoneLayout>
      <main className="manage-appointments-page">
        <section className="manage-appointments-shell">
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
        </section>
      </main>
    </PhoneLayout>
  );
}

export default ManageAppointments;
