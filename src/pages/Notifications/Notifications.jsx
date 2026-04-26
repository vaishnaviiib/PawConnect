import { useMemo, useState } from "react";
import "./Notifications.css";
import notifications from "../../mockData/notifications";
import BottomNav from "../../components/BottomNav/BottomNav";
import PhoneLayout from "../../components/PhoneLayout/PhoneLayout";
import { getApplicationNotifications, getVisitNotifications } from "../../lib/pawApi";

function Notifications() {
  const [activeTab, setActiveTab] = useState("applications");
  const localApplicationNotifications = useMemo(() => getApplicationNotifications(), []);
  const localVisitNotifications = useMemo(() => getVisitNotifications(), []);

  const displayedNotifications =
    activeTab === "applications"
      ? [...localApplicationNotifications, ...notifications.applications]
      : [...localVisitNotifications, ...notifications.visits];

  return (
    <PhoneLayout>
      <div className="notifications-page">
        <h1 className="notifications-title">Activity</h1>

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
          {displayedNotifications.map((item) => (
            <div className="notification-card" key={item.id}>
              <div className="notification-left">
                <span className="pink-dot"></span>
                <img src={item.avatar} alt="avatar" className="notification-avatar" />
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
                  <img src={item.image} alt="dog" className="notification-thumb" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="dog-sticker dog-top">🐶✨</div>
        <div className="dog-sticker dog-bottom">🐶🌼</div>

        <BottomNav />
      </div>
    </PhoneLayout>
  );
}

export default Notifications;
