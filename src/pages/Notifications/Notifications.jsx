import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Notifications.css";
import notifications from "../../mockData/notifications";
import BottomNav from "../../components/BottomNav/BottomNav";
import PhoneLayout from "../../components/PhoneLayout/PhoneLayout";
import {
  getDataMode,
  getApplicationNotifications,
  getAppointments,
  getVisitNotifications,
  requestVisitAppointment,
} from "../../lib/pawApi";

const DISMISSED_NOTIFICATIONS_KEY = "pawconnectDismissedNotifications";

// Combines seeded notification content with locally generated activity updates.
function Notifications() {
  const navigate = useNavigate();
  const apiOnlyMode = getDataMode() === "api";
  const [activeTab, setActiveTab] = useState("applications");
  const applicationNotifications = getApplicationNotifications();
  const [visitNotifications, setVisitNotifications] = useState(() => getVisitNotifications());
  const [appointments, setAppointments] = useState(() => getAppointments());
  const [activeVisitRequestId, setActiveVisitRequestId] = useState("");
  const [visitDraft, setVisitDraft] = useState({ date: "", time: "" });
  const [dismissedNotificationIds, setDismissedNotificationIds] = useState(() => {
    try {
      const value = localStorage.getItem(DISMISSED_NOTIFICATIONS_KEY);
      return value ? JSON.parse(value) : [];
    } catch {
      return [];
    }
  });

  // Switches between application activity and scheduled-visit activity.
  const displayedNotifications =
    activeTab === "applications"
      ? [...applicationNotifications, ...(apiOnlyMode ? [] : notifications.applications)]
      : [...visitNotifications, ...(apiOnlyMode ? [] : notifications.visits)];

  const visibleNotifications = displayedNotifications.filter(
    (item) => !dismissedNotificationIds.includes(String(item.id))
  );

  const handleDismissNotification = (id) => {
    setDismissedNotificationIds((prev) => {
      const nextIds = [...prev, String(id)];
      localStorage.setItem(DISMISSED_NOTIFICATIONS_KEY, JSON.stringify(nextIds));
      return nextIds;
    });
  };

  const handleOpenApplications = () => {
    navigate("/applications");
  };

  const handleRequestVisit = (applicationId) => {
    if (!visitDraft.date || !visitDraft.time) {
      return;
    }

    try {
      requestVisitAppointment({
        applicationId,
        date: visitDraft.date,
        time: visitDraft.time,
      });
    } catch {
      return;
    }

    setAppointments(getAppointments());
    setVisitNotifications(getVisitNotifications());
    setActiveVisitRequestId("");
    setVisitDraft({ date: "", time: "" });
  };

  return (
    <PhoneLayout className="notifications-page">
      <h1 className="notifications-title">Activity</h1>

      {/* Tabs let the user focus on either application or visit updates. */}
      <div className="notification-tabs">
        <button
          className={activeTab === "applications" ? "tab-btn active" : "tab-btn"}
          onClick={() => setActiveTab("applications")}
        >
          Applications
        </button>

        <button
          className={activeTab === "visits" ? "tab-btn active" : "tab-btn"}
          onClick={() => setActiveTab("visits")}
        >
          Scheduled Visits
        </button>
      </div>

      <div className="notifications-list">
        {/* Cards mix static design data with notifications generated from local actions. */}
        {visibleNotifications.map((item) => {
          const hasRequestedVisit = appointments.some(
            (appointment) => appointment.applicationId === item.applicationId
          );
          const canRequestVisit =
            activeTab === "applications" &&
            item.type === "approved" &&
            item.applicationId &&
            !hasRequestedVisit;

          return (
            <div
              className={`notification-card-shell ${
                canRequestVisit && activeVisitRequestId === item.applicationId
                  ? "notification-card-shell-expanded"
                  : ""
              }`}
              key={item.id}
            >
              <div
                className={`notification-card ${
                  activeTab === "applications" ? "notification-card-clickable" : ""
                }`}
                onClick={activeTab === "applications" ? handleOpenApplications : undefined}
              >
                <div className="notification-left">
                  <span className="pink-dot"></span>
                  {/*<img
                    src={item.avatar}
                    alt="avatar"
                    className="notification-avatar"
                  />
                  */}
                </div>

                <div className="notification-center">
                  <div className="notification-header">
                    <h3>{item.shelter}</h3>
                    <span>{item.time}</span>
                  </div>
                  <p>{item.status}</p>
                </div>

                <div className="notification-right">
                  {activeTab === "applications" ? (
                    <div className="notification-actions">
                      <button
                        type="button"
                        className="view-btn"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleOpenApplications();
                        }}
                      >
                        View
                      </button>
                      {canRequestVisit ? (
                        <button
                          type="button"
                          className="notification-secondary-btn"
                          onClick={(event) => {
                            event.stopPropagation();
                            setActiveVisitRequestId(
                              activeVisitRequestId === item.applicationId ? "" : item.applicationId
                            );
                            setVisitDraft({ date: "", time: "" });
                          }}
                        >
                          Request Visit
                        </button>
                      ) : null}
                    </div>
                  ) : item.type === "approved" ? (
                    <button className="view-btn">View</button>
                  ) : (
                    <img
                      src={item.image}
                      alt="dog"
                      className="notification-thumb"
                    />
                  )}
                  <button
                    type="button"
                    className="notification-dismiss-btn"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDismissNotification(item.id);
                    }}
                    aria-label="Dismiss notification"
                  >
                    X
                  </button>
                </div>
              </div>

              {canRequestVisit && activeVisitRequestId === item.applicationId ? (
                <div className="notification-request-form">
                  <input
                    type="date"
                    value={visitDraft.date}
                    onChange={(event) =>
                      setVisitDraft((prev) => ({ ...prev, date: event.target.value }))
                    }
                  />
                  <input
                    type="time"
                    value={visitDraft.time}
                    onChange={(event) =>
                      setVisitDraft((prev) => ({ ...prev, time: event.target.value }))
                    }
                  />
                  <button
                    type="button"
                    className="notification-request-submit"
                    onClick={() => handleRequestVisit(item.applicationId)}
                  >
                    Send Request
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <BottomNav />
    </PhoneLayout>
  );
}

export default Notifications;
