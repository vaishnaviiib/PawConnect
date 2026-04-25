import mongoose from "mongoose";

// Applications connect an adopter, a dog, and the shelter managing that dog.
const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
    dogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dog",
      required: [true, "Dog id is required"],
    },
    shelterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Shelter id is required"],
    },
    applicantName: {
      type: String,
      required: [true, "Applicant name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    applicationType: {
      type: String,
      enum: ["Adoption", "Foster"],
      required: [true, "Application type is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    household: {
      type: String,
      trim: true,
      default: "",
    },
    livingSituation: {
      type: String,
      trim: true,
      default: "",
    },
    experience: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

applicationSchema.index({ userId: 1, dogId: 1 }, { unique: true });
applicationSchema.index({ shelterId: 1, status: 1, createdAt: -1 });

const Application = mongoose.model("Application", applicationSchema);

export default Application;
