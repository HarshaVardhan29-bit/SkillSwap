import express from "express";
import Session from "../models/Session.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Create session (mentor)
router.post("/", auth, async (req, res) => {
  try {
    const { title, category, description, durationMinutes, preferredTime } = req.body;
    const session = await Session.create({
      mentor: req.user.id,
      title,
      category,
      description,
      durationMinutes,
      preferredTime
    });
    res.status(201).json(session);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all sessions with search + category filter
router.get("/", async (req, res) => {
  try {
    const { q, category } = req.query;
    const filter = { isActive: true };

    if (category && category !== "All") filter.category = category;
    if (q) {
      filter.$or = [
        { title: new RegExp(q, "i") },
        { description: new RegExp(q, "i") }
      ];
    }

    const sessions = await Session.find(filter).populate("mentor", "name averageRating");
    res.json(sessions);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Get my sessions (as mentor)
router.get("/mine", auth, async (req, res) => {
  try {
    const sessions = await Session.find({ mentor: req.user.id });
    res.json(sessions);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Get single session by ID
router.get("/:id", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate("mentor", "name email bio skills averageRating");
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.json(session);
  } catch (err) {
    console.error("Error fetching session:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
