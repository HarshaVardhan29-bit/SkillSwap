import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider, isMobileBrowser } from "../firebase";
import { signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const GoogleLoginButton = ({ role = "student", label = "Continue with Google" }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const processGoogleUser = async (user) => {
    const { displayName, email, uid } = user;
    const res = await api.post("/auth/google", {
      name: displayName,
      email,
      googleId: uid,
      role,
    });
    await login(res.data.token, res.data.user);
    navigate("/dashboard");
  };

  // Handle redirect result when page loads (mobile flow)
  useEffect(() => {
    const checkRedirect = async () => {
      try {
        setLoading(true);
        const result = await getRedirectResult(auth);
        if (result?.user) {
          await processGoogleUser(result.user);
        }
      } catch (err) {
        if (err.code && err.code !== "auth/no-current-user") {
          setError(err.response?.data?.message || `Error: ${err.code}`);
        }
      } finally {
        setLoading(false);
      }
    };
    checkRedirect();
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      if (isMobileBrowser()) {
        // Store role in sessionStorage so we can use it after redirect
        sessionStorage.setItem("googleLoginRole", role);
        await signInWithRedirect(auth, googleProvider);
        // Page will redirect - execution stops here
      } else {
        // Desktop: use popup
        const result = await signInWithPopup(auth, googleProvider);
        await processGoogleUser(result.user);
      }
    } catch (err) {
      console.error("Google login error:", err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Login cancelled.");
      } else if (err.code === "auth/popup-blocked") {
        setError("Popup blocked. Please allow popups or try again.");
      } else {
        setError(err.response?.data?.message || `Error: ${err.code || "Unknown"}`);
      }
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="group relative w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="relative flex items-center justify-center gap-3">
          {loading ? (
            <>
              <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              <span className="text-slate-300">Signing in...</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-slate-200 group-hover:text-white transition-colors">{label}</span>
              <svg className="ml-auto h-4 w-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </div>
      </button>
      {error && <p className="mt-2 text-xs text-red-400 text-center">{error}</p>}
    </div>
  );
};

export default GoogleLoginButton;
