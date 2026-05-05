import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Profile = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // Profile form
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    skills: []
  });
  
  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // OTP form
  const [otpData, setOtpData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        bio: user.bio || "",
        skills: user.skills || []
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await api.put("/auth/update-profile", profileData);
      
      // Update user in context
      await login(localStorage.getItem("token"), res.data.user);
      
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: err.response?.data?.message || "Failed to update profile" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSet = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // For first-time password setup (Google users)
      await api.post("/auth/set-password", { newPassword: passwordData.newPassword });
      
      // Refresh user data
      const userRes = await api.get("/auth/me");
      await login(localStorage.getItem("token"), userRes.data);
      
      setMessage({ type: "success", text: "Password set successfully! You can now login with email and password." });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: err.response?.data?.message || "Failed to set password" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await api.post("/auth/change-password", { 
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword 
      });
      
      setMessage({ type: "success", text: "Password changed successfully!" });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: err.response?.data?.message || "Failed to change password" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOTP = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await api.post("/auth/request-password-reset-otp");
      setOtpSent(true);
      setMessage({ type: "success", text: "OTP sent to your email! Check your inbox." });
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: err.response?.data?.message || "Failed to send OTP" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPReset = async (e) => {
    e.preventDefault();
    
    if (otpData.newPassword !== otpData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (otpData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await api.post("/auth/verify-otp-and-reset", { 
        otp: otpData.otp,
        newPassword: otpData.newPassword 
      });
      
      // Refresh user data
      const userRes = await api.get("/auth/me");
      await login(localStorage.getItem("token"), userRes.data);
      
      setMessage({ type: "success", text: "Password reset successfully!" });
      setOtpData({ otp: "", newPassword: "", confirmPassword: "" });
      setShowOTPForm(false);
      setOtpSent(false);
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: err.response?.data?.message || "Failed to reset password" 
      });
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !profileData.skills.includes(skillInput.trim())) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, skillInput.trim()]
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-slate-400">Please login to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-slate-400">Manage your account and preferences</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === "success" 
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" 
              : "bg-red-500/10 border-red-500/30 text-red-300"
          }`}>
            {message.text}
          </div>
        )}

        {/* Password Warning for Google Users */}
        {user.googleId && !user.hasSetPassword && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <h3 className="text-yellow-300 font-semibold mb-1">Set a Password</h3>
                <p className="text-yellow-200/80 text-sm mb-3">
                  You're using Google Sign-In. Set a password to access your account with email & password too!
                </p>
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="text-sm px-4 py-2 bg-yellow-500 text-slate-900 font-medium rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  Set Password Now
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - User Info */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <div className="text-center">
                {/* Avatar */}
                <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-3xl font-bold mb-4 ${
                  user.role === 'admin'
                    ? 'bg-gradient-to-tr from-red-400 via-red-500 to-red-600 text-white'
                    : user.role === 'teacher'
                    ? 'bg-gradient-to-tr from-emerald-400 via-emerald-500 to-green-500 text-slate-950'
                    : 'bg-gradient-to-tr from-blue-400 via-blue-500 to-indigo-500 text-white'
                }`}>
                  {user.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                
                <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
                <p className="text-sm text-slate-400 mb-3">{user.email}</p>
                
                <span className={`inline-block text-xs px-3 py-1 rounded-full ${
                  user.role === 'admin' ? 'bg-red-500/20 text-red-300' :
                  user.role === 'teacher' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {user.role}
                </span>

                {/* Stats */}
                <div className="mt-6 pt-6 border-t border-slate-700 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Points</span>
                    <span className="text-white font-semibold">{user.points || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Sessions</span>
                    <span className="text-white font-semibold">
                      {(user.sessionsHosted || 0) + (user.sessionsAttended || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Rating</span>
                    <span className="text-white font-semibold">
                      {user.averageRating ? `⭐ ${user.averageRating.toFixed(1)}` : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Login Method */}
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <p className="text-xs text-slate-500 mb-2">Login Method</p>
                  <div className="flex items-center justify-center gap-2">
                    {user.googleId && (
                      <span className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded">
                        🔗 Google
                      </span>
                    )}
                    {user.hasSetPassword && (
                      <span className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded">
                        🔐 Password
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Form */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
              
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Skills
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="flex-1 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="Add a skill..."
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  
                  {/* Skills List */}
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>

            {/* Password Section */}
            {(showPasswordForm || user.hasSetPassword) && !showOTPForm && (
              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {user.hasSetPassword ? "Change Password" : "Set Password"}
                </h3>
                
                <form onSubmit={user.hasSetPassword ? handlePasswordChange : handlePasswordSet} className="space-y-4">
                  {/* Current Password (only if user has password) */}
                  {user.hasSetPassword && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="Enter current password"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="Enter new password"
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="Confirm new password"
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-3 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Updating..." : user.hasSetPassword ? "Update Password" : "Set Password"}
                    </button>
                    {!user.hasSetPassword && (
                      <button
                        type="button"
                        onClick={() => setShowPasswordForm(false)}
                        className="px-4 py-3 bg-slate-800 text-slate-300 font-medium rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {/* Forgot Password Link (only if user has password) */}
                  {user.hasSetPassword && (
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setShowOTPForm(true);
                        }}
                        className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        Forgot your password? Reset with OTP
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* OTP Reset Form */}
            {showOTPForm && (
              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Reset Password with OTP
                </h3>
                
                {!otpSent ? (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-400">
                      We'll send a one-time password (OTP) to your email address. Use it to reset your password.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleRequestOTP}
                        disabled={loading}
                        className="flex-1 px-4 py-3 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Sending..." : "Send OTP to Email"}
                      </button>
                      <button
                        onClick={() => {
                          setShowOTPForm(false);
                          setShowPasswordForm(true);
                        }}
                        className="px-4 py-3 bg-slate-800 text-slate-300 font-medium rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleOTPReset} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        value={otpData.otp}
                        onChange={(e) => setOtpData({ ...otpData, otp: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="000000"
                        required
                        maxLength={6}
                        pattern="[0-9]{6}"
                      />
                      <p className="text-xs text-slate-500 mt-1">Check your email for the 6-digit code</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={otpData.newPassword}
                        onChange={(e) => setOtpData({ ...otpData, newPassword: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="Enter new password"
                        required
                        minLength={6}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={otpData.confirmPassword}
                        onChange={(e) => setOtpData({ ...otpData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="Confirm new password"
                        required
                        minLength={6}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-3 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Resetting..." : "Reset Password"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowOTPForm(false);
                          setOtpSent(false);
                          setOtpData({ otp: "", newPassword: "", confirmPassword: "" });
                        }}
                        className="px-4 py-3 bg-slate-800 text-slate-300 font-medium rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={handleRequestOTP}
                        disabled={loading}
                        className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-50"
                      >
                        Didn't receive OTP? Resend
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
