import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const AdminLogin = () => {
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
      const res = await api.post("/auth/login", { ...form, role: "admin" });
      await login(res.data.token, res.data.user);
      navigate("/admin");
    } catch (err) {
      console.log("ADMIN LOGIN ERROR:", err.response || err);
      setError(err.response?.data?.message || "Admin login failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full relative">
        <div className="absolute -top-10 -right-10 h-32 w-32 bg-red-500/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-orange-500/20 blur-3xl rounded-full" />

        <div className="relative bg-slate-900/80 border border-slate-700/70 rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur">
          <div className="mb-5 text-center space-y-2">
            <p className="text-xs text-red-300/90 font-medium uppercase tracking-[0.2em]">
              Admin Portal
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">
              Admin Login
            </h2>
            <p className="text-xs text-slate-400">
              Access the platform management dashboard.
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
                placeholder="admin@skillswap.com"
                autoComplete="off"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/70"
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
                  autoComplete="off"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 pr-10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/70"
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
              className="w-full bg-red-500 hover:bg-red-400 text-white text-sm font-medium py-2.5 rounded-lg mt-2 transition shadow-lg shadow-red-500/30"
            >
              Login as Admin
            </button>
          </form>

          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <h4 className="text-sm font-semibold text-red-300 mb-2">Default Admin Credentials:</h4>
            <p className="text-xs text-slate-300 mb-1">Email: admin@skillswap.com</p>
            <p className="text-xs text-slate-300 mb-2">Password: admin123</p>
            <p className="text-xs text-slate-400">
              Run <code className="bg-slate-800 px-1 rounded">node initializeAdmin.js</code> in backend to create admin user
            </p>
          </div>

          <p className="mt-4 text-[11px] text-center text-slate-400">
            Not an admin?{" "}
            <Link
              to="/login"
              className="text-red-300 hover:text-red-200 font-medium"
            >
              Regular Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;