import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    session: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    learner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending"
    },
    scheduledTime: { type: Date },
    feedback: {
      rating: { type: Number, min: 1, max: 5, required: false },
      comment: { type: String, default: "" },
      submittedAt: { type: Date }
    }
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
