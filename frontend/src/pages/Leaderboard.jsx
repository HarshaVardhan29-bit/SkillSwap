import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState("points");

  useEffect(() => {
    fetchLeaderboard();
    fetchMyRank();
  }, [sortType]);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get(`/leaderboard?type=${sortType}&limit=50`);
      setLeaderboard(res.data);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRank = async () => {
    try {
      const res = await api.get("/leaderboard/my-rank");
      setMyRank(res.data);
    } catch (err) {
      console.error("Error fetching my rank:", err);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return "text-yellow-400 bg-yellow-500/20 border-yellow-500/40";
      case 2: return "text-slate-300 bg-slate-500/20 border-slate-500/40";
      case 3: return "text-orange-400 bg-orange-500/20 border-orange-500/40";
      default: return "text-slate-400 bg-slate-700/50 border-slate-600";
    }
  };

  const getBadgeColor = (badge) => {
    const colors = {
      "Rising Mentor": "bg-green-500/20 text-green-300",
      "Knowledge Sharer": "bg-blue-500/20 text-blue-300",
      "Top Contributor": "bg-purple-500/20 text-purple-300",
      "Campus Mentor": "bg-yellow-500/20 text-yellow-300",
      "Active Learner": "bg-indigo-500/20 text-indigo-300"
    };
    return colors[badge] || "bg-slate-500/20 text-slate-300";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🏆 Leaderboard</h1>
          <p className="text-slate-400">Top performers in the SkillSwap community</p>
        </div>

        {/* My Rank Card */}
        {myRank && (
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Your Ranking</h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-blue-300">Rank: #{myRank.rank}</span>
                  <span className="text-purple-300">Points: {myRank.user.points}</span>
                  <span className="text-green-300">Rating: {myRank.user.averageRating.toFixed(1)}⭐</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">#{myRank.rank}</div>
                <div className="text-xs text-slate-400">of {myRank.totalUsers}</div>
              </div>
            </div>
          </div>
        )}

        {/* Sort Options */}
        <div className="flex justify-center mb-6">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-1 flex">
            {[
              { key: "points", label: "Points", icon: "🎯" },
              { key: "rating", label: "Rating", icon: "⭐" },
              { key: "sessions", label: "Sessions", icon: "📚" }
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setSortType(option.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  sortType === option.key
                    ? "bg-blue-500 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {option.icon} {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="space-y-3">
          {leaderboard.map((user, index) => (
            <div
              key={user._id}
              className={`bg-slate-900 border rounded-xl p-4 transition-all hover:border-blue-500/50 ${
                user.rank <= 3 ? "border-yellow-500/30 bg-gradient-to-r from-yellow-500/5 to-transparent" : "border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold border ${getRankColor(user.rank)}`}>
                    {getRankIcon(user.rank)}
                  </div>

                  {/* User Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.role === 'admin' ? 'bg-red-500/20 text-red-300' :
                        user.role === 'teacher' ? 'bg-emerald-500/20 text-emerald-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    
                    {/* Badges */}
                    {user.badges && user.badges.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {user.badges.slice(0, 3).map((badge, idx) => (
                          <span
                            key={idx}
                            className={`text-xs px-2 py-1 rounded-full ${getBadgeColor(badge)}`}
                          >
                            {badge}
                          </span>
                        ))}
                        {user.badges.length > 3 && (
                          <span className="text-xs px-2 py-1 rounded-full bg-slate-600/50 text-slate-400">
                            +{user.badges.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-blue-400 font-semibold">{user.points}</div>
                      <div className="text-slate-500 text-xs">Points</div>
                    </div>
                    <div>
                      <div className="text-yellow-400 font-semibold">
                        {user.averageRating > 0 ? user.averageRating.toFixed(1) : "N/A"}
                      </div>
                      <div className="text-slate-500 text-xs">Rating</div>
                    </div>
                    <div>
                      <div className="text-green-400 font-semibold">{user.sessionsHosted}</div>
                      <div className="text-slate-500 text-xs">Sessions</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">No users found on the leaderboard yet</p>
            <Link
              to="/sessions"
              className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-medium transition-colors"
            >
              Start Learning to Earn Points!
            </Link>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-300 mb-2">🎯 How to Earn Points</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
            <div>
              <p className="mb-2"><span className="text-green-400">+20 points</span> - Host a session</p>
              <p className="mb-2"><span className="text-blue-400">+10 points</span> - Attend a session</p>
            </div>
            <div>
              <p className="mb-2"><span className="text-yellow-400">+15 points</span> - Receive 4+ rating</p>
              <p className="mb-2"><span className="text-purple-400">+50 points</span> - Complete 5 sessions milestone</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;