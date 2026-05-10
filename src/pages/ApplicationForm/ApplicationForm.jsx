import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ApplicationForm.css";
import BottomNav from "../../components/BottomNav/BottomNav";
import PhoneLayout from "../../components/PhoneLayout/PhoneLayout";
import { getCurrentUser, getDataMode, saveGeneralApplication } from "../../lib/pawApi";

// Saves the adopter's reusable household information before dog-specific interest.
function ApplicationForm() {
  const navigate = useNavigate();
  const apiOnlyMode = getDataMode() === "api";
  const currentUser = getCurrentUser();

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    housingType: "",
    householdSize: "",
    hasYard: "",
    petExperience: "",
    currentPets: "",
    reason: "",
  });
  const [status, setStatus] = useState("");

  // Updates the matching form field without changing the rest of the draft.
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Persists the general application locally and moves the user into browsing.
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      saveGeneralApplication({
        applicantName: currentUser?.name || "",
        email: currentUser?.email || "",
        phone: formData.phone,
        address: formData.address,
        housingType: formData.housingType,
        householdSize: formData.householdSize,
        hasYard: formData.hasYard,
        petExperience: formData.petExperience,
        currentPets: formData.currentPets,
        reason: formData.reason,
      });

      setStatus("General application saved locally. You can now browse dogs and express interest.");
      navigate("/browse");
    } catch (error) {
      setStatus(error.message || "Could not save your application.");
    }
  };

  return (
    <PhoneLayout>
      <div className="application-page">
        <div className="application-container">
          {/* This form is intentionally broad so it can be reused for multiple dogs. */}
          <h1 className="application-title">General Application</h1>
          <p className="application-subtitle">
            Complete this once so you can send your application to dogs you are interested in.
          </p>
          {apiOnlyMode ? (
            <p className="application-subtitle">
              API mode is enabled. This form is local-only until backend general-application endpoints are connected.
            </p>
          ) : null}
          {status ? <p className="application-subtitle">{status}</p> : null}

          <form className="application-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />

            <select
              name="housingType"
              value={formData.housingType}
              onChange={handleChange}
            >
              <option value="">Housing Type</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Townhome">Townhome</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="text"
              name="householdSize"
              placeholder="Household Size"
              value={formData.householdSize}
              onChange={handleChange}
            />

            <select
              name="hasYard"
              value={formData.hasYard}
              onChange={handleChange}
            >
              <option value="">Do you have a yard?</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>

            <textarea
              name="petExperience"
              placeholder="Describe your pet experience"
              value={formData.petExperience}
              onChange={handleChange}
              rows="4"
            />

            <textarea
              name="currentPets"
              placeholder="Do you currently have pets?"
              value={formData.currentPets}
              onChange={handleChange}
              rows="3"
            />

            <textarea
              name="reason"
              placeholder="Why do you want to adopt or foster?"
              value={formData.reason}
              onChange={handleChange}
              rows="4"
            />

            <button type="submit" className="application-submit-btn">
              Save Application
            </button>
          </form>
        </div>

        <BottomNav />
      </div>
    </PhoneLayout>
  );
}

export default ApplicationForm;
