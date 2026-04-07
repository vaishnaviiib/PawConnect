import mongoose from "mongoose";

const dogSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Dog name is required"],
      trim: true,
    },
    breed: {
      type: String,
      required: [true, "Breed is required"],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age cannot be negative"],
    },
    size: {
      type: String,
      enum: ["Small", "Medium", "Large", "Extra Large"],
      default: "Medium",
    },
    temperament: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    adoptionType: {
      type: String,
      enum: ["Adoption", "Foster", "Both"],
      default: "Both",
    },
    status: {
      type: String,
      enum: ["Available", "Pending", "Adopted", "Fostered"],
      default: "Available",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    specialNeeds: {
      type: String,
      trim: true,
      default: "",
    },
    healthInfo: {
      type: String,
      trim: true,
      default: "",
    },
    photos: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Dog = mongoose.model("Dog", dogSchema);

export default Dog;
