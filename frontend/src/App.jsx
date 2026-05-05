import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { getRedirectResult } from "firebase/auth";
import { auth } from "./firebase";
import { useAuth } from "./context/AuthContext";
import api from "./api/axios";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import StudentLogin from "./pages/StudentLogin.jsx";
import TeacherLogin from "./pages/TeacherLogin.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import StudentRegister from "./pages/StudentRegister.jsx";
import TeacherRegister from "./pages/TeacherRegister.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Sessions from "./pages/Sessions.jsx";
import SessionDetail from "./pages/SessionDetail.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateSession from "./pages/CreateSession.jsx";
import Chat from "./pages/Chat.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Achievements from "./pages/Achievements.jsx";
import Certificates from "./pages/Certificates.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import Home from "./pages/Home.jsx";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageUsers from "./pages/admin/ManageUsers.jsx";
import ManageSessions from "./pages/admin/ManageSessions.jsx";
import Announcements from "./pages/admin/Announcements.jsx";
import FeatureSettings from "./pages/admin/FeatureSettings.jsx";

const App = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle Google redirect result globally (for mobile)
  useEffect(() => {
    const handleRedirect = async () => {
      try {
        console.log("[App.jsx] Checking for redirect result...");
        const result = await getRedirectResult(auth);
        console.log("[App.jsx] Redirect result:", result ? "User found" : "No redirect");
        
        if (result?.user) {
          const { displayName, email, uid } = result.user;
          // Check both sessionStorage and localStorage for role
          const role = sessionStorage.getItem("googleLoginRole") || 
                      localStorage.getItem("googleLoginRole") || 
                      "student";
          console.log("[App.jsx] Processing user with role:", role);
          
          // Clean up stored role
          sessionStorage.removeItem("googleLoginRole");
          localStorage.removeItem("googleLoginRole");

          const res = await api.post("/auth/google", {
            name: displayName,
            email,
            googleId: uid,
            role,
          });
          console.log("[App.jsx] Backend response received");
          await login(res.data.token, res.data.user);
          navigate("/dashboard");
        }
      } catch (err) {
        if (err.code && err.code !== "auth/no-current-user") {
          console.error("[App.jsx] Redirect result error:", err.code, err.message);
        }
      }
    };
    handleRedirect();
  }, []);

  return (
    <>
      <Navbar />      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login/student" element={<StudentLogin />} />
        <Route path="/login/teacher" element={<TeacherLogin />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/register/teacher" element={<TeacherRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/sessions/:id" element={<SessionDetail />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <Achievements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/certificates"
          element={
            <ProtectedRoute>
              <Certificates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-session"
          element={
            <ProtectedRoute>
              <CreateSession />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:bookingId"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/sessions"
          element={
            <AdminRoute>
              <ManageSessions />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/announcements"
          element={
            <AdminRoute>
              <Announcements />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <FeatureSettings />
            </AdminRoute>
          }
        />
        
        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
