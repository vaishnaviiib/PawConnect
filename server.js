import dotenv from "dotenv";

import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Fail fast when required secrets are missing.
const validateEnv = () => {
  const requiredEnvVars = ["JWT_SECRET"];
  const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(", ")}`
    );
  }
};

const startServer = async () => {
  // Validate configuration before opening the database connection.
  validateEnv();
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});
