import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["Tech", "Soft Skills", "Design", "Art", "Languages", "Other"],
      default: "Other"
    },
    sessionType: {
      type: String,
      enum: ["Exam Revision", "Lab Help", "Project Guidance", "Placement Prep", "Mini Workshop", "General Learning"],
      default: "General Learning"
    },
    description: { type: String, required: true },
    durationMinutes: { type: Number, default: 60 },
    preferredTime: { type: String },
    isActive: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["pending", "approved", "blocked"],
      default: "pending"
    }
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;
