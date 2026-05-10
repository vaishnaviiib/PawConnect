import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp/SignUp";
import ApplicationForm from "./pages/ApplicationForm/ApplicationForm";
import BrowseDogs from "./pages/BrowseDogs/BrowseDogs";
import DogProfile from "./pages/DogProfile/DogProfile";
import Applications from "./pages/Applications/Applications";
import Notifications from "./pages/Notifications/Notifications";
import Profile from "./pages/Profile/Profile";
import ShelterDashboard from "./pages/ShelterDashboard/ShelterDashboard";
import CreateDogProfile from "./pages/CreateDogProfile/CreateDogProfile";
import ReviewApplications from "./pages/ReviewApplications/ReviewApplications";
import ManageAppointments from "./pages/ManageAppointments/ManageAppointments";

// Defines the app's top-level route map for adopter and shelter flows.
function App() {
  return (
    <BrowserRouter>
      {/* Each route renders a standalone mobile-style page inside the demo app. */}
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/application-form" element={<ApplicationForm />} />
        <Route path="/browse" element={<BrowseDogs />} />
        <Route path="/dog/:id" element={<DogProfile />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/shelter" element={<ShelterDashboard />} />
        <Route path="/shelter/dogs/new" element={<CreateDogProfile />} />
        <Route path="/shelter/applications" element={<ReviewApplications />} />
        <Route path="/shelter/appointments" element={<ManageAppointments />} />
        <Route path="/shelter-dashboard" element={<ShelterDashboard />} />
        <Route path="/create-dog" element={<CreateDogProfile />} />
        <Route path="/review-applications" element={<ReviewApplications />} />
        <Route path="/manage-appointments" element={<ManageAppointments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
