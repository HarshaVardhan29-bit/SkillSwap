import express from "express";
import Certificate from "../models/Certificate.js";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";
import { generateCertificate } from "../services/gamificationService.js";

const router = express.Router();

// Get user's certificates
router.get("/my-certificates", auth, async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.user.id })
      .populate("sessionId", "title category")
      .sort({ createdAt: -1 });

    res.json(certificates);
  } catch (err) {
    console.error("Get certificates error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Generate certificate manually (admin only)
router.post("/generate", auth, async (req, res) => {
  try {
    const { userId, type, title, description, skillName, sessionId } = req.body;

    // Check if user is admin (you might want to add admin middleware)
    const requestingUser = await User.findById(req.user.id);
    if (requestingUser.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const certificate = await generateCertificate(userId, {
      type,
      title,
      description,
      skillName,
      sessionId
    });

    const populatedCertificate = await Certificate.findById(certificate._id)
      .populate("userId", "name email")
      .populate("sessionId", "title category");

    res.status(201).json(populatedCertificate);
  } catch (err) {
    console.error("Generate certificate error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get certificate by ID (for sharing/verification)
router.get("/:certificateId", async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ 
      certificateId: req.params.certificateId 
    })
    .populate("userId", "name email")
    .populate("sessionId", "title category");

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.json(certificate);
  } catch (err) {
    console.error("Get certificate error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Download certificate (placeholder for PDF generation)
router.get("/:certificateId/download", async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ 
      certificateId: req.params.certificateId 
    })
    .populate("userId", "name email")
    .populate("sessionId", "title category");

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    // For now, return certificate data
    // In production, you would generate and return a PDF
    res.json({
      message: "Certificate download would be implemented here",
      certificate: {
        id: certificate.certificateId,
        recipient: certificate.userId.name,
        title: certificate.title,
        description: certificate.description,
        skill: certificate.skillName,
        issuedDate: certificate.issuedDate,
        platform: "SkillSwap - Peer Learning Platform"
      }
    });
  } catch (err) {
    console.error("Download certificate error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;