import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";
import Session from "../models/Session.js";
import Booking from "../models/Booking.js";
import Announcement from "../models/Announcement.js";
import Settings from "../models/Settings.js";
import { verifyAdmin } from "../middleware/adminAuth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'announcement-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Image Upload for Announcements
router.post("/upload-image", verifyAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }
    
    // Return the URL path for the uploaded image
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (err) {
    console.error("Image upload error:", err);
    res.status(500).json({ message: "Failed to upload image" });
  }
});

// Dashboard Analytics
router.get("/dashboard", verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalSessions = await Session.countDocuments();
    const approvedSessions = await Session.countDocuments({ status: "approved" });
    const completedBookings = await Booking.countDocuments({ status: "completed" });
    
    // Top mentors by completed sessions
    const topMentors = await Booking.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: "$mentor", completedSessions: { $sum: 1 } } },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "mentor" } },
      { $unwind: "$mentor" },
      { $sort: { completedSessions: -1 } },
      { $limit: 5 },
      { $project: { name: "$mentor.name", completedSessions: 1 } }
    ]);

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const recentSessions = await Session.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    res.json({
      totalUsers,
      activeUsers,
      totalSessions,
      approvedSessions,
      completedBookings,
      topMentors,
      recentActivity: {
        newUsers: recentUsers,
        newSessions: recentSessions
      }
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// User Management
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const { search, role, status } = req.query;
    const filter = {};
    
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") }
      ];
    }
    
    if (role && role !== "all") {
      filter.role = role;
    }
    
    if (status === "active") {
      filter.isActive = true;
    } else if (status === "inactive") {
      filter.isActive = false;
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user status
router.patch("/users/:id/status", verifyAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (err) {
    console.error("Update user status error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user role
router.patch("/users/:id/role", verifyAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!["student", "teacher", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (err) {
    console.error("Update user role error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Session Management
router.get("/sessions", verifyAdmin, async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    
    if (status && status !== "all") {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") }
      ];
    }

    const sessions = await Session.find(filter)
      .populate("mentor", "name email")
      .sort({ createdAt: -1 });

    res.json(sessions);
  } catch (err) {
    console.error("Get sessions error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update session status
router.patch("/sessions/:id/status", verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!["pending", "approved", "blocked"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("mentor", "name email");
    
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    
    res.json(session);
  } catch (err) {
    console.error("Update session status error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Announcements Management
router.get("/announcements", verifyAdmin, async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    console.error("Get announcements error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/announcements", verifyAdmin, async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    
    const announcement = await Announcement.create({
      title,
      description,
      imageUrl,
      createdBy: req.user.id
    });
    
    const populatedAnnouncement = await Announcement.findById(announcement._id)
      .populate("createdBy", "name");
    
    res.status(201).json(populatedAnnouncement);
  } catch (err) {
    console.error("Create announcement error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/announcements/:id/visibility", verifyAdmin, async (req, res) => {
  try {
    const { visible } = req.body;
    
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { visible },
      { new: true }
    ).populate("createdBy", "name");
    
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    
    res.json(announcement);
  } catch (err) {
    console.error("Update announcement visibility error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/announcements/:id", verifyAdmin, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    
    res.json({ message: "Announcement deleted successfully" });
  } catch (err) {
    console.error("Delete announcement error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Feature Settings
router.get("/settings", verifyAdmin, async (req, res) => {
  try {
    const settings = await Settings.find().sort({ featureName: 1 });
    res.json(settings);
  } catch (err) {
    console.error("Get settings error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/settings/:id", verifyAdmin, async (req, res) => {
  try {
    const { enabled } = req.body;
    
    const setting = await Settings.findByIdAndUpdate(
      req.params.id,
      { enabled },
      { new: true }
    );
    
    if (!setting) {
      return res.status(404).json({ message: "Setting not found" });
    }
    
    res.json(setting);
  } catch (err) {
    console.error("Update setting error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;