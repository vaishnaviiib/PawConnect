import express from "express";
import mongoose from "mongoose";

import Dog from "../models/Dog.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const dogs = await Dog.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: dogs.length,
      data: dogs,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid dog id",
      });
    }

    const dog = await Dog.findById(id);

    if (!dog) {
      return res.status(404).json({
        success: false,
        message: "Dog not found",
      });
    }

    res.status(200).json({
      success: true,
      data: dog,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", protect, authorizeRoles("shelter"), async (req, res, next) => {
  try {
    const {
      name,
      breed,
      age,
      size,
      temperament,
      location,
      adoptionType,
      status,
      description,
      specialNeeds,
      healthInfo,
      photos,
    } = req.body;

    const dog = await Dog.create({
      shelterId: req.user._id,
      name,
      breed,
      age,
      size,
      temperament,
      location,
      adoptionType,
      status,
      description,
      specialNeeds,
      healthInfo,
      photos,
    });

    res.status(201).json({
      success: true,
      message: "Dog created successfully",
      data: dog,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: Object.values(error.errors).map((item) => item.message),
      });
    }

    next(error);
  }
});

export default router;
