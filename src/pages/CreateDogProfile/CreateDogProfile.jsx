import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateDogProfile.css";
import PhoneLayout from "../../components/PhoneLayout/PhoneLayout";
import shelterDogs from "../../mockData/shelterDogs";
import { createDogProfile } from "../../lib/pawApi";

// Limits uploads to the image formats expected by the demo profile form.
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Lets shelter staff create a new dog profile with optional local photo previews.
function CreateDogProfile() {
  const navigate = useNavigate();
  const recentDog = shelterDogs[0];
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Releases object URLs so repeated photo editing does not leak browser memory.
  useEffect(() => {
    return () => {
      photoPreviews.forEach((photo) => {
        URL.revokeObjectURL(photo.previewUrl);
      });
    };
  }, [photoPreviews]);

  // Provides a short status label for the current preview gallery state.
  const previewCountLabel = useMemo(() => {
    if (photoPreviews.length === 0) {
      return "No photos selected yet";
    }

    return `${photoPreviews.length} photo${photoPreviews.length === 1 ? "" : "s"} ready`;
  }, [photoPreviews]);

  // Filters uploads to supported image types and stores preview metadata for each file.
  const handlePhotoSelection = (event) => {
    const selectedFiles = Array.from(event.target.files || []).filter((file) =>
      ACCEPTED_IMAGE_TYPES.includes(file.type)
    );

    const nextPhotos = selectedFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      name: file.name,
      previewUrl: URL.createObjectURL(file),
    }));

    setPhotoPreviews((prev) => [...prev, ...nextPhotos]);
    event.target.value = "";
  };

  // Removes a previewed image and immediately revokes its object URL.
  const handleRemovePhoto = (photoId) => {
    setPhotoPreviews((prev) => {
      const nextPhotos = prev.filter((photo) => photo.id !== photoId);
      const removedPhoto = prev.find((photo) => photo.id === photoId);

      if (removedPhoto) {
        URL.revokeObjectURL(removedPhoto.previewUrl);
      }

      return nextPhotos;
    });
  };

  // Builds the profile payload from form values and saves it through the shared data layer.
  const handleSaveMockProfile = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus("");

    const formData = new FormData(event.currentTarget);
    const mockProfile = {
      id: `mock-dog-${Date.now()}`,
      name: formData.get("name"),
      breed: formData.get("breed"),
      age: formData.get("age"),
      size: formData.get("size"),
      location: formData.get("location"),
      adoptionType: formData.get("adoptionType"),
      status: "Draft",
      description: formData.get("description"),
      healthInfo: formData.get("healthInfo"),
      image: photoPreviews[0]?.previewUrl || recentDog.image,
      photos: photoPreviews.map((photo) => ({
        name: photo.name,
        previewUrl: photo.previewUrl,
      })),
    };

    const result = await createDogProfile(mockProfile);
    setStatus(
      result.source === "api"
        ? "Dog profile saved to the backend."
        : `Dog profile saved locally. ${result.error || ""}`.trim()
    );
    navigate("/shelter-dashboard");
    setIsSaving(false);
  };

  return (
    <PhoneLayout>
      <main className="create-dog-page">
        <section className="create-dog-shell">
          {/* The form mirrors the inputs a shelter dashboard would eventually collect. */}
          <header className="create-dog-header">
            <h1>Create Dog Profile</h1>
            <p>Use this mock form to preview how a new listing will feel for shelter staff.</p>
          </header>

          <form className="create-dog-form" onSubmit={handleSaveMockProfile}>
            <input type="text" name="name" placeholder="Dog name" defaultValue="Poppy" />
            <input
              type="text"
              name="breed"
              placeholder="Breed"
              defaultValue="Australian Shepherd Mix"
            />
            <div className="create-dog-grid">
              <input type="number" name="age" placeholder="Age" defaultValue="2" />
              <select name="size" defaultValue="Medium">
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
              </select>
            </div>
            <input type="text" name="location" placeholder="Location" defaultValue="Addison, TX" />
            <select name="adoptionType" defaultValue="Both">
              <option>Adoption</option>
              <option>Foster</option>
              <option>Both</option>
            </select>
            <textarea
              name="description"
              rows="4"
              placeholder="Short description"
              defaultValue="Poppy is cheerful, quick to warm up, and happiest after a game of fetch."
            />
            <textarea
              name="healthInfo"
              rows="3"
              placeholder="Health and care notes"
              defaultValue="Spayed, vaccinated, and comfortable with gentle introductions."
            />

            {/* Upload controls stay separate so photo state can be managed independently. */}
            <section className="create-dog-upload-panel">
              <div className="create-dog-upload-copy">
                <h2>Dog photos</h2>
                <p>{previewCountLabel}</p>
              </div>

              <label className="create-dog-upload-field">
                <span>Select photos</span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  multiple
                  onChange={handlePhotoSelection}
                />
              </label>

              {/* Preview cards show every selected photo before the profile is saved. */}
              {photoPreviews.length > 0 ? (
                <div className="create-dog-photo-grid">
                  {photoPreviews.map((photo) => (
                    <article key={photo.id} className="create-dog-photo-card">
                      <img src={photo.previewUrl} alt={photo.name} />
                      <div className="create-dog-photo-meta">
                        <p>{photo.name}</p>
                        <button type="button" onClick={() => handleRemovePhoto(photo.id)}>
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}
            </section>

            <button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save mock profile"}
            </button>
            {status ? <p className="create-dog-inline-status">{status}</p> : null}
          </form>

          <section className="create-dog-preview"></section>
        </section>
      </main>
    </PhoneLayout>
  );
}

export default CreateDogProfile;
