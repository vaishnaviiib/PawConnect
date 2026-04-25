import mongoose from "mongoose";

const connectDB = async () => {
  // Support either env var name so local/team setups are more flexible.
  const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;

  if (!mongoUri) {
    throw new Error("MongoDB connection string is missing. Set MONGO_URI or MONGO_URL.");
  }

  try {
    await mongoose.connect(mongoUri, {
      // Default to the shared project database name when none is provided.
      dbName: process.env.MONGO_DB_NAME || "pawlink",
    });

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed", error.message);
    process.exit(1);
  }
};

export default connectDB;
