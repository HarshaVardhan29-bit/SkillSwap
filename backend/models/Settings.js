import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    featureName: {
      type: String,
      required: true,
      unique: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;