import express from "express";
import mongoose from "mongoose";

import Dog from "../models/Dog.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();
const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

router.get("/", async (req, res, next) => {
  try {
    const {breed, age, size} = req.query;
    const filter = {};

    if (breed) {
      filter.breed = new RegExp(breed, "i");
    }
    
    if (age) { 
      const ageNumber = Number(age);

      if (Number.isNaN(ageNumber) || ageNumber < 0) {
        return res.status(400).json({
          success: false,
          message: "Age must be a number",
        });
      }

      filter.age = ageNumber;
  }

    if (size) {
      filter.size = size;
    }

    const dogs = await Dog.find(filter).sort({ createdAt: -1 });

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

    if (!isValidObjectId(id)) {
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

    // Persist the shelter owner so later edits/applications can be authorized.
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

router.patch("/:id", protect, authorizeRoles("shelter"), async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid dog id",
      });
    }

    const allowedUpdates = [
      "name",
      "breed",
      "age",
      "size",
      "temperament",
      "location",
      "adoptionType",
      "status",
      "description",
      "specialNeeds",
      "healthInfo",
      "photos",
    ];

    // Ignore unexpected fields so shelters cannot overwrite protected data.
    const updateData = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedUpdates.includes(key))
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    // A shelter can only edit dogs it originally created.
    const dog = await Dog.findOneAndUpdate(
      { _id: id, shelterId: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!dog) {
      return res.status(404).json({
        success: false,
        message: "Dog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Dog updated successfully",
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

router.delete("/:id", protect, authorizeRoles("shelter"), async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid dog id",
      });
    }

    // A shelter can only delete dogs it originally created.
    const dog = await Dog.findOneAndDelete({ _id: id, shelterId: req.user._id });

    if (!dog) {
      return res.status(404).json({
        success: false,
        message: "Dog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Dog deleted successfully",
      data: dog,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
