// backend/migrateUsers.js
// Run this script once to add role field to existing users
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const migrateUsers = async () => {
  try {
    await connectDB();
    
    // Update all users without a role to have role: "student" as default
    const result = await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: "student" } }
    );

    console.log(`Migration complete: ${result.modifiedCount} users updated`);
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
};

migrateUsers();
