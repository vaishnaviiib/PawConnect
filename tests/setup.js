import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: ".env.test" });

beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;

  if (!mongoUri) {
    throw new Error("Test MongoDB connection string is missing in .env.test");
  }

  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGO_DB_NAME || "pawlink_test",
  });
});

afterEach(async () => {
  const { collections } = mongoose.connection;

  for (const collection of Object.values(collections)) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
