import express from "express";
import mongoose from "mongoose";

import Application from "../models/Application.js";
import Dog from "../models/Dog.js";

const router = express.Router();

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

router.post("/", async (req, res, next) => {
  try {
    const {
      userId,
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
      { key: "userId", value: userId },
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

    const dog = await Dog.findById(dogId);

    if (!dog) {
      return res.status(404).json({
        success: false,
        message: "Dog not found",
      });
    }

    const application = await Application.create({
      userId,
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

router.get("/", async (req, res, next) => {
  try {
    const { userId, shelterId } = req.query;
    const filters = {};

    if (userId) {
      if (!isValidObjectId(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid userId",
        });
      }

      filters.userId = userId;
    }

    if (shelterId) {
      if (!isValidObjectId(shelterId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid shelterId",
        });
      }

      filters.shelterId = shelterId;
    }

    const applications = await Application.find(filters)
      .populate("dogId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      filters: {
        userId: userId || null,
        shelterId: shelterId || null,
      },
      data: applications,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
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

    const application = await Application.findByIdAndUpdate(
      id,
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
