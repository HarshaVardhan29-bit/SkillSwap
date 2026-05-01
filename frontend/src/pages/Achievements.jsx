import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Achievements = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
    fetchCertificates();
  }, []);

  const fetchUserStats = async () => {
    try {
      const res = await api.get("/leaderboard/my-rank");
      setUserStats(res.data);
    } catch (err) {
      console.error("Error fetching user stats:", err);
    }
  };

  const fetchCertificates = async () => {
    try {
      const res = await api.get("/certificates/my-certificates");
      setCertificates(res.data);
    } catch (err) {
      console.error("Error fetching certificates:", err);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeIcon = (badge) => {
    const icons = {
      "Rising Mentor": "🌟",
      "Knowledge Sharer": "📚",
      "Top Contributor": "🏆",
      "Campus Mentor": "👨‍🏫",
      "Active Learner": "🎓"
    };
    return icons[badge] || "🏅";
  };

  const getBadgeColor = (badge) => {
    const colors = {
      "Rising Mentor": "from-green-500 to-emerald-600",
      "Knowledge Sharer": "from-blue-500 to-cyan-600",
      "Top Contributor": "from-purple-500 to-violet-600",
      "Campus Mentor": "from-yellow-500 to-orange-600",
      "Active Learner": "from-indigo-500 to-blue-600"
    };
    return colors[badge] || "from-slate-500 to-slate-600";
  };

  const getProgressToNextBadge = () => {
    if (!userStats) return [];
    
    const { user } = userStats;
    const progress = [];

    // Rising Mentor - 3 sessions hosted
    if (!user.badges.includes("Rising Mentor")) {
      progress.push({
        badge: "Rising Mentor",
        description: "Host 3 sessions",
        current: user.sessionsHosted,
        target: 3,
        icon: "🌟"
      });
    }

    // Knowledge Sharer - 10 sessions hosted
    if (!user.badges.includes("Knowledge Sharer")) {
      progress.push({
        badge: "Knowledge Sharer",
        description: "Host 10 sessions",
        current: user.sessionsHosted,
        target: 10,
        icon: "📚"
      });
    }

    // Top Contributor - 200+ points
    if (!user.badges.includes("Top Contributor")) {
      progress.push({
        badge: "Top Contributor",
        description: "Earn 200 points",
        current: user.points,
        target: 200,
        icon: "🏆"
      });
    }

    // Campus Mentor - 4.5+ rating with 5+ ratings
    if (!user.badges.includes("Campus Mentor")) {
      progress.push({
        badge: "Campus Mentor",
        description: "Maintain 4.5+ rating (5+ reviews)",
        current: user.totalRatings >= 5 ? user.averageRating : user.totalRatings,
        target: user.totalRatings >= 5 ? 4.5 : 5,
        icon: "👨‍🏫",
        isRating: user.totalRatings >= 5
      });
    }

    // Active Learner - 5 sessions attended
    if (!user.badges.includes("Active Learner")) {
      progress.push({
        badge: "Active Learner",
        description: "Attend 5 sessions",
        current: user.sessionsAttended,
        target: 5,
        icon: "🎓"
      });
    }

    return progress.slice(0, 3); // Show top 3 next badges
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Loading achievements...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🏆 My Achievements</h1>
          <p className="text-slate-400">Track your progress and celebrate your accomplishments</p>
        </div>

        {/* Stats Overview */}
        {userStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{userStats.user.points}</div>
              <div className="text-sm text-slate-400">Total Points</div>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">#{userStats.rank}</div>
              <div className="text-sm text-slate-400">Global Rank</div>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{userStats.user.sessionsHosted}</div>
              <div className="text-sm text-slate-400">Sessions Hosted</div>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{certificates.length}</div>
              <div className="text-sm text-slate-400">Certificates</div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Earned Badges */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">🏅 Earned Badges</h2>
            {userStats?.user.badges && userStats.user.badges.length > 0 ? (
              <div className="grid gap-4">
                {userStats.user.badges.map((badge, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-r ${getBadgeColor(badge)} p-4 rounded-lg text-white`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{getBadgeIcon(badge)}</div>
                      <div>
                        <h3 className="font-semibold">{badge}</h3>
                        <p className="text-sm opacity-90">Earned for outstanding contribution</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🏅</div>
                <p className="text-slate-400 mb-4">No badges earned yet</p>
                <Link
                  to="/sessions"
                  className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Start Learning to Earn Badges!
                </Link>
              </div>
            )}
          </div>

          {/* Progress to Next Badges */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">🎯 Next Badges</h2>
            <div className="space-y-4">
              {getProgressToNextBadge().map((progress, index) => (
                <div key={index} className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">{progress.icon}</div>
                    <div>
                      <h3 className="font-semibold text-white">{progress.badge}</h3>
                      <p className="text-sm text-slate-400">{progress.description}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-white">
                        {progress.current}/{progress.target}
                        {progress.isRating ? " ⭐" : ""}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((progress.current / progress.target) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certificates */}
        <div className="mt-8 bg-slate-900 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-white">📜 My Certificates</h2>
            <Link
              to="/certificates"
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          
          {certificates.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificates.slice(0, 6).map((cert) => (
                <div key={cert._id} className="bg-slate-800 border border-slate-600 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">🏆</div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">{cert.title}</h3>
                      <p className="text-xs text-slate-400">{cert.skillName}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{cert.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">
                      {new Date(cert.issuedDate).toLocaleDateString()}
                    </span>
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded">
                      Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📜</div>
              <p className="text-slate-400 mb-4">No certificates earned yet</p>
              <p className="text-sm text-slate-500">Complete sessions to earn certificates!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Achievements;