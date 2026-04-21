import { useNavigate, useLocation } from "react-router-dom";
import "./BottomNav.css";

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="bottom-nav">
      <button
        className={`bottom-nav-item ${location.pathname === "/" ? "active" : ""}`}
        onClick={() => navigate("/")}
      >
        <span>🏠</span>
      </button>

      <button
        className={`bottom-nav-item ${location.pathname === "/browse" ? "active" : ""}`}
        onClick={() => navigate("/browse")}
      >
        <span>🔍</span>
      </button>

      <button
        className={`bottom-nav-item ${location.pathname === "/notifications" ? "active" : ""}`}
        onClick={() => navigate("/notifications")}
      >
        <span>🔔</span>
      </button>

      <button
        className={`bottom-nav-item ${location.pathname === "/profile" ? "active" : ""}`}
        onClick={() => navigate("/profile")}
      >
        <span>👤</span>
      </button>
    </div>
  );
}

export default BottomNav;