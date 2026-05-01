import express from "express";
import Booking from "../models/Booking.js";
import Session from "../models/Session.js";
import { auth } from "../middleware/auth.js";
import { awardPoints, updateRating } from "../services/gamificationService.js";

const router = express.Router();

// Request booking
router.post("/", auth, async (req, res) => {
  try {
    const { sessionId, scheduledTime } = req.body;
    const session = await Session.findById(sessionId).populate("mentor");
    if (!session) return res.status(404).json({ message: "Session not found" });

    const booking = await Booking.create({
      session: session._id,
      mentor: session.mentor._id,
      learner: req.user.id,
      scheduledTime
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update booking status (mentor)
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body; // accepted / rejected / completed
    const booking = await Booking.findById(req.params.id)
      .populate("session")
      .populate("mentor", "name")
      .populate("learner", "name");
      
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.mentor._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const oldStatus = booking.status;
    booking.status = status;
    await booking.save();

    // Award points when session is completed
    if (status === "completed" && oldStatus !== "completed") {
      // Award points to mentor for hosting
      await awardPoints(booking.mentor._id, 'HOST_SESSION', {
        sessionId: booking.session._id,
        skillName: booking.session.title
      });

      // Award points to student for attending
      await awardPoints(booking.learner._id, 'ATTEND_SESSION');

      // Check milestone bonuses
      const User = (await import("../models/User.js")).default;
      const updatedLearner = await User.findById(booking.learner._id);
      if (updatedLearner.sessionsAttended === 5) {
        await awardPoints(booking.learner._id, 'MILESTONE');
      }
    }

    res.json(booking);
  } catch (err) {
    console.error("Update booking status error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get my bookings (both as mentor & learner)
router.get("/me", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({
      $or: [{ mentor: req.user.id }, { learner: req.user.id }]
    })
      .populate("session")
      .populate("mentor", "name")
      .populate("learner", "name");
    res.json(bookings);
  } catch (err) {
    console.error("Get bookings error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete/Cancel booking (student can cancel their own booking)
router.delete("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only the learner (student) can delete their booking
    if (booking.learner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    console.error("Delete booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Submit feedback (student can give feedback after course completion)
router.patch("/:id/feedback", auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    // Validate rating is required
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating is required and must be between 1 and 5" });
    }

    const booking = await Booking.findById(req.params.id)
      .populate("mentor");
    
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only the learner (student) can submit feedback
    if (booking.learner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to submit feedback" });
    }

    // Only allow feedback for completed courses
    if (booking.status !== "completed") {
      return res.status(400).json({ message: "Can only submit feedback for completed courses" });
    }

    booking.feedback = {
      rating: rating,
      comment: comment || "",
      submittedAt: new Date()
    };

    await booking.save();

    // Update mentor's rating and award points for high ratings
    await updateRating(booking.mentor._id, rating);

    res.json({ message: "Feedback submitted successfully", booking });
  } catch (err) {
    console.error("Submit feedback error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
