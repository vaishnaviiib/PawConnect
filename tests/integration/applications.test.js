import request from "supertest";

import app from "../../app.js";

const createUserPayload = (overrides = {}) => ({
  name: "Test User",
  email: `user-${Date.now()}-${Math.random()}@example.com`,
  phone: "5551234567",
  password: "password123",
  role: "adopter",
  ...overrides,
});

const registerUser = async (payload) => {
  const response = await request(app).post("/auth/register").send(payload);

  return {
    response,
    token: response.body.token,
    user: response.body.user,
  };
};

const createDogForShelter = async (shelterToken, overrides = {}) => {
  const response = await request(app)
    .post("/dogs")
    .set("Authorization", `Bearer ${shelterToken}`)
    .send({
      name: "Buddy",
      breed: "Labrador",
      age: 3,
      size: "Large",
      location: "Chicago",
      adoptionType: "Adoption",
      status: "Available",
      description: "Friendly family dog",
      photos: ["https://example.com/buddy.jpg"],
      ...overrides,
    });

  return response;
};

describe("Applications API", () => {
  it("allows an adopter to apply for a dog", async () => {
    const shelter = await registerUser(
      createUserPayload({
        name: "Shelter Account",
        role: "shelter",
      }),
    );
    const adopter = await registerUser(
      createUserPayload({
        name: "Adopter Account",
        role: "adopter",
      }),
    );

    const dogResponse = await createDogForShelter(shelter.token);

    const response = await request(app)
      .post("/applications")
      .set("Authorization", `Bearer ${adopter.token}`)
      .send({
        dogId: dogResponse.body.data._id,
        applicationType: "Adoption",
        phone: adopter.user.phone,
        household: "Two adults",
        livingSituation: "House with yard",
        experience: "Owned dogs before",
        notes: "Ready to adopt soon",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      applicationType: "Adoption",
      applicantName: adopter.user.name,
      email: adopter.user.email,
      dogName: "Buddy",
      shelter: shelter.user.name,
      status: "Pending",
    });
  });

  it("prevents duplicate applications for the same dog", async () => {
    const shelter = await registerUser(
      createUserPayload({
        name: "Shelter Duplicate",
        role: "shelter",
      }),
    );
    const adopter = await registerUser(
      createUserPayload({
        name: "Adopter Duplicate",
        role: "adopter",
      }),
    );

    const dogResponse = await createDogForShelter(shelter.token);
    const applicationPayload = {
      dogId: dogResponse.body.data._id,
      applicationType: "Adoption",
      phone: adopter.user.phone,
    };

    await request(app)
      .post("/applications")
      .set("Authorization", `Bearer ${adopter.token}`)
      .send(applicationPayload);

    const response = await request(app)
      .post("/applications")
      .set("Authorization", `Bearer ${adopter.token}`)
      .send(applicationPayload);

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "You have already submitted an application for this dog",
    );
  });

  it("lets adopters see only their own applications and shelters see theirs", async () => {
    const shelter = await registerUser(
      createUserPayload({
        name: "Shelter Viewer",
        role: "shelter",
      }),
    );
    const adopter = await registerUser(
      createUserPayload({
        name: "Adopter Viewer",
        role: "adopter",
      }),
    );

    const dogResponse = await createDogForShelter(shelter.token);

    await request(app)
      .post("/applications")
      .set("Authorization", `Bearer ${adopter.token}`)
      .send({
        dogId: dogResponse.body.data._id,
        applicationType: "Adoption",
        phone: adopter.user.phone,
      });

    const adopterResponse = await request(app)
      .get("/applications")
      .set("Authorization", `Bearer ${adopter.token}`);

    const shelterResponse = await request(app)
      .get("/applications")
      .set("Authorization", `Bearer ${shelter.token}`);

    expect(adopterResponse.status).toBe(200);
    expect(adopterResponse.body.count).toBe(1);
    expect(adopterResponse.body.data[0].applicantName).toBe(adopter.user.name);

    expect(shelterResponse.status).toBe(200);
    expect(shelterResponse.body.count).toBe(1);
    expect(shelterResponse.body.data[0].shelter).toBe(shelter.user.name);
  });

  it("allows a shelter to approve an application", async () => {
    const shelter = await registerUser(
      createUserPayload({
        name: "Shelter Approver",
        role: "shelter",
      }),
    );
    const adopter = await registerUser(
      createUserPayload({
        name: "Adopter Approver",
        role: "adopter",
      }),
    );

    const dogResponse = await createDogForShelter(shelter.token);
    const applicationResponse = await request(app)
      .post("/applications")
      .set("Authorization", `Bearer ${adopter.token}`)
      .send({
        dogId: dogResponse.body.data._id,
        applicationType: "Adoption",
        phone: adopter.user.phone,
      });

    const response = await request(app)
      .patch(`/applications/${applicationResponse.body.data._id}`)
      .set("Authorization", `Bearer ${shelter.token}`)
      .send({ status: "Approved" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("Approved");

    const dogAfterApproval = await request(app).get(`/dogs/${dogResponse.body.data._id}`);
    expect(dogAfterApproval.status).toBe(200);
    expect(dogAfterApproval.body.data.status).toBe("Pending");
  });

  it("rejects application creation without an adopter token", async () => {
    const response = await request(app).post("/applications").send({
      dogId: "680acd8d3d2bf5f31671ce10",
      applicationType: "Adoption",
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Not authorized, no token");
  });
});
