import express from "express";
import mongoose from "mongoose";

import Application from "../models/Application.js";
import Dog from "../models/Dog.js";
import User from "../models/User.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

router.post("/", protect, authorizeRoles("adopter"), async (req, res, next) => {
  try {
    const {
      dogId,
      shelterId,
      applicantName,
      email,
      phone,
      applicationType,
      household,
      livingSituation,
      experience,
      notes,
    } = req.body;

    const idsToValidate = [
      { key: "dogId", value: dogId },
      { key: "shelterId", value: shelterId },
    ];

    const invalidId = idsToValidate.find(({ value }) => !isValidObjectId(value));

    if (invalidId) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${invalidId.key}`,
      });
    }

    // Only the owning shelter should receive applications for a dog.
    const dog = await Dog.findById(dogId).select("shelterId");

    if (!dog) {
      return res.status(404).json({
        success: false,
        message: "Dog not found",
      });
    }

    if (!dog.shelterId) {
      return res.status(400).json({
        success: false,
        message: "Dog is missing shelter ownership data",
      });
    }

    const shelter = await User.findOne({ _id: shelterId, role: "shelter" }).select("_id");

    if (!shelter) {
      return res.status(404).json({
        success: false,
        message: "Shelter not found",
      });
    }

    if (dog.shelterId.toString() !== shelterId) {
      return res.status(400).json({
        success: false,
        message: "Dog does not belong to the provided shelter",
      });
    }

    const application = await Application.create({
      userId: req.user._id,
      dogId,
      shelterId,
      applicantName,
      email,
      phone,
      applicationType,
      household,
      livingSituation,
      experience,
      notes,
    });

    const populatedApplication = await Application.findById(application._id).populate(
      "dogId"
    );

    res.status(201).json({
      success: true,
      message: "Application created successfully",
      data: populatedApplication,
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

router.get("/", protect, async (req, res, next) => {
  try {
    const filters = {};

    // Scope application visibility to the logged-in user’s role.
    if (req.user.role === "adopter") {
      filters.userId = req.user._id;
    } else if (req.user.role === "shelter") {
      filters.shelterId = req.user._id;
    } else {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access applications",
      });
    }

    const applications = await Application.find(filters)
      .populate("dogId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      filters: {
        userId: req.user.role === "adopter" ? req.user._id : null,
        shelterId: req.user.role === "shelter" ? req.user._id : null,
      },
      data: applications,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", protect, authorizeRoles("shelter"), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowedStatuses = ["Approved", "Rejected"];

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application id",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Approved or Rejected",
      });
    }

    // Shelters can only update applications that belong to their own account.
    const application = await Application.findOneAndUpdate(
      { _id: id, shelterId: req.user._id },
      { status },
      { new: true, runValidators: true }
    ).populate("dogId");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Application ${status.toLowerCase()}`,
      data: application,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
