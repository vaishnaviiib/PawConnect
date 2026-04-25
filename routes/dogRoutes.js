import express from "express";
import mongoose from "mongoose";

import Dog from "../models/Dog.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();
const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);
const mapDogForClient = (dog) => {
  const rawDog = dog.toObject ? dog.toObject() : dog;

  return {
    ...rawDog,
    id: String(rawDog._id),
    image: rawDog.photos?.[0] || "",
  };
};

router.get("/", async (req, res, next) => {
  try {
    const {
      breed,
      size,
      location,
      adoptionType,
      status,
      minAge,
      maxAge,
      page = 1,
      limit = 20,
    } = req.query;

    const filters = {};

    if (breed) filters.breed = breed;
    if (size) filters.size = size;
    if (location) filters.location = location;
    if (adoptionType) filters.adoptionType = adoptionType;
    if (status) filters.status = status;

    if (minAge || maxAge) {
      const parsedMinAge = minAge ? Number(minAge) : null;
      const parsedMaxAge = maxAge ? Number(maxAge) : null;

      if (
        (minAge && (Number.isNaN(parsedMinAge) || parsedMinAge < 0)) ||
        (maxAge && (Number.isNaN(parsedMaxAge) || parsedMaxAge < 0))
      ) {
        return res.status(400).json({
          success: false,
          message: "Age filters must be non-negative numbers",
        });
      }

      if (
        parsedMinAge !== null &&
        parsedMaxAge !== null &&
        parsedMinAge > parsedMaxAge
      ) {
        return res.status(400).json({
          success: false,
          message: "minAge cannot be greater than maxAge",
        });
      }

      filters.age = {};
      if (parsedMinAge !== null) filters.age.$gte = parsedMinAge;
      if (parsedMaxAge !== null) filters.age.$lte = parsedMaxAge;
    }

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const skip = (pageNumber - 1) * limitNumber;

    const [dogs, total] = await Promise.all([
      Dog.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limitNumber),
      Dog.countDocuments(filters),
    ]);

    res.status(200).json({
      success: true,
      page: pageNumber,
      limit: limitNumber,
      total,
      count: dogs.length,
      data: dogs.map(mapDogForClient),
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
      data: mapDogForClient(dog),
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
      data: mapDogForClient(dog),
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

    if (String(dog.shelterId) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this dog profile",
      });
    }

    const disallowedFields = ["_id", "shelterId", "createdAt", "updatedAt"];
    const updates = { ...req.body };
    disallowedFields.forEach((field) => delete updates[field]);

    const updatedDog = await Dog.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Dog updated successfully",
      data: mapDogForClient(updatedDog),
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

    if (String(dog.shelterId) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this dog profile",
      });
    }

    await dog.deleteOne();

    res.status(200).json({
      success: true,
      message: "Dog deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
