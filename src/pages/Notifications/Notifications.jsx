import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Notifications.css";
import notifications from "../../mockData/notifications";
import BottomNav from "../../components/BottomNav/BottomNav";
import PhoneLayout from "../../components/PhoneLayout/PhoneLayout";
import {
  getApplicationNotifications,
  getVisitNotifications,
} from "../../lib/pawApi";

const DISMISSED_NOTIFICATIONS_KEY = "pawconnectDismissedNotifications";

// Combines seeded notification content with locally generated activity updates.
function Notifications() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("applications");
  const [dismissedNotificationIds, setDismissedNotificationIds] = useState(() => {
    try {
      const value = localStorage.getItem(DISMISSED_NOTIFICATIONS_KEY);
      return value ? JSON.parse(value) : [];
    } catch {
      return [];
    }
  });

  // Captures application notifications once so tab changes stay cheap.
  const localApplicationNotifications = useMemo(
    () => getApplicationNotifications(),
    []
  );

  // Captures visit notifications once so tab changes stay cheap.
  const localVisitNotifications = useMemo(
    () => getVisitNotifications(),
    []
  );

  // Switches between application activity and scheduled-visit activity.
  const displayedNotifications =
    activeTab === "applications"
      ? [...localApplicationNotifications, ...notifications.applications]
      : [...localVisitNotifications, ...notifications.visits];

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
        {visibleNotifications.map((item) => (
          <div
            className={`notification-card ${
              activeTab === "applications" ? "notification-card-clickable" : ""
            }`}
            key={item.id}
            onClick={activeTab === "applications" ? handleOpenApplications : undefined}
          >
            <div className="notification-left">
              <span className="pink-dot"></span>
              <img
                src={item.avatar}
                alt="avatar"
                className="notification-avatar"
              />
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
        ))}
      </div>

      <BottomNav />
    </PhoneLayout>
  );
}

export default Notifications;
