import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateDogProfile.css";
import shelterDogs from "../../mockData/shelterDogs";
import { createDogProfile } from "../../lib/pawApi";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function CreateDogProfile() {
  const navigate = useNavigate();
  const recentDog = shelterDogs[0];
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    return () => {
      photoPreviews.forEach((photo) => {
        URL.revokeObjectURL(photo.previewUrl);
      });
    };
  }, [photoPreviews]);

  const previewCountLabel = useMemo(() => {
    if (photoPreviews.length === 0) {
      return "No photos selected yet";
    }

    return `${photoPreviews.length} photo${photoPreviews.length === 1 ? "" : "s"} ready`;
  }, [photoPreviews]);

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
    <main className="create-dog-page">
      <section className="create-dog-shell">
        <div className="create-dog-status">
          <span>9:41</span>
          <span>Draft Mode</span>
        </div>

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
            {isSaving ? "Saving…" : "Save mock profile"}
          </button>
          {status ? <p className="create-dog-inline-status">{status}</p> : null}
        </form>

        <section className="create-dog-preview">
          
        </section>
      </section>
    </main>
  );
}

export default CreateDogProfile;
