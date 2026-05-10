// written by: vaishnavi boppana
// tested by: vaishnavi boppana
// debugged by: vaishnavi boppana

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Users can sign in either as adopters or shelters.
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"], 
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
        },
        role: {
            type: String,
            required: [true, "Role is required"],
            enum: ['adopter', 'shelter'],
        },
    },
    { timestamps: true }
);

// Hash passwords once before storing them in MongoDB.
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
});

// Compare a plain-text login password to the stored hash.
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
