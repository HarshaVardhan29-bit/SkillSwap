// backend/initializeAdmin.js
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Settings from "./models/Settings.js";

dotenv.config();

const initializeAdmin = async () => {
  try {
    await connectDB();
    
    // Create default admin user
    const adminExists = await User.findOne({ role: "admin" });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      
      await User.create({
        name: "Admin User",
        email: "admin@skillswap.com",
        password: hashedPassword,
        role: "admin",
        bio: "System Administrator",
        skills: ["Platform Management"]
      });
      
      console.log("✅ Admin user created:");
      console.log("Email: admin@skillswap.com");
      console.log("Password: admin123");
    } else {
      console.log("✅ Admin user already exists");
    }
    
    // Initialize default feature settings
    const defaultFeatures = [
      { featureName: "certificateGeneration", enabled: true, description: "Enable certificate generation for completed courses" },
      { featureName: "leaderboard", enabled: true, description: "Show leaderboard and rankings" },
      { featureName: "sessionCreation", enabled: true, description: "Allow users to create new sessions" },
      { featureName: "matchingFeature", enabled: true, description: "Enable automatic mentor-student matching" },
      { featureName: "chatSystem", enabled: true, description: "Enable real-time chat between users" },
      { featureName: "feedbackSystem", enabled: true, description: "Allow students to give feedback" }
    ];
    
    for (const feature of defaultFeatures) {
      const exists = await Settings.findOne({ featureName: feature.featureName });
      if (!exists) {
        await Settings.create(feature);
        console.log(`✅ Created feature setting: ${feature.featureName}`);
      }
    }
    
    console.log("🎉 Admin initialization complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Admin initialization error:", error);
    process.exit(1);
  }
};

initializeAdmin();