import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";
import { sendWelcomeEmail, sendOTPEmail, sendPasswordReminderEmail } from "../services/emailService.js";

const router = express.Router();

// In-memory OTP store (use Redis in production)
const otpStore = new Map();

/**
 * POST /api/auth/google
 * Google Firebase login
 */
router.post("/google", async (req, res) => {
  try {
    const { name, email, googleId, role } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({ message: "Invalid Google credentials." });
    }

    // Find or create user
    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      // New user - create account
      const hashedPassword = await bcrypt.hash(googleId + (process.env.JWT_SECRET || "fallback"), 10);
      user = await User.create({
        name: name || email.split("@")[0],
        email,
        password: hashedPassword,
        role: role || "student",
        googleId,
        hasSetPassword: false, // Google user hasn't set custom password yet
        bio: "",
        skills: [],
      });

      isNewUser = true;

      // Send welcome email (non-blocking)
      sendWelcomeEmail(email, user.name).catch(err =>
        console.error("Welcome email failed:", err.message)
      );
    } else {
      // Existing user - update googleId if not set
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }

      // Check if user needs password reminder (Google user without password)
      if (user.googleId && !user.hasSetPassword) {
        const daysSinceReminder = user.passwordReminderSent 
          ? (Date.now() - user.passwordReminderSent.getTime()) / (1000 * 60 * 60 * 24)
          : 999;

        // Send reminder if not sent in last 7 days
        if (daysSinceReminder > 7) {
          sendPasswordReminderEmail(email, user.name).catch(err =>
            console.error("Password reminder email failed:", err.message)
          );
          user.passwordReminderSent = new Date();
          await user.save();
        }
      }
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Google login successful",
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        hasSetPassword: user.hasSetPassword,
        isNewUser
      },
    });
  } catch (err) {
    console.error("Google login error:", err.message);
    console.error("Full error:", err);
    res.status(500).json({ message: "Server error during Google login: " + err.message });
  }
});

/**
 * POST /api/auth/register
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, bio, skills } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Name, email, password and role are required." });
    }

    if (!["student", "teacher"].includes(role)) {
      return res.status(400).json({ message: "Role must be either 'student' or 'teacher'." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      bio: bio || "",
      skills: Array.isArray(skills) ? skills : [],
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, name).catch(err =>
      console.error("Welcome email failed:", err.message)
    );

    res.status(201).json({
      message: "Registered successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error while registering user." });
  }
});

/**
 * POST /api/auth/login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No account found with this email." });
    }

    if (role && user.role !== role) {
      return res.status(400).json({ message: `This account is not registered as a ${role}.` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password. Please try again." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Logged in successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error while logging in." });
  }
});

/**
 * GET /api/auth/me
 */
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/auth/forgot-password
 * Send OTP to email
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account found with this email." });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStore.set(email, { otp, expiresAt });

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.json({ message: "OTP sent to your email address." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Failed to send OTP. Please try again." });
  }
});

/**
 * POST /api/auth/verify-otp
 * Verify OTP
 */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required." });

    const stored = otpStore.get(email);
    if (!stored) return res.status(400).json({ message: "OTP not found. Please request a new one." });

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    if (stored.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    // OTP verified - generate a reset token
    const resetToken = jwt.sign({ email, purpose: "reset" }, process.env.JWT_SECRET, { expiresIn: "15m" });
    otpStore.delete(email);

    res.json({ message: "OTP verified successfully.", resetToken });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: "Reset token and new password are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    if (decoded.purpose !== "reset") {
      return res.status(400).json({ message: "Invalid reset token." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email: decoded.email }, { password: hashedPassword });

    res.json({ message: "Password reset successfully. You can now login." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/auth/set-password
 * Set password for Google users (requires authentication)
 */
router.post("/set-password", auth, async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Hash and set password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.hasSetPassword = true;
    await user.save();

    res.json({ message: "Password set successfully. You can now login with email and password." });
  } catch (err) {
    console.error("Set password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PUT /api/auth/update-profile
 * Update user profile (requires authentication)
 */
router.put("/update-profile", auth, async (req, res) => {
  try {
    const { name, bio, skills } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update fields
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (Array.isArray(skills)) user.skills = skills;

    await user.save();

    res.json({ 
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        skills: user.skills,
        hasSetPassword: user.hasSetPassword,
        googleId: user.googleId
      }
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
