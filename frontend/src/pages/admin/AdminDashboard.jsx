import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        setAnalytics(res.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Manage your SkillSwap platform</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{analytics?.totalUsers || 0}</p>
              </div>
              <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 text-xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-green-400">{analytics?.activeUsers || 0}</p>
              </div>
              <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-green-400 text-xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Sessions</p>
                <p className="text-2xl font-bold text-purple-400">{analytics?.totalSessions || 0}</p>
              </div>
              <div className="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <span className="text-purple-400 text-xl">📚</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-emerald-400">{analytics?.completedBookings || 0}</p>
              </div>
              <div className="h-12 w-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <span className="text-emerald-400 text-xl">🎯</span>
              </div>
            </div>
          </div>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/admin/users"
            className="bg-slate-900 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <span className="text-blue-400 text-xl">👥</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Manage Users</h3>
                <p className="text-slate-400 text-sm">View, edit, and manage user accounts</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/sessions"
            className="bg-slate-900 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                <span className="text-purple-400 text-xl">📚</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Manage Sessions</h3>
                <p className="text-slate-400 text-sm">Approve, block, and moderate sessions</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/announcements"
            className="bg-slate-900 border border-slate-700 rounded-xl p-6 hover:border-yellow-500/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-yellow-500/20 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                <span className="text-yellow-400 text-xl">📢</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Announcements</h3>
                <p className="text-slate-400 text-sm">Create and manage platform announcements</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/settings"
            className="bg-slate-900 border border-slate-700 rounded-xl p-6 hover:border-green-500/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                <span className="text-green-400 text-xl">⚙️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Feature Settings</h3>
                <p className="text-slate-400 text-sm">Enable/disable platform features</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Top Mentors */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Top Mentors</h2>
          {analytics?.topMentors?.length > 0 ? (
            <div className="space-y-3">
              {analytics.topMentors.map((mentor, index) => (
                <div key={mentor._id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-semibold text-sm">
                      {index + 1}
                    </div>
                    <span className="text-white font-medium">{mentor.name}</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">
                    {mentor.completedSessions} sessions
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;