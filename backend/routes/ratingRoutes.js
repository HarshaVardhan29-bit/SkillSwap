import express from "express";
import Rating from "../models/Rating.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Add rating (learner -> mentor) after completed session
router.post("/", auth, async (req, res) => {
  try {
    const { bookingId, stars, comment } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.learner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (booking.status !== "completed") {
      return res.status(400).json({ message: "Session not completed" });
    }

    const rating = await Rating.create({
      booking: booking._id,
      mentor: booking.mentor,
      learner: booking.learner,
      stars,
      comment
    });

    // Update mentor average rating
    const mentor = await User.findById(booking.mentor);
    const total = mentor.totalRatings + 1;
    const avg = (mentor.averageRating * mentor.totalRatings + stars) / total;
    mentor.totalRatings = total;
    mentor.averageRating = avg;
    await mentor.save();

    res.status(201).json(rating);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
