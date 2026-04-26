import "./Profile.css";
import BottomNav from "../../components/BottomNav/BottomNav";
import PhoneLayout from "../../components/PhoneLayout/PhoneLayout";

// Shows a simple placeholder profile summary for the adopter persona.
function Profile() {
  return (
    <PhoneLayout className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">🐶</div>
        <h1>User Profile</h1>
        <p>Name: Karla Umanzor</p>
        <p>Email: Karla@example.com</p>
        <p>Role: Adopter</p>
      </div>

      <BottomNav />
    </PhoneLayout>
  );
}

export default Profile;