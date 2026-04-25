import request from "supertest";

import app from "../app.js";

describe("Auth API", () => {
  const adopterPayload = {
    name: "Test Adopter",
    email: "adopter@example.com",
    phone: "5551234567",
    password: "password123",
    role: "adopter",
  };

  it("registers a new user", async () => {
    const response = await request(app).post("/auth/register").send(adopterPayload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.user).toMatchObject({
      name: adopterPayload.name,
      email: adopterPayload.email.toLowerCase(),
      phone: adopterPayload.phone,
      role: adopterPayload.role,
    });
    expect(response.body.token).toBeTruthy();
  });

  it("rejects duplicate email registration", async () => {
    await request(app).post("/auth/register").send(adopterPayload);

    const response = await request(app).post("/auth/register").send({
      ...adopterPayload,
      name: "Another Name",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Email already in use");
  });

  it("logs in an existing user", async () => {
    await request(app).post("/auth/register").send(adopterPayload);

    const response = await request(app).post("/auth/login").send({
      email: adopterPayload.email,
      password: adopterPayload.password,
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user).toMatchObject({
      name: adopterPayload.name,
      email: adopterPayload.email.toLowerCase(),
      role: adopterPayload.role,
    });
    expect(response.body.token).toBeTruthy();
  });

  it("returns the current authenticated user", async () => {
    const registerResponse = await request(app)
      .post("/auth/register")
      .send(adopterPayload);

    const response = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${registerResponse.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      name: adopterPayload.name,
      email: adopterPayload.email.toLowerCase(),
      role: adopterPayload.role,
    });
  });

  it("rejects access to /auth/me without a token", async () => {
    const response = await request(app).get("/auth/me");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Not authorized, no token");
  });
});
