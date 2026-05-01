import express from "express";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Get leaderboard
router.get("/", async (req, res) => {
  try {
    const { type = "points", limit = 50 } = req.query;
    
    let sortCriteria = {};
    
    switch (type) {
      case "points":
        sortCriteria = { points: -1, averageRating: -1 };
        break;
      case "rating":
        sortCriteria = { averageRating: -1, totalRatings: -1, points: -1 };
        break;
      case "sessions":
        sortCriteria = { sessionsHosted: -1, points: -1 };
        break;
      default:
        sortCriteria = { points: -1, averageRating: -1 };
    }

    const users = await User.find({ 
      isActive: true,
      $or: [
        { points: { $gt: 0 } },
        { sessionsHosted: { $gt: 0 } },
        { averageRating: { $gt: 0 } }
      ]
    })
    .select("name email role points badges sessionsHosted sessionsAttended averageRating totalRatings")
    .sort(sortCriteria)
    .limit(parseInt(limit));

    // Add rank to each user
    const leaderboard = users.map((user, index) => ({
      ...user.toObject(),
      rank: index + 1
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's rank
router.get("/my-rank", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's current stats
    const user = await User.findById(userId)
      .select("name points badges sessionsHosted sessionsAttended averageRating totalRatings");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate rank based on points
    const higherRankedUsers = await User.countDocuments({
      isActive: true,
      $or: [
        { points: { $gt: user.points } },
        { 
          points: user.points,
          averageRating: { $gt: user.averageRating }
        }
      ]
    });

    const rank = higherRankedUsers + 1;

    res.json({
      user: user.toObject(),
      rank,
      totalUsers: await User.countDocuments({ isActive: true })
    });
  } catch (err) {
    console.error("My rank error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get available mentors for "Need Help Now"
router.get("/available-mentors", auth, async (req, res) => {
  try {
    const { category, skill } = req.query;
    
    const filter = {
      isActive: true,
      role: { $in: ["teacher", "admin"] },
      availabilityStatus: "online",
      isAvailable: true
    };

    if (skill) {
      filter.skills = { $regex: skill, $options: "i" };
    }

    const mentors = await User.find(filter)
      .select("name email skills averageRating totalRatings points badges availabilityStatus")
      .sort({ averageRating: -1, points: -1 })
      .limit(10);

    res.json(mentors);
  } catch (err) {
    console.error("Available mentors error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update availability status
router.patch("/availability", auth, async (req, res) => {
  try {
    const { availabilityStatus, isAvailable } = req.body;
    
    if (!["online", "busy", "offline"].includes(availabilityStatus)) {
      return res.status(400).json({ message: "Invalid availability status" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        availabilityStatus,
        isAvailable: availabilityStatus === "online" ? isAvailable : false
      },
      { new: true }
    ).select("name availabilityStatus isAvailable");

    res.json(user);
  } catch (err) {
    console.error("Update availability error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;