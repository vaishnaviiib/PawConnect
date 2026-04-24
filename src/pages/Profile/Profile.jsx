import "./Profile.css";
import BottomNav from "../../components/BottomNav/BottomNav";

function Profile() {
  return (
    <div className="profile-page">
      <div className="profile-status-bar">
        <span>9:41</span>
        <span>📶 📡 🔋</span>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">🐶</div>
        <h1>User Profile</h1>
        <p>Name: Karla Umanzor</p>
        <p>Email: Karla@example.com</p>
        <p>Role: Adopter</p>
      </div>

      <BottomNav />
    </div>
  );
}

export default Profile;
