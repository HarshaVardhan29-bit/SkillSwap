import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full relative">
        <div className="absolute -top-10 -right-10 h-32 w-32 bg-emerald-500/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-indigo-500/20 blur-3xl rounded-full" />

        <div className="relative bg-slate-900/80 border border-slate-700/70 rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur">
          <div className="mb-5 text-center space-y-2">
            <p className="text-xs text-emerald-300/90 font-medium uppercase tracking-[0.2em]">
              Welcome back
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">
              Login to SkillSwap
            </h2>
            <p className="text-xs text-slate-400">
              Choose your role to continue
            </p>
          </div>

          <div className="space-y-3">
            <Link
              to="/login/student"
              className="block w-full bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium py-3 rounded-lg transition shadow-lg shadow-blue-500/30 text-center"
            >
              Login as Student
            </Link>
            <Link
              to="/login/teacher"
              className="block w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-medium py-3 rounded-lg transition shadow-lg shadow-emerald-500/30 text-center"
            >
              Login as Teacher
            </Link>
          </div>

          <p className="mt-4 text-[11px] text-center text-slate-400">
            New to SkillSwap?{" "}
            <Link
              to="/register"
              className="text-emerald-300 hover:text-emerald-200 font-medium"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
