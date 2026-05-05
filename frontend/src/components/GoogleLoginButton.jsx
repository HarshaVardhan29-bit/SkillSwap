import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const GoogleLoginButton = ({ role = "student", label = "Continue with Google" }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Detect if mobile browser
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Process Google user after successful authentication
  const processGoogleUser = async (user, userRole) => {
    try {
      console.log("📝 Processing Google user:", { email: user.email, role: userRole });
      
      const { displayName, email, uid } = user;
      const res = await api.post("/auth/google", {
        name: displayName,
        email,
        googleId: uid,
        role: userRole,
      });

      console.log("✅ Backend authentication successful");
      await login(res.data.token, res.data.user);
      
      // Navigate to dashboard
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("❌ Error processing Google user:", err);
      throw err;
    }
  };

  // Handle redirect result on component mount (for mobile)
  useEffect(() => {
    let isMounted = true;

    const handleRedirectResult = async () => {
      // Skip if already processing or if we have a token (already logged in)
      if (localStorage.getItem("token")) {
        console.log("⏭️ Already logged in, skipping redirect check");
        return;
      }

      try {
        console.log("🔍 Checking for redirect result...");
        setLoading(true);
        
        const result = await getRedirectResult(auth);
        
        if (!isMounted) return;

        if (result?.user) {
          console.log("✅ Redirect result found, user authenticated");
          
          // Get role from multiple sources (priority order)
          const storedRole = 
            sessionStorage.getItem("googleLoginRole") || 
            localStorage.getItem("googleLoginRole") ||
            new URLSearchParams(location.search).get("role") ||
            role;

          console.log("📋 Using role:", storedRole);

          // Clean up storage
          sessionStorage.removeItem("googleLoginRole");
          localStorage.removeItem("googleLoginRole");

          await processGoogleUser(result.user, storedRole);
        } else {
          console.log("ℹ️ No redirect result found");
        }
      } catch (err) {
        console.error("❌ Redirect result error:", err);
        
        if (isMounted) {
          // Only show error if it's not a "no redirect" error
          if (err.code && !["auth/no-current-user", "auth/popup-closed-by-user"].includes(err.code)) {
            setError(err.response?.data?.message || err.message || "Authentication failed");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    handleRedirectResult();

    return () => {
      isMounted = false;
    };
  }, []); // Run once on mount

  // Handle Google login button click
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("🚀 Starting Google login...");
      console.log("📱 Device type:", isMobile() ? "Mobile" : "Desktop");
      console.log("👤 Role:", role);

      // Try popup first (works on most modern mobile browsers)
      console.log("🔄 Attempting popup authentication...");
      
      try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log("✅ Popup authentication successful");
        await processGoogleUser(result.user, role);
        return; // Success, exit
      } catch (popupErr) {
        console.log("⚠️ Popup failed:", popupErr.code);
        
        // If popup was closed by user, don't fallback
        if (popupErr.code === "auth/popup-closed-by-user") {
          setError("Login cancelled. Please try again.");
          setLoading(false);
          return;
        }
        
        // If popup blocked or not supported, fallback to redirect on mobile
        if (isMobile() && (
          popupErr.code === "auth/popup-blocked" || 
          popupErr.code === "auth/operation-not-supported-in-this-environment"
        )) {
          console.log("📲 Falling back to redirect flow for mobile");
          
          // Store role in multiple places for redundancy
          sessionStorage.setItem("googleLoginRole", role);
          localStorage.setItem("googleLoginRole", role);
          
          // Also add to URL as fallback
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.set("role", role);
          window.history.replaceState({}, "", currentUrl);

          console.log("💾 Role stored, initiating redirect...");
          
          // Initiate redirect
          await signInWithRedirect(auth, googleProvider);
          // Note: Code after this won't execute as page redirects
        } else {
          // Other errors, throw to outer catch
          throw popupErr;
        }
      }
    } catch (err) {
      console.error("❌ Google login error:", err);
      
      // Handle specific error cases
      if (err.code === "auth/popup-closed-by-user") {
        setError("Login cancelled. Please try again.");
      } else if (err.code === "auth/popup-blocked") {
        setError("Popup blocked. Please allow popups and try again.");
      } else if (err.code === "auth/cancelled-popup-request") {
        // User opened another popup, ignore this error
        console.log("ℹ️ Popup request cancelled (another popup opened)");
      } else if (err.code === "auth/unauthorized-domain") {
        setError("Domain not authorized. Please contact support.");
        console.error("🚨 Unauthorized domain - need to add domain to Firebase Console");
      } else {
        setError(err.response?.data?.message || err.message || "Login failed. Please try again.");
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
      {error && (
        <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-xs text-red-400 text-center">{error}</p>
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;
