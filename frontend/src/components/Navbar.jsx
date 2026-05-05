import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileMenu]);

  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobileMenu(false);
  }, [navigate]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowProfileMenu(false);
    setShowMobileMenu(false);
  };

  const linkClasses =
    "text-sm text-slate-300 hover:text-white transition-colors";

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const closeMobileMenu = () => setShowMobileMenu(false);

  return (
    <>
      <nav className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled 
          ? "bg-gradient-to-r from-slate-900/70 via-slate-800/70 to-slate-900/70 backdrop-blur-3xl border-white/10 shadow-xl" 
          : "bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl border-white/20 shadow-2xl shadow-black/60"
      }`}>
        <div className={`absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none transition-opacity duration-300 ${isScrolled ? "opacity-50" : "opacity-100"}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1),transparent_50%)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4 relative">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group transition-transform z-10"
            onClick={closeMobileMenu}
          >
            <div className="relative h-8 w-8 rounded-2xl bg-gradient-to-tr from-emerald-400 via-sky-400 to-blue-500 shadow-lg shadow-emerald-500/40 group-hover:shadow-emerald-500/60 group-hover:-translate-y-0.5 group-hover:rotate-2 transition-transform duration-200">
              <div className="absolute inset-[3px] rounded-2xl bg-slate-950/90 backdrop-blur" />
              <div className="relative flex h-full w-full items-center justify-center gap-[2px]">
                <span className="h-1 w-1 rounded-full bg-emerald-300" />
                <span className="h-1 w-1 rounded-full bg-sky-300" />
                <span className="h-1 w-1 rounded-full bg-blue-300" />
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm sm:text-base font-semibold text-white tracking-tight">
                SkillSwap
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                Learn • Teach • Grow
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <NavLink
              to="/sessions"
              className={({ isActive }) =>
                `${linkClasses} ${
                  isActive ? "text-emerald-400 border-b border-emerald-400" : ""
                } pb-0.5`
              }
            >
              Sessions
            </NavLink>
            <NavLink
              to="/leaderboard"
              className={({ isActive }) =>
                `${linkClasses} ${
                  isActive ? "text-emerald-400 border-b border-emerald-400" : ""
                } pb-0.5`
              }
            >
              🏆 Leaderboard
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${linkClasses} ${
                  isActive ? "text-emerald-400 border-b border-emerald-400" : ""
                } pb-0.5`
              }
            >
              Dashboard
            </NavLink>
          </div>

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="h-9 w-9 rounded-full bg-slate-800 animate-pulse"></div>
            ) : user ? (
              <>
                {user.role === 'teacher' && (
                  <Link
                    to="/create-session"
                    className="text-xs px-3 py-1.5 rounded-full bg-slate-900 text-slate-100 border border-slate-700 hover:border-emerald-400 hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200"
                  >
                    + Upload Course
                  </Link>
                )}
                
                {/* Profile Avatar with Dropdown */}
                <div className="relative profile-menu-container">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold shadow-lg transition-all duration-200 hover:-translate-y-0.5 ${
                      user.role === 'admin'
                        ? 'bg-gradient-to-tr from-red-400 via-red-500 to-red-600 text-white shadow-red-500/40 hover:shadow-red-500/60'
                        : user.role === 'teacher'
                        ? 'bg-gradient-to-tr from-emerald-400 via-emerald-500 to-green-500 text-slate-950 shadow-emerald-500/40 hover:shadow-emerald-500/60'
                        : 'bg-gradient-to-tr from-blue-400 via-blue-500 to-indigo-500 text-white shadow-blue-500/40 hover:shadow-blue-500/60'
                    }`}
                  >
                    {getUserInitials()}
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                      <div className="p-4 border-b border-slate-700">
                        <div className="flex items-center gap-3">
                          <div className={`h-12 w-12 rounded-full flex items-center justify-center text-base font-semibold ${
                            user.role === 'admin'
                              ? 'bg-gradient-to-tr from-red-400 via-red-500 to-red-600 text-white'
                              : user.role === 'teacher'
                              ? 'bg-gradient-to-tr from-emerald-400 via-emerald-500 to-green-500 text-slate-950'
                              : 'bg-gradient-to-tr from-blue-400 via-blue-500 to-indigo-500 text-white'
                          }`}>
                            {getUserInitials()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                            <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full ${
                              user.role === 'admin' ? 'bg-red-500/20 text-red-300' :
                              user.role === 'teacher' 
                                ? 'bg-emerald-500/20 text-emerald-300' 
                                : 'bg-blue-500/20 text-blue-300'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <Link
                          to="/dashboard"
                          onClick={() => setShowProfileMenu(false)}
                          className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          📊 Dashboard
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setShowProfileMenu(false)}
                            className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            🛠️ Admin Panel
                          </Link>
                        )}
                        <Link
                          to="/achievements"
                          onClick={() => setShowProfileMenu(false)}
                          className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          🏆 My Achievements
                        </Link>
                        <Link
                          to="/certificates"
                          onClick={() => setShowProfileMenu(false)}
                          className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          📜 Certificates
                        </Link>
                        <Link
                          to="/leaderboard"
                          onClick={() => setShowProfileMenu(false)}
                          className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          🏅 Leaderboard
                        </Link>
                        {user.role === 'teacher' && (
                          <Link
                            to="/create-session"
                            onClick={() => setShowProfileMenu(false)}
                            className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            ➕ Upload Course
                          </Link>
                        )}
                      </div>

                      <div className="p-2 border-t border-slate-700">
                        <button
                          onClick={handleLogout}
                          className="w-full px-3 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                        >
                          🚪 Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs px-3 py-1.5 rounded-full bg-white text-slate-900 font-medium hover:bg-slate-100 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-xs px-3 py-1.5 rounded-full border border-slate-600 text-slate-100 hover:border-emerald-400 hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200"
                >
                  Join free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden relative z-10 p-2 text-slate-300 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {showMobileMenu ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
          
          {/* Menu Panel */}
          <div className="absolute top-[60px] left-0 right-0 bottom-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-t border-white/10 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* User Info (if logged in) */}
              {user && (
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center text-base font-semibold ${
                      user.role === 'admin'
                        ? 'bg-gradient-to-tr from-red-400 via-red-500 to-red-600 text-white'
                        : user.role === 'teacher'
                        ? 'bg-gradient-to-tr from-emerald-400 via-emerald-500 to-green-500 text-slate-950'
                        : 'bg-gradient-to-tr from-blue-400 via-blue-500 to-indigo-500 text-white'
                    }`}>
                      {getUserInitials()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full ${
                        user.role === 'admin' ? 'bg-red-500/20 text-red-300' :
                        user.role === 'teacher' 
                          ? 'bg-emerald-500/20 text-emerald-300' 
                          : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="space-y-2">
                <NavLink
                  to="/sessions"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`
                  }
                >
                  📚 Sessions
                </NavLink>
                <NavLink
                  to="/leaderboard"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`
                  }
                >
                  🏆 Leaderboard
                </NavLink>
                {user && (
                  <>
                    <NavLink
                      to="/dashboard"
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                          isActive
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                        }`
                      }
                    >
                      📊 Dashboard
                    </NavLink>
                    {user.role === 'admin' && (
                      <NavLink
                        to="/admin"
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                            isActive
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                          }`
                        }
                      >
                        🛠️ Admin Panel
                      </NavLink>
                    )}
                    <NavLink
                      to="/achievements"
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                          isActive
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                        }`
                      }
                    >
                      🏆 My Achievements
                    </NavLink>
                    <NavLink
                      to="/certificates"
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                          isActive
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                        }`
                      }
                    >
                      📜 Certificates
                    </NavLink>
                    {user.role === 'teacher' && (
                      <NavLink
                        to="/create-session"
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                            isActive
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                          }`
                        }
                      >
                        ➕ Upload Course
                      </NavLink>
                    )}
                  </>
                )}
              </div>

              {/* Auth Buttons */}
              {!user && (
                <div className="space-y-2 pt-4 border-t border-slate-700">
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="block w-full px-4 py-3 rounded-xl bg-white text-slate-900 font-medium text-center hover:bg-slate-100 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="block w-full px-4 py-3 rounded-xl border border-slate-600 text-slate-100 font-medium text-center hover:border-emerald-400 hover:text-white transition-colors"
                  >
                    Join free
                  </Link>
                </div>
              )}

              {/* Logout Button */}
              {user && (
                <div className="pt-4 border-t border-slate-700">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 rounded-xl bg-red-500/10 text-red-300 font-medium hover:bg-red-500/20 transition-colors"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
