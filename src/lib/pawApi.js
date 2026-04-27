import mockDogs from "../mockData/dogs.js";

// Centralizes API and local-storage behavior so the UI can work online or offline.
const API_BASE_URL = "http://127.0.0.1:5000";
const CURRENT_USER_KEY = "pawconnectCurrentUser";
const GENERAL_APPLICATION_KEY = "pawconnectGeneralApplication";
const SUBMITTED_APPLICATIONS_KEY = "pawconnectSubmittedApplications";
const SHELTER_DOGS_KEY = "pawconnectShelterDogs";
const APPOINTMENTS_KEY = "pawconnectAppointments";

// Guards local helper logic that expects plain objects.
const isObject = (value) => typeof value === "object" && value !== null;

// Checks whether a value looks like a Mongo-style object id before API calls.
const isObjectId = (value) => typeof value === "string" && /^[a-f0-9]{24}$/i.test(value);

// Reads JSON data from local storage and falls back safely on parse failure.
const readJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

// Persists structured data in local storage under a stable key.
const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Normalizes backend error payloads into a single message string.
const getErrorMessage = async (response) => {
  try {
    const payload = await response.json();
    return payload.message || "Request failed";
  } catch {
    return "Request failed";
  }
};

// Wraps fetch with the app's API base URL and shared JSON handling.
const apiFetch = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

// Converts backend or mock dog data into the shape expected by the UI.
const normalizeDog = (dog) => {
  const firstPhoto =
    Array.isArray(dog.photos) && dog.photos.length > 0
      ? dog.photos[0]?.previewUrl || dog.photos[0]
      : "";

  return {
    id: dog._id || dog.id,
    name: dog.name,
    breed: dog.breed || "Unknown breed",
    age: typeof dog.age === "number" ? dog.age : Number(dog.age) || 0,
    location: dog.location || "Location pending",
    distance: dog.distance || "",
    image: firstPhoto || dog.image || "",
    temperamentText: Array.isArray(dog.temperament)
      ? dog.temperament.join(", ")
      : dog.temperament || "",
    healthInfo: dog.healthInfo || "",
    description: dog.description || "",
    specialNeeds: dog.specialNeeds || "",
    adoptionType: dog.adoptionType || "",
    status: dog.status || "",
    shelter: dog.shelter || "Lone Star Rescue",
    shelterId: dog.shelterId || "",
    source: dog.source || "local",
  };
};

// Aligns application records from different sources into one frontend model.
const normalizeApplication = (application) => {
  const populatedDog = isObject(application.dogId) ? application.dogId : null;

  return {
    id: application.id || application._id || `application-${Date.now()}`,
    status: application.status || "Pending",
    applicationType: application.applicationType || "Adoption",
    applicantName: application.applicantName || "",
    email: application.email || "",
    phone: application.phone || "",
    dogId: populatedDog?._id || application.dogId || "",
    dogName: application.dogName || populatedDog?.name || "Unknown dog",
    dogBreed: application.dogBreed || populatedDog?.breed || "",
    dogImage:
      application.dogImage ||
      (Array.isArray(populatedDog?.photos) ? populatedDog.photos[0] : "") ||
      mockDogs[0].image,
    shelter: application.shelter || "Lone Star Rescue",
    shelterId: application.shelterId || "",
    createdAt: application.createdAt || new Date().toISOString(),
    source: application.source || "local",
    homeType: application.homeType || application.livingSituation || "",
    experience: application.experience || "",
    notes: application.notes || "",
  };
};

const normalizeAppointmentStatus = (status) => {
  if (status === "Pending") {
    return "Requested";
  }

  return status || "Confirmed";
};

// Standardizes appointment records for the shelter scheduling screens.
const normalizeAppointment = (appointment) => ({
  id: appointment.id || `appointment-${Date.now()}`,
  applicationId: appointment.applicationId || "",
  dogName: appointment.dogName || "Unknown dog",
  visitorName: appointment.visitorName || "Applicant",
  slot: appointment.slot || "",
  type: appointment.type || "Meet and greet",
  status: normalizeAppointmentStatus(appointment.status),
  shelter: appointment.shelter || "Lone Star Rescue",
  dogImage: appointment.dogImage || mockDogs[0].image,
});

const normalizeApplicationStatus = (status) =>
  status === "Rejected" ? "Declined" : status || "Pending";

const getApplicationDedupKey = (application) => {
  const dogKey = application.dogId || application.dogName || application.id;
  return `${String(dogKey).toLowerCase()}::${normalizeApplicationStatus(application.status)}`;
};

const dedupeApplications = (applications) => {
  const seen = new Set();

  return applications.filter((application) => {
    const key = getApplicationDedupKey(application);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

// Deduplicates merged lists by id while preserving the latest matching entry.
const mergeById = (items) => {
  const seen = new Map();
  items.forEach((item) => {
    seen.set(String(item.id), item);
  });
  return Array.from(seen.values());
};

export const getCurrentUser = () => readJson(CURRENT_USER_KEY, null);

// Saves the currently signed-in demo user for later screens.
export const saveCurrentUser = (value) => {
  writeJson(CURRENT_USER_KEY, value);
};

// Attempts backend registration, then falls back to a local-only demo account.
export const registerUser = async ({ name, email, password, role }) => {
  try {
    const payload = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    });

    const user = {
      ...payload.user,
      token: payload.token,
      source: "api",
    };

    saveCurrentUser(user);

    return {
      success: true,
      message: payload.message || "Account created successfully.",
      user,
      token: payload.token,
      source: "api",
      error: "",
    };
  } catch (error) {
    const user = {
      _id: `local-user-${Date.now()}`,
      name,
      email,
      role,
      token: "",
      source: "local",
    };

    saveCurrentUser(user);

    return {
      success: true,
      message: "Backend unavailable. Account created locally for demo flow.",
      user,
      token: "",
      source: "local",
      error: error.message,
    };
  }
};

// Stores the adopter's reusable application answers for later submissions.
export const saveGeneralApplication = (application) => {
  writeJson(GENERAL_APPLICATION_KEY, {
    ...application,
    updatedAt: new Date().toISOString(),
  });
};

export const getGeneralApplication = () => readJson(GENERAL_APPLICATION_KEY, null);

// Reads any shelter-created dogs that were saved locally in the browser.
export const getLocalShelterDogs = () => readJson(SHELTER_DOGS_KEY, []).map(normalizeDog);

// Prepends a locally created shelter dog so it appears immediately in the UI.
export const saveLocalShelterDog = (dog) => {
  const existingDogs = getLocalShelterDogs();
  writeJson(SHELTER_DOGS_KEY, [normalizeDog(dog), ...existingDogs]);
};

export const deleteLocalShelterDog = (dogId) => {
  const nextDogs = getLocalShelterDogs().filter((dog) => String(dog.id) !== String(dogId));
  writeJson(SHELTER_DOGS_KEY, nextDogs);
  return nextDogs;
};

// Creates a dog profile through the backend when possible, with local fallback.
export const createDogProfile = async (dog) => {
  const currentUser = getCurrentUser();
  const localDog = normalizeDog({
    ...dog,
    shelterId: currentUser?._id || "",
    shelter: currentUser?.name || "Lone Star Rescue",
    source: "local",
  });

  try {
    if (!currentUser?.token) {
      throw new Error("No backend token available for dog creation.");
    }

    const payload = await apiFetch("/dogs", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
      },
      body: JSON.stringify({
        name: dog.name,
        breed: dog.breed,
        age: Number(dog.age),
        size: dog.size,
        temperament: [],
        location: dog.location,
        adoptionType: dog.adoptionType,
        status: dog.status || "Available",
        description: dog.description,
        specialNeeds: dog.specialNeeds || "",
        healthInfo: dog.healthInfo,
        photos: dog.photos.map((photo) => photo?.previewUrl || photo),
      }),
    });

    const apiDog = normalizeDog({
      ...payload.data,
      shelterId: currentUser._id,
      shelter: currentUser.name,
      source: "api",
    });

    saveLocalShelterDog(apiDog);

    return {
      dog: apiDog,
      source: "api",
      error: "",
    };
  } catch (error) {
    saveLocalShelterDog(localDog);
    return {
      dog: localDog,
      source: "local",
      error: error.message,
    };
  }
};

