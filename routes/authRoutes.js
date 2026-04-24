import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Public auth routes used before a user is logged in.
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
