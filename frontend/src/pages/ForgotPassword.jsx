import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSuccess("OTP sent to your email!");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      setResetToken(res.data.resetToken);
      setSuccess("OTP verified! Set your new password.");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { resetToken, newPassword });
      setSuccess("Password reset successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ["Enter Email", "Verify OTP", "New Password"];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full relative">
        <div className="absolute -top-10 -right-10 h-32 w-32 bg-emerald-500/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-blue-500/20 blur-3xl rounded-full" />

        <div className="relative bg-slate-900/80 border border-slate-700/70 rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur">
          
          {/* Header */}
          <div className="mb-6 text-center space-y-2">
            <p className="text-xs text-emerald-300/90 font-medium uppercase tracking-[0.2em]">
              Account Recovery
            </p>
            <h2 className="text-2xl font-semibold text-white">Forgot Password</h2>
            <p className="text-xs text-slate-400">Reset your password via email OTP</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {stepLabels.map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold transition-all ${
                  step > i + 1 ? "bg-emerald-500 text-white" :
                  step === i + 1 ? "bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400" :
                  "bg-slate-800 border border-slate-600 text-slate-500"
                }`}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                {i < stepLabels.length - 1 && (
                  <div className={`h-px w-8 transition-all ${step > i + 1 ? "bg-emerald-500" : "bg-slate-700"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 text-xs text-red-300 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/40 rounded-lg px-3 py-2">
              {success}
            </div>
          )}

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  autoComplete="off"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-sm font-semibold py-2.5 rounded-lg transition"
              >
                {loading ? "Sending OTP..." : "Send OTP →"}
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Enter OTP</label>
                <p className="text-xs text-slate-500">Check your email: <span className="text-emerald-400">{email}</span></p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  required
                  maxLength={6}
                  autoComplete="off"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-3 text-2xl text-white text-center tracking-[0.5em] placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 font-mono"
                />
                <p className="text-xs text-slate-500 text-center">OTP expires in 10 minutes</p>
              </div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-sm font-semibold py-2.5 rounded-lg transition"
              >
                {loading ? "Verifying..." : "Verify OTP →"}
              </button>
              <button
                type="button"
                onClick={() => { setStep(1); setOtp(""); setError(""); setSuccess(""); }}
                className="w-full text-xs text-slate-400 hover:text-slate-200 transition"
              >
                ← Change email
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  required
                  autoComplete="new-password"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-sm font-semibold py-2.5 rounded-lg transition"
              >
                {loading ? "Resetting..." : "Reset Password ✓"}
              </button>
            </form>
          )}

          <p className="mt-4 text-[11px] text-center text-slate-400">
            Remember your password?{" "}
            <Link to="/login" className="text-emerald-300 hover:text-emerald-200 font-medium">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
