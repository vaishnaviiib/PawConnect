import "./Profile.css";
import BottomNav from "../../components/BottomNav/BottomNav";
import PhoneLayout from "../../components/PhoneLayout/PhoneLayout";

function Profile() {
  return (
    <PhoneLayout>
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-avatar">🐶</div>
          <h1>User Profile</h1>
          <p>Name: Karla Umanzor</p>
          <p>Email: Karla@example.com</p>
          <p>Role: Adopter</p>
        </div>

        <BottomNav />
      </div>
    </PhoneLayout>
  );
}

export default Profile;
