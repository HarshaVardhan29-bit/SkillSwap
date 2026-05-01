import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const FeatureSettings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await api.get("/admin/settings");
      setSettings(res.data);
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const toggleFeature = async (id, enabled) => {
    try {
      await api.patch(`/admin/settings/${id}`, { enabled });
      fetchSettings();
    } catch (err) {
      console.error("Error updating setting:", err);
      alert("Failed to update feature setting");
    }
  };

  const getFeatureIcon = (featureName) => {
    switch (featureName) {
      case "certificateGeneration": return "🏆";
      case "leaderboard": return "🏅";
      case "sessionCreation": return "📚";
      case "matchingFeature": return "🤝";
      case "chatSystem": return "💬";
      case "feedbackSystem": return "⭐";
      default: return "⚙️";
    }
  };

  const getFeatureDisplayName = (featureName) => {
    switch (featureName) {
      case "certificateGeneration": return "Certificate Generation";
      case "leaderboard": return "Leaderboard & Rankings";
      case "sessionCreation": return "Session Creation";
      case "matchingFeature": return "Mentor-Student Matching";
      case "chatSystem": return "Real-time Chat";
      case "feedbackSystem": return "Feedback System";
      default: return featureName;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Link to="/admin" className="text-slate-400 hover:text-white text-sm mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Feature Settings</h1>
          <p className="text-slate-400">Enable or disable platform features</p>
        </div>

        {/* Settings Grid */}
        <div className="grid gap-4">
          {settings.map((setting) => (
            <div key={setting._id} className="bg-slate-900 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-slate-800 rounded-lg flex items-center justify-center text-2xl">
                    {getFeatureIcon(setting.featureName)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {getFeatureDisplayName(setting.featureName)}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {setting.description || "No description available"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${
                    setting.enabled ? "text-green-400" : "text-red-400"
                  }`}>
                    {setting.enabled ? "Enabled" : "Disabled"}
                  </span>
                  <button
                    onClick={() => toggleFeature(setting._id, !setting.enabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      setting.enabled ? "bg-green-500" : "bg-slate-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        setting.enabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {settings.length === 0 && (
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 text-center">
            <p className="text-slate-400">No feature settings found</p>
            <p className="text-slate-500 text-sm mt-2">
              Run the initialization script to create default settings
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-300 mb-2">💡 Feature Control</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Use these toggles to enable or disable platform features in real-time. 
            Changes take effect immediately across the entire platform. 
            Disabled features will be hidden from users and their functionality will be blocked.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeatureSettings;