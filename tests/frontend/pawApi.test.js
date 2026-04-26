import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import {
  createDogProfile,
  getApplicationNotifications,
  getApplicationsForUser,
  getAppointments,
  getDogs,
  getLocalShelterDogs,
  getSubmittedApplications,
  getVisitNotifications,
  saveCurrentUser,
  saveGeneralApplication,
  scheduleVisit,
  submitDogInterest,
  updateApplicationStatus,
} from "../../src/lib/pawApi.js";

class MemoryStorage {
  constructor() {
    this.store = new Map();
  }

  clear() {
    this.store.clear();
  }

  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }

  removeItem(key) {
    this.store.delete(key);
  }

  setItem(key, value) {
    this.store.set(key, String(value));
  }
}

const originalFetch = global.fetch;

const mockStorage = () => {
  global.localStorage = new MemoryStorage();
};

const useOfflineFetch = () => {
  global.fetch = async () => {
    throw new Error("Network unavailable during test.");
  };
};

const saveShelterUser = () => {
  saveCurrentUser({
    _id: "local-shelter-1",
    name: "North Texas Rescue",
    email: "shelter@example.com",
    role: "shelter",
    token: "",
  });
};

const saveAdopterUser = () => {
  saveCurrentUser({
    _id: "local-adopter-1",
    name: "Taylor Johnson",
    email: "taylor@example.com",
    role: "adopter",
    token: "",
  });
};

const saveDemoApplication = () => {
  saveGeneralApplication({
    applicantName: "Taylor Johnson",
    email: "taylor@example.com",
    phone: "555-0100",
    address: "123 Main St",
    housingType: "House",
    householdSize: "3",
    hasYard: "Yes",
    petExperience: "Helped foster two dogs.",
    currentPets: "One senior cat",
    reason: "Looking for an active family dog.",
  });
};

const createLocalInterest = async () => {
  saveAdopterUser();
  saveDemoApplication();

  return submitDogInterest({
    id: "local-dog-42",
    name: "Maple",
    breed: "Husky Mix",
    image: "https://example.com/maple.jpg",
    adoptionType: "Both",
    shelter: "North Texas Rescue",
    shelterId: "local-shelter-1",
  });
};

beforeEach(() => {
  mockStorage();
  useOfflineFetch();
});

afterEach(() => {
  if (originalFetch) {
    global.fetch = originalFetch;
  } else {
    delete global.fetch;
  }
});

test("createDogProfile saves a shelter dog locally when no backend token is available", async () => {
  saveShelterUser();

  const result = await createDogProfile({
    id: "draft-dog-1",
    name: "Poppy",
    breed: "Australian Shepherd Mix",
    age: "2",
    size: "Medium",
    location: "Addison, TX",
    adoptionType: "Both",
    status: "Draft",
    description: "Friendly and playful.",
    healthInfo: "Vaccinated.",
    photos: [{ name: "poppy.png", previewUrl: "blob:poppy-photo" }],
  });

  const savedDogs = getLocalShelterDogs();

  assert.equal(result.source, "local");
  assert.equal(savedDogs.length, 1);
  assert.equal(savedDogs[0].name, "Poppy");
  assert.equal(savedDogs[0].image, "blob:poppy-photo");
  assert.equal(savedDogs[0].shelter, "North Texas Rescue");
  assert.equal(savedDogs[0].status, "Draft");
});

test("submitDogInterest stores a local application for the adopter workflow", async () => {
  const result = await createLocalInterest();
  const savedApplications = getSubmittedApplications();

  assert.equal(result.source, "local");
  assert.equal(savedApplications.length, 1);
  assert.equal(savedApplications[0].applicantName, "Taylor Johnson");
  assert.equal(savedApplications[0].dogName, "Maple");
  assert.equal(savedApplications[0].applicationType, "Adoption");
  assert.equal(savedApplications[0].status, "Submitted");
  assert.match(savedApplications[0].notes, /123 Main St/);
});

test("updateApplicationStatus updates the locally saved application when API sync is unavailable", async () => {
  await createLocalInterest();
  const [application] = getSubmittedApplications();

  const updatedApplications = await updateApplicationStatus(application.id, "Approved");

  assert.equal(updatedApplications[0].status, "Approved");
  assert.equal(getSubmittedApplications()[0].status, "Approved");
});

test("scheduleVisit creates an appointment and marks the application as visit scheduled", async () => {
  await createLocalInterest();
  const [application] = getSubmittedApplications();

  const appointment = scheduleVisit({
    applicationId: application.id,
    date: "2026-04-25",
    time: "14:30",
  });

  assert.match(appointment.id, /^appointment-/);
  assert.equal(appointment.slot, "2026-04-25 at 14:30");
  assert.equal(appointment.visitorName, "Taylor Johnson");
  assert.equal(getAppointments()[0].slot, "2026-04-25 at 14:30");
  assert.equal(getSubmittedApplications()[0].status, "Visit Scheduled");
});

test("getApplicationsForUser returns saved frontend applications when the backend user id is invalid", async () => {
  await createLocalInterest();

  const result = await getApplicationsForUser();

  assert.equal(result.source, "local");
  assert.equal(result.applications.length, 1);
  assert.match(result.error, /valid user id/i);
});

test("getDogs merges locally created dogs with mock data when the API is unavailable", async () => {
  saveShelterUser();
  await createDogProfile({
    id: "draft-dog-2",
    name: "Scout",
    breed: "Border Collie Mix",
    age: "1",
    size: "Medium",
    location: "Plano, TX",
    adoptionType: "Adoption",
    status: "Draft",
    description: "Loves walks.",
    healthInfo: "Neutered.",
    photos: [],
  });

  const result = await getDogs();

  assert.equal(result.source, "local");
  assert.ok(result.dogs.length >= 4);
  assert.ok(result.dogs.some((dog) => dog.name === "Scout"));
  assert.ok(result.dogs.some((dog) => dog.name === "Max"));
});

test("notification helpers reflect saved application and visit activity", async () => {
  await createLocalInterest();
  const [application] = getSubmittedApplications();
  scheduleVisit({
    applicationId: application.id,
    date: "2026-04-26",
    time: "10:00",
  });

  const applicationNotifications = getApplicationNotifications();
  const visitNotifications = getVisitNotifications();

  assert.equal(applicationNotifications.length, 1);
  assert.match(applicationNotifications[0].status, /visit scheduled/i);
  assert.equal(visitNotifications.length, 1);
  assert.match(visitNotifications[0].status, /2026-04-26 at 10:00/);
});
