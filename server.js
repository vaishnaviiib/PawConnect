import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import dogRoutes from "./routes/dogRoutes.js";


dotenv.config();

const app = express();
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

app.use(cors());
app.use(express.json());

// Mount feature routes after global middleware.
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PawLink API is running.",
    endpoints: ["/dogs", "/dogs/:id"],
  });
});

app.use("/dogs", dogRoutes);
app.use("/applications", applicationRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

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