// Loads dogs from the backend and merges them with any locally created listings.
export const getDogs = async () => {
  const localDogs = getLocalShelterDogs();

  try {
    const payload = await apiFetch("/dogs");
    const apiDogs = Array.isArray(payload.data)
      ? payload.data.map((dog) => normalizeDog({ ...dog, source: "api" }))
      : [];

    return {
      dogs: mergeById([...localDogs, ...apiDogs]),
      source: "api",
      error: "",
    };
  } catch (error) {
    return {
      dogs: mergeById([...localDogs, ...mockDogs.map((dog) => normalizeDog(dog))]),
      source: "local",
      error: error.message,
    };
  }
};

// Finds a single dog, preferring local creations before backend or mock data.
export const getDogById = async (id) => {
  const localDog = getLocalShelterDogs().find((dog) => String(dog.id) === String(id));

  if (localDog) {
    return {
      dog: localDog,
      source: localDog.source || "local",
      error: "",
    };
  }

  try {
    const payload = await apiFetch(`/dogs/${id}`);
    return {
      dog: payload.data ? normalizeDog({ ...payload.data, source: "api" }) : null,
      source: "api",
      error: "",
    };
  } catch (error) {
    const fallbackDog = mockDogs.find((dog) => String(dog.id) === String(id));
    return {
      dog: fallbackDog ? normalizeDog(fallbackDog) : null,
      source: fallbackDog ? "local" : "none",
      error: error.message,
    };
  }
};

export const getSubmittedApplications = () =>
  dedupeApplications(readJson(SUBMITTED_APPLICATIONS_KEY, []).map(normalizeApplication));

// Persists the normalized application list used by adopter and shelter flows.
const saveSubmittedApplications = (applications) => {
  writeJson(
    SUBMITTED_APPLICATIONS_KEY,
    dedupeApplications(applications.map(normalizeApplication))
  );
};

export const deleteDeclinedApplication = (applicationId) => {
  const existingApplications = getSubmittedApplications();
  const application = existingApplications.find((item) => item.id === applicationId);

  if (!application) {
    return existingApplications;
  }

  if (!["Declined", "Rejected"].includes(application.status)) {
    throw new Error("Only declined applications can be deleted.");
  }

  const nextApplications = existingApplications.filter((item) => item.id !== applicationId);
  saveSubmittedApplications(nextApplications);
  return nextApplications;
};

export const findExistingApplicationForDog = (dog) => {
  const dogId = String(dog.id || "");
  const dogName = String(dog.name || "").toLowerCase();

  return getSubmittedApplications().find((application) => {
    const applicationDogId = String(application.dogId || "");
    const applicationDogName = String(application.dogName || "").toLowerCase();

    return (
      normalizeApplicationStatus(application.status) !== "Declined" &&
      ((dogId && applicationDogId && applicationDogId === dogId) ||
        (dogName && applicationDogName === dogName))
    );
  });
};

// Creates a dog-specific application using the saved general application answers.
export const submitDogInterest = async (dog) => {
  const currentUser = getCurrentUser();
  const generalApplication = getGeneralApplication();

  if (!isObject(currentUser) || currentUser.role !== "adopter") {
    throw new Error("Please sign up as an adopter first.");
  }

  if (!isObject(generalApplication)) {
    throw new Error("Please save your general application before expressing interest.");
  }

  const existingApplication = findExistingApplicationForDog(dog);

  if (existingApplication) {
    return {
      application: existingApplication,
      source: existingApplication.source || "local",
      error: "",
      isDuplicate: true,
    };
  }

  const localApplication = normalizeApplication({
    id: `local-application-${Date.now()}`,
    status: "Submitted",
    applicationType:
      dog.adoptionType && dog.adoptionType !== "Both" ? dog.adoptionType : "Adoption",
    applicantName: currentUser.name,
    email: currentUser.email,
    phone: generalApplication.phone,
    dogId: dog.id,
    dogName: dog.name,
    dogBreed: dog.breed,
    dogImage: dog.image,
    shelter: dog.shelter || "Lone Star Rescue",
    shelterId: dog.shelterId || "",
    homeType: `${generalApplication.housingType || "Home pending"}; Yard: ${
      generalApplication.hasYard || "Unknown"
    }`,
    experience: generalApplication.petExperience || "",
    notes: [generalApplication.currentPets, generalApplication.reason, generalApplication.address]
      .filter(Boolean)
      .join("\n"),
    source: "local",
  });

  try {
    if (
      !isObjectId(currentUser._id) ||
      !isObjectId(String(dog.id)) ||
      !isObjectId(String(dog.shelterId))
    ) {
      throw new Error("Backend application route requires userId, dogId, and shelterId.");
    }

    const payload = await apiFetch("/applications", {
      method: "POST",
      body: JSON.stringify({
        userId: currentUser._id,
        dogId: String(dog.id),
        shelterId: String(dog.shelterId),
        applicantName: currentUser.name,
        email: currentUser.email,
        phone: generalApplication.phone,
        applicationType:
          dog.adoptionType && dog.adoptionType !== "Both" ? dog.adoptionType : "Adoption",
        household: generalApplication.householdSize,
        livingSituation: `${generalApplication.housingType || "Home pending"}; Yard: ${
          generalApplication.hasYard || "Unknown"
        }`,
        experience: generalApplication.petExperience || "",
        notes: [generalApplication.currentPets, generalApplication.reason, generalApplication.address]
          .filter(Boolean)
          .join("\n"),
      }),
    });

    const apiApplication = normalizeApplication({ ...payload.data, source: "api" });
    const existingApplications = getSubmittedApplications();
    saveSubmittedApplications([apiApplication, ...existingApplications]);

    return {
      application: apiApplication,
      source: "api",
      error: "",
      isDuplicate: false,
    };
  } catch (error) {
    const existingApplications = getSubmittedApplications();
    saveSubmittedApplications([localApplication, ...existingApplications]);

    return {
      application: localApplication,
      source: "local",
      error: error.message,
      isDuplicate: false,
    };
  }
};

// Retrieves application data for the current user or shelter, with local fallback.
export const getApplicationsForUser = async () => {
  const currentUser = getCurrentUser();
  const localApplications = getSubmittedApplications();

  try {
    if (!isObjectId(currentUser?._id)) {
      throw new Error("Backend applications route requires a valid user id.");
    }

    const query =
      currentUser.role === "shelter"
        ? `/applications?shelterId=${encodeURIComponent(currentUser._id)}`
        : `/applications?userId=${encodeURIComponent(currentUser._id)}`;
    const payload = await apiFetch(query);
    const apiApplications = Array.isArray(payload.data)
      ? payload.data.map((application) => normalizeApplication({ ...application, source: "api" }))
      : [];

    return {
      applications: dedupeApplications(mergeById([...localApplications, ...apiApplications])),
      source: "api",
      error: "",
    };
  } catch (error) {
    return {
      applications: dedupeApplications(localApplications),
      source: "local",
      error: error.message,
    };
  }
};

