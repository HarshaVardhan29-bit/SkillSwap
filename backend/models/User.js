// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    bio: {
      type: String,
      default: "",
      trim: true,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    // Gamification fields
    points: {
      type: Number,
      default: 0,
    },
    badges: [
      {
        type: String,
        trim: true,
      },
    ],
    sessionsHosted: {
      type: Number,
      default: 0,
    },
    sessionsAttended: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    // Availability for "Need Help Now"
    isAvailable: {
      type: Boolean,
      default: false,
    },
    availabilityStatus: {
      type: String,
      enum: ["online", "busy", "offline"],
      default: "offline",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
