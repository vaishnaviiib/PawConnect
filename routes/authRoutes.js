import express from 'express';
import { registerUser, loginUser, getCurrentUser } from '../controllers/authController.js';
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public auth routes used before a user is logged in.
router.post('/register', registerUser);
router.post('/login', loginUser);

// Get current authenticated user
router.get("/me", protect, getCurrentUser);

export default router;
