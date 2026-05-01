import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    certificateId: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["session_hosted", "session_completed", "milestone_achievement"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    skillName: {
      type: String,
      required: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },
    issuedDate: {
      type: Date,
      default: Date.now,
    },
    pdfUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Certificate = mongoose.model("Certificate", certificateSchema);
export default Certificate;