import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    let token;

    try {
        //check if token exists in authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer"))
        {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, no token",
            });
        }

        //verify token and get user id from payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //attach user to request object, excluding password
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, user not found",
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, token failed",
        });
    }
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to access this resource",
            });
        }

        next();
    };
};
