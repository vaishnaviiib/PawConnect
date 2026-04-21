import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp/SignUp";
import BrowseDogs from "./pages/BrowseDogs/BrowseDogs";
import DogProfile from "./pages/DogProfile/DogProfile";
import Notifications from "./pages/Notifications/Notifications";
import Profile from "./pages/Profile/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/browse" element={<BrowseDogs />} />
        <Route path="/dog/:id" element={<DogProfile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
