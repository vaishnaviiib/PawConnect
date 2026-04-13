import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body || {};

        if (!name || !email || !password || !role) {
            return res.status(400).json({ 
                success: false,
                message: "All fields are required" });
        }

        const validRoles = ['adopter', 'shelter'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid role. Must be 'adopter' or 'shelter'" });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: "Email already in use" });
        }

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            role,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },  
            token: generateToken(user._id),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: "Email and password are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid email or password" });
        }

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token: generateToken(user._id),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};
