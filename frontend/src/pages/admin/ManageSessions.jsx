import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const ManageSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchSessions = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const res = await api.get(`/admin/sessions?${params}`);
      setSessions(res.data);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [search, statusFilter]);

  const updateSessionStatus = async (sessionId, status) => {
    try {
      await api.patch(`/admin/sessions/${sessionId}/status`, { status });
      fetchSessions();
    } catch (err) {
      console.error("Error updating session status:", err);
      alert("Failed to update session status");
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "approved": return "bg-green-500/20 text-green-300 border-green-500/40";
      case "pending": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/40";
      case "blocked": return "bg-red-500/20 text-red-300 border-red-500/40";
      default: return "bg-slate-500/20 text-slate-300 border-slate-500/40";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Loading sessions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link to="/admin" className="text-slate-400 hover:text-white text-sm mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white">Manage Sessions</h1>
            <p className="text-slate-400">Moderate and approve platform sessions</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Search Sessions</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or description..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/70"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="grid gap-6">
          {sessions.map((session) => (
            <div key={session._id} className="bg-slate-900 border border-slate-700 rounded-xl p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{session.title}</h3>
                      <p className="text-slate-400 text-sm">
                        by {session.mentor?.name} • {session.category} • {session.durationMinutes} min
                      </p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusBadgeColor(session.status)}`}>
                      {session.status}
                    </span>
                  </div>
                  
                  <p className="text-slate-300 mb-4 leading-relaxed">
                    {session.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>📅 Created: {new Date(session.createdAt).toLocaleDateString()}</span>
                    {session.preferredTime && (
                      <span>⏰ Preferred: {session.preferredTime}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <div className="flex gap-2">
                    {session.status !== "approved" && (
                      <button
                        onClick={() => updateSessionStatus(session._id, "approved")}
                        className="flex-1 px-3 py-2 bg-green-500/20 text-green-300 border border-green-500/40 rounded-lg hover:bg-green-500/30 transition-colors text-sm font-medium"
                      >
                        ✓ Approve
                      </button>
                    )}
                    {session.status !== "blocked" && (
                      <button
                        onClick={() => updateSessionStatus(session._id, "blocked")}
                        className="flex-1 px-3 py-2 bg-red-500/20 text-red-300 border border-red-500/40 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
                      >
                        ✕ Block
                      </button>
                    )}
                  </div>
                  {session.status === "blocked" && (
                    <button
                      onClick={() => updateSessionStatus(session._id, "pending")}
                      className="px-3 py-2 bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm font-medium"
                    >
                      ↻ Reset to Pending
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {sessions.length === 0 && (
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 text-center">
            <p className="text-slate-400">No sessions found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSessions;