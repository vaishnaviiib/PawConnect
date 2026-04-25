import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import dogRoutes from "./routes/dogRoutes.js";

const app = express();

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
  void next;
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

export default app;