// Updates application review status and mirrors the change locally if needed.
export const updateApplicationStatus = async (applicationId, status) => {
  try {
    if (!["Approved", "Declined"].includes(status)) {
      throw new Error("Backend only supports Approved or Rejected status updates.");
    }

    if (!isObjectId(String(applicationId))) {
      throw new Error("Backend application update requires a valid application id.");
    }

    const payload = await apiFetch(`/applications/${applicationId}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: status === "Declined" ? "Rejected" : status,
      }),
    });

    const updatedApplication = normalizeApplication({ ...payload.data, source: "api" });
    const nextApplications = mergeById([
      updatedApplication,
      ...getSubmittedApplications().filter((application) => application.id !== updatedApplication.id),
    ]);
    saveSubmittedApplications(nextApplications);
    return nextApplications;
  } catch {
    const nextApplications = getSubmittedApplications().map((application) =>
      application.id === applicationId ? { ...application, status } : application
    );
    saveSubmittedApplications(nextApplications);
    return nextApplications.map(normalizeApplication);
  }
};

// Returns saved shelter visits in a consistent appointment shape.
export const getAppointments = () => readJson(APPOINTMENTS_KEY, []).map(normalizeAppointment);

export const findAppointmentForApplication = (applicationId) =>
  getAppointments().find((appointment) => appointment.applicationId === applicationId);

// Creates a locally stored visit request for an approved application.
export const requestVisitAppointment = ({ applicationId, date, time }) => {
  const application = getSubmittedApplications().find((item) => item.id === applicationId);

  if (!application) {
    throw new Error("Application not found.");
  }

  const existingAppointment = findAppointmentForApplication(applicationId);

  if (existingAppointment) {
    return existingAppointment;
  }

  const nextAppointment = normalizeAppointment({
    id: `appointment-${Date.now()}`,
    applicationId,
    dogName: application.dogName,
    visitorName: application.applicantName,
    slot: `${date} at ${time}`,
    type: "Meet and greet",
    status: "Requested",
    shelter: application.shelter,
    dogImage: application.dogImage,
  });

  const existingAppointments = getAppointments();
  writeJson(APPOINTMENTS_KEY, [nextAppointment, ...existingAppointments]);

  return nextAppointment;
};

// Updates a locally stored visit request after the shelter reviews it.
export const updateAppointmentStatus = (appointmentId, status) => {
  const nextAppointments = getAppointments().map((appointment) =>
    appointment.id === appointmentId ? { ...appointment, status } : appointment
  );

  writeJson(APPOINTMENTS_KEY, nextAppointments);

  const updatedAppointment = nextAppointments.find((appointment) => appointment.id === appointmentId);

  if (updatedAppointment?.applicationId && status === "Confirmed") {
    saveSubmittedApplications(
      getSubmittedApplications().map((application) =>
        application.id === updatedAppointment.applicationId
          ? { ...application, status: "Visit Scheduled" }
          : application
      )
    );
  }

  return nextAppointments.map(normalizeAppointment);
};

// Backward-compatible helper for any older visit-scheduling entry points.
export const scheduleVisit = ({ applicationId, date, time }) =>
  requestVisitAppointment({ applicationId, date, time });

// Builds notification items from saved application activity.
export const getApplicationNotifications = () => {
  return getSubmittedApplications().map((application) => ({
    id: application.id,
    applicationId: application.id,
    shelter: application.shelter,
    status: `${application.dogName} application ${application.status.toLowerCase()}`,
    time: "now",
    image: application.dogImage || mockDogs[0].image,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    type: application.status.toLowerCase().replace(/\s+/g, "-"),
  }));
};

// Builds notification items from scheduled shelter visits.
export const getVisitNotifications = () => {
  return getAppointments().map((appointment) => ({
    id: appointment.id,
    shelter: appointment.shelter,
    status:
      appointment.status === "Requested"
        ? `Visit request sent for ${appointment.slot}`
        : appointment.status === "Declined"
          ? `Visit request declined for ${appointment.slot}`
          : `Visit scheduled for ${appointment.slot}`,
    time: "now",
    image: appointment.dogImage || mockDogs[0].image,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    type: "visit",
  }));
};
