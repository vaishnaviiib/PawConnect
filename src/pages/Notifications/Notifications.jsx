import { useState } from "react";
import "./Notifications.css";
import notifications from "../../mockData/notifications";
import BottomNav from "../../components/BottomNav/BottomNav";

function Notifications() {
  const [activeTab, setActiveTab] = useState("applications");

  const displayedNotifications =
    activeTab === "applications"
      ? notifications.applications
      : notifications.visits;

  return (
    <div className="notifications-page">
      <div className="notifications-status-bar">
        <span>9:41</span>
        <span>📶 📡 🔋</span>
      </div>

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
  );
}

export default Notifications;
