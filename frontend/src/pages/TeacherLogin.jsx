import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";

const TeacherLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { ...form, role: "teacher" });
      await login(res.data.token, res.data.user);
      navigate("/sessions");
    } catch (err) {
      console.log("LOGIN ERROR:", err.response || err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full relative">
        <div className="absolute -top-10 -right-10 h-32 w-32 bg-emerald-500/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-green-500/20 blur-3xl rounded-full" />

        <div className="relative bg-slate-900/80 border border-slate-700/70 rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur">
          <div className="mb-5 text-center space-y-2">
            <p className="text-xs text-emerald-300/90 font-medium uppercase tracking-[0.2em]">
              Teacher Portal
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">
              Teacher Login
            </h2>
            <p className="text-xs text-slate-400">
              Continue your mentoring journey.
            </p>
          </div>

          {error && (
            <div className="mb-3 text-xs text-red-300 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-xs text-slate-300">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 pr-10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-slate-200 text-xs"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-medium py-2.5 rounded-lg mt-2 transition shadow-lg shadow-emerald-500/30"
            >
              Login as Teacher
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-xs text-slate-500">or</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          {/* Google Login */}
          <GoogleLoginButton role="teacher" label="Continue with Google" />

          <p className="mt-4 text-[11px] text-center text-slate-400">
            New teacher?{" "}
            <Link
              to="/register/teacher"
              className="text-emerald-300 hover:text-emerald-200 font-medium"
            >
              Create an account
            </Link>
          </p>
          <p className="mt-2 text-[11px] text-center">
            <Link to="/forgot-password" className="text-slate-500 hover:text-slate-300 text-[11px] transition-colors">
              Forgot password?
            </Link>
          </p>
          <p className="mt-2 text-[11px] text-center text-slate-400">
            Are you a student?{" "}
            <Link
              to="/login/student"
              className="text-blue-300 hover:text-blue-200 font-medium"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;
