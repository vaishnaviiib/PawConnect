import { useMemo, useState } from "react";
import "./Notifications.css";
import notifications from "../../mockData/notifications";
import BottomNav from "../../components/BottomNav/BottomNav";
import PhoneLayout from "../../components/PhoneLayout/PhoneLayout";
import {
  getApplicationNotifications,
  getVisitNotifications,
} from "../../lib/pawApi";

// Combines seeded notification content with locally generated activity updates.
function Notifications() {
  const [activeTab, setActiveTab] = useState("applications");

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
        {displayedNotifications.map((item) => (
          <div className="notification-card" key={item.id}>
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
              {item.type === "approved" ? (
                <button className="view-btn">View</button>
              ) : (
                <img
                  src={item.image}
                  alt="dog"
                  className="notification-thumb"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </PhoneLayout>
  );
}

export default Notifications;