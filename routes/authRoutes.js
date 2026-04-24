import express from 'express';
import { registerUser, loginUser, getCurrentUser } from '../controllers/authController.js';
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login a user
router.post('/login', loginUser);

// Get current authenticated user
router.get("/me", protect, getCurrentUser);

export default router;