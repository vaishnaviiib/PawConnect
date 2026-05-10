// written by: vaishnavi boppana
// tested by: vaishnavi boppana
// debugged by: vaishnavi boppana

import express from "express";
import mongoose from "mongoose";

import Application from "../models/Application.js";
import Dog from "../models/Dog.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);
const applicationPopulate = [
  { path: "dogId" },
  { path: "userId", select: "name email role createdAt updatedAt" },
  { path: "shelterId", select: "name email role createdAt updatedAt" },
];
const mapApplicationForClient = (application) => {
  const rawApplication = application.toObject ? application.toObject() : application;
  const rawDog = rawApplication.dogId || null;
  const rawShelter = rawApplication.shelterId || null;

  return {
    ...rawApplication,
    id: String(rawApplication._id),
    dogName: rawDog?.name || "",
    shelter: rawShelter?.name || "",
  };
};

router.post("/", protect, authorizeRoles("adopter"), async (req, res, next) => {
  try {
    const {
      dogId,
      applicantName,
      email,
      phone,
      applicationType,
      household,
      livingSituation,
      experience,
      notes,
    } = req.body;

    if (!isValidObjectId(dogId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid dogId",
      });
    }

    // Only the owning shelter should receive applications for a dog.
    const dog = await Dog.findById(dogId).select("shelterId status adoptionType");

    if (!dog) {
      return res.status(404).json({
        success: false,
        message: "Dog not found",
      });
    }

    if (dog.status !== "Available") {
      return res.status(400).json({
        success: false,
        message: "Dog is not currently available",
      });
    }

    if (applicationType === "Adoption" && dog.adoptionType === "Foster") {
      return res.status(400).json({
        success: false,
        message: "This dog is currently available for foster only",
      });
    }

    if (applicationType === "Foster" && dog.adoptionType === "Adoption") {
      return res.status(400).json({
        success: false,
        message: "This dog is currently available for adoption only",
      });
    }

    const application = await Application.create({
      userId: req.user._id,
      dogId,
      shelterId: dog.shelterId,
      applicantName: applicantName || req.user.name,
      email: email || req.user.email,
      phone,
      applicationType,
      household,
      livingSituation,
      experience,
      notes,
    });

    const populatedApplication = await Application.findById(application._id).populate(
      applicationPopulate,
    );

    res.status(201).json({
      success: true,
      message: "Application created successfully",
      data: mapApplicationForClient(populatedApplication),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already submitted an application for this dog",
      });
    }

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
    const { status = null, page = 1, limit = 20 } = req.query;
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

    if (status) {
      filters.status = status;
    }

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const skip = (pageNumber - 1) * limitNumber;

    const [applications, total] = await Promise.all([
      Application.find(filters)
        .populate(applicationPopulate)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),
      Application.countDocuments(filters),
    ]);

    res.status(200).json({
      success: true,
      page: pageNumber,
      limit: limitNumber,
      total,
      count: applications.length,
      data: applications.map(mapApplicationForClient),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", protect, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application id",
      });
    }

    const application = await Application.findById(id).populate(applicationPopulate);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const userId = String(req.user._id);
    const canView =
      (req.user.role === "adopter" && String(application.userId._id || application.userId) === userId) ||
      (req.user.role === "shelter" &&
        String(application.shelterId._id || application.shelterId) === userId);

    if (!canView) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this application",
      });
    }

    res.status(200).json({
      success: true,
      data: mapApplicationForClient(application),
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
    const application = await Application.findOne({
      _id: id,
      shelterId: req.user._id,
    }).populate("dogId");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending applications can be updated",
      });
    }

    application.status = status;
    await application.save();

    // Keep dog availability in sync with shelter decision.
    if (status === "Approved") {
      await Dog.findByIdAndUpdate(application.dogId, { status: "Pending" });
    }

    const populatedApplication = await Application.findById(application._id).populate(
      applicationPopulate,
    );

    res.status(200).json({
      success: true,
      message: `Application ${status.toLowerCase()}`,
      data: mapApplicationForClient(populatedApplication),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
