import "./Profile.css";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/BottomNav/BottomNav";
import PhoneLayout from "../../components/PhoneLayout/PhoneLayout";
import {
  getCurrentUser,
  getSavedUserForRole,
  logoutCurrentUser,
  switchCurrentUserRole,
} from "../../lib/pawApi";

// Shows the active demo user and lets testers switch between saved adopter and shelter sessions.
function Profile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const availableRoles = useMemo(
    () =>
      ["adopter", "shelter"]
        .map((role) => ({
          role,
          user: getSavedUserForRole(role),
        }))
        .filter((item) => item.user),
    [currentUser]
  );

  const handleRoleSwitch = (role) => {
    const nextUser = switchCurrentUserRole(role);

    if (!nextUser) {
      return;
    }

    setCurrentUser(nextUser);
    navigate(role === "shelter" ? "/shelter-dashboard" : "/browse");
  };

  const handleLogout = () => {
    logoutCurrentUser();
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <PhoneLayout className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">Profile</div>
        <h1>User Profile</h1>
        <p>Name: {currentUser?.name || "Guest"}</p>
        <p>Email: {currentUser?.email || "No active session"}</p>
        <p>Role: {currentUser?.role || "Not selected"}</p>

        {availableRoles.length > 0 ? (
          <div className="profile-session-actions">
            {availableRoles.map(({ role, user }) => (
              <button
                key={role}
                type="button"
                className={`profile-session-btn ${currentUser?.role === role ? "active" : ""}`}
                onClick={() => handleRoleSwitch(role)}
              >
                Use {role === "shelter" ? "Shelter" : "Adopter"}: {user.name}
              </button>
            ))}
          </div>
        ) : null}

        <button type="button" className="profile-logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      <BottomNav />
    </PhoneLayout>
  );
}

export default Profile;
