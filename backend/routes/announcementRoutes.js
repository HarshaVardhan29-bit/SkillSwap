import express from "express";
import Announcement from "../models/Announcement.js";

const router = express.Router();

// Get public announcements
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find({ visible: true })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json(announcements);
  } catch (err) {
    console.error("Get public announcements error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;