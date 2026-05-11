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

describe("Dogs API", () => {
  const dogPayload = {
    name: "Buddy",
    breed: "Labrador",
    age: 3,
    size: "Large",
    location: "Chicago",
    adoptionType: "Adoption",
    status: "Available",
    description: "Friendly family dog",
    photos: ["https://example.com/buddy.jpg"],
  };

  it("returns dog listings", async () => {
    const shelter = await registerUser(
      createUserPayload({
        name: "Shelter User",
        role: "shelter",
      }),
    );

    await request(app)
      .post("/dogs")
      .set("Authorization", `Bearer ${shelter.token}`)
      .send(dogPayload);

    const response = await request(app).get("/dogs");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(1);
    expect(response.body.data[0]).toMatchObject({
      name: dogPayload.name,
      breed: dogPayload.breed,
      size: dogPayload.size,
      image: dogPayload.photos[0],
    });
  });

  it("allows shelters to create dogs", async () => {
    const shelter = await registerUser(
      createUserPayload({
        name: "Shelter Creator",
        role: "shelter",
      }),
    );

    const response = await request(app)
      .post("/dogs")
      .set("Authorization", `Bearer ${shelter.token}`)
      .send(dogPayload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      name: dogPayload.name,
      breed: dogPayload.breed,
      shelterId: shelter.user._id,
    });
  });

  it("rejects dog creation from adopters", async () => {
    const adopter = await registerUser(
      createUserPayload({
        name: "Adopter User",
        role: "adopter",
      }),
    );

    const response = await request(app)
      .post("/dogs")
      .set("Authorization", `Bearer ${adopter.token}`)
      .send(dogPayload);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Not authorized to access this resource");
  });

  it("filters dogs by breed, size, and age range", async () => {
    const shelter = await registerUser(
      createUserPayload({
        name: "Shelter Filter",
        role: "shelter",
      }),
    );

    await request(app)
      .post("/dogs")
      .set("Authorization", `Bearer ${shelter.token}`)
      .send(dogPayload);

    await request(app)
      .post("/dogs")
      .set("Authorization", `Bearer ${shelter.token}`)
      .send({
        ...dogPayload,
        name: "Tiny",
        breed: "Beagle",
        age: 1,
        size: "Small",
      });

    const response = await request(app).get(
      "/dogs?breed=Labrador&size=Large&minAge=2&maxAge=5",
    );

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(1);
    expect(response.body.data[0]).toMatchObject({
      name: "Buddy",
      breed: "Labrador",
    });
  });

  it("allows a shelter to update and delete its own dog", async () => {
    const shelter = await registerUser(
      createUserPayload({
        name: "Shelter Owner",
        role: "shelter",
      }),
    );

    const createResponse = await request(app)
      .post("/dogs")
      .set("Authorization", `Bearer ${shelter.token}`)
      .send(dogPayload);

    const dogId = createResponse.body.data._id;

    const updateResponse = await request(app)
      .patch(`/dogs/${dogId}`)
      .set("Authorization", `Bearer ${shelter.token}`)
      .send({
        status: "Pending",
        location: "Austin",
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.success).toBe(true);
    expect(updateResponse.body.data).toMatchObject({
      status: "Pending",
      location: "Austin",
    });

    const deleteResponse = await request(app)
      .delete(`/dogs/${dogId}`)
      .set("Authorization", `Bearer ${shelter.token}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.success).toBe(true);
  });
});
