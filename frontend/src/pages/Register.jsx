import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Register = () => {

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-lg w-full relative">
        <div className="absolute -top-10 -left-10 h-32 w-32 bg-indigo-500/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-emerald-500/20 blur-3xl rounded-full" />

        <div className="relative bg-slate-900/80 border border-slate-700/70 rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur">
          <div className="mb-5 text-center space-y-2">
            <p className="text-xs text-emerald-300/90 font-medium uppercase tracking-[0.2em]">
              Join the community
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">
              Create your SkillSwap profile
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Choose your role to get started
            </p>
          </div>

          <div className="space-y-3">
            <Link
              to="/register/student"
              className="block w-full bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium py-3 rounded-lg transition shadow-lg shadow-blue-500/30 text-center"
            >
              Register as Student
            </Link>
            <Link
              to="/register/teacher"
              className="block w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-medium py-3 rounded-lg transition shadow-lg shadow-emerald-500/30 text-center"
            >
              Register as Teacher
            </Link>
          </div>

          <p className="mt-4 text-[11px] text-center text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-300 hover:text-emerald-200 font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
