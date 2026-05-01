import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const mockSessions = [
  {
    _id: "mock-1",
    title: "MERN Stack Kickstart",
    description:
      "Build your first full stack app using MongoDB, Express, React, and Node. Perfect if you know basics of JS.",
    category: "Tech",
    mentorName: "Nehal",
    mentorTitle: "Full Stack Developer • Xebia Academy",
    skills: ["React", "Node.js", "MongoDB"],
    level: "Beginner–Intermediate",
    duration: "60 min",
    mode: "Online",
    rating: 4.9,
    learners: 32,
    tags: ["Project-focused", "Code review"],
  },
  {
    _id: "mock-2",
    title: "Crack Your First Tech Interview",
    description:
      "Mock interview + feedback on communication, problem solving, and resume positioning.",
    category: "Soft Skills",
    mentorName: "Harsha Vardhan",
    mentorTitle: "Software Engineer • Career Mentor",
    skills: ["Communication", "Interview prep", "Resume review"],
    level: "All levels",
    duration: "45 min",
    mode: "Online",
    rating: 4.8,
    learners: 54,
    tags: ["Mock interview", "Feedback"],
  },
  {
    _id: "mock-3",
    title: "UI Design Basics with Figma",
    description:
      "Understand layout, typography, and color. We will design a simple landing page together in Figma.",
    category: "Design",
    mentorName: "Madhu",
    mentorTitle: "Product Designer • Freelance",
    skills: ["Figma", "UI basics", "Components"],
    level: "Beginner",
    duration: "60 min",
    mode: "Online",
    rating: 4.7,
    learners: 21,
    tags: ["Hands-on", "Portfolio starter"],
  },
  {
    _id: "mock-4",
    title: "Sketching for Complete Beginners",
    description:
      "Learn the absolute basics of line, shape, and shading with simple real-time demos.",
    category: "Art",
    mentorName: "Srinath",
    mentorTitle: "Hobby Artist • Community Mentor",
    skills: ["Pencil sketching", "Shading"],
    level: "Beginner",
    duration: "45 min",
    mode: "Online",
    rating: 4.6,
    learners: 18,
    tags: ["Relaxed", "No experience needed"],
  },
  {
    _id: "mock-5",
    title: "Spoken English & Confidence Boost",
    description:
      "Improve fluency, pronunciation, and confidence with conversation practice and instant corrections.",
    category: "Languages",
    mentorName: "Sai Nagendra",
    mentorTitle: "Communication Coach",
    skills: ["Spoken English", "Confidence"],
    level: "Beginner–Intermediate",
    duration: "40 min",
    mode: "Online",
    rating: 4.9,
    learners: 40,
    tags: ["Conversation practice", "Feedback"],
  },
  {
    _id: "mock-6",
    title: "Excel for College Students",
    description:
      "Master formulas, filters, and charts for assignments, project data, and reports.",
    category: "Other",
    mentorName: "Manikanta",
    mentorTitle: "Data Enthusiast",
    skills: ["Excel basics", "Formulas", "Charts"],
    level: "Beginner",
    duration: "45 min",
    mode: "Online",
    rating: 4.8,
    learners: 29,
    tags: ["Assignments", "Productivity"],
  },
];

const categoryOptions = [
  "All",
  "Tech",
  "Soft Skills",
  "Design",
  "Art",
  "Languages",
  "Other",
];

const Sessions = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/sessions");
      const data = Array.isArray(res.data) ? res.data : [];

      if (data.length === 0) {
        // if no sessions in DB, show mock demo sessions
        setSessions(mockSessions);
        setFiltered(mockSessions);
      } else {
        setSessions(data);
        setFiltered(data);
      }
    } catch (err) {
      console.log("Error fetching sessions, using mock data:", err);
      setSessions(mockSessions);
      setFiltered(mockSessions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const applyFilter = () => {
    let list = [...sessions];

    if (category !== "All") {
      list = list.filter((s) => s.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.title?.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q) ||
          s.mentorName?.toLowerCase().includes(q) ||
          s.mentor?.name?.toLowerCase().includes(q) ||
          (Array.isArray(s.skills) &&
            s.skills.join(" ").toLowerCase().includes(q))
      );
    }

    setFiltered(list);
  };

  const handleRefresh = () => {
    setSearch("");
    setCategory("All");
    loadSessions();
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-xs text-emerald-300 tracking-[0.25em] uppercase">
              Discover
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold mt-1">
              Available skill sessions
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Search by topic or filter by category to find the right mentor.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            className="self-start px-4 py-2 rounded-full border border-slate-600 text-xs text-slate-100 hover:border-emerald-400 hover:text-white bg-slate-900/80 backdrop-blur hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by title, description, or mentor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
          >
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            onClick={applyFilter}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-medium text-slate-950 shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-200"
          >
            Filter
          </button>
        </div>

        {/* Sessions List */}
        {loading && filtered.length === 0 && (
          <p className="text-slate-400 text-sm mt-6">Loading sessions…</p>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-slate-400 text-sm mt-6">
            No sessions found. Try a different search or filter.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map((session) => (
            <div
              key={session._id}
              onClick={() => navigate(`/sessions/${session._id}`)}
              className="relative group bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border border-white/10 rounded-2xl p-5 shadow-2xl hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(16,185,129,0.3)] transition-all duration-300 backdrop-blur-xl overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex justify-between items-start gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg font-semibold text-white">{session.title}</h2>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-semibold">
                        FREE
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {session.category} • {session.level || "All levels"}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-800/80 backdrop-blur text-[11px] border border-white/10 shadow-lg flex-shrink-0">
                    {session.duration || "45 min"} · {session.mode || "Online"}
                  </span>
                </div>

                <p className="text-sm text-slate-300 mb-3 leading-relaxed">
                  {session.description}
                </p>

                {/* Mentor info */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-emerald-400 via-sky-400 to-blue-500 flex items-center justify-center text-xs font-semibold shadow-lg shadow-emerald-500/30">
                    {(session.mentorName || session.mentor?.name || "M")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {session.mentorName || session.mentor?.name || "Mentor"}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {session.mentorTitle || "SkillSwap mentor"}
                    </p>
                    {Array.isArray(session.skills) && session.skills.length > 0 && (
                      <p className="text-[11px] text-slate-300 mt-1">
                        You can learn:{" "}
                        <span className="text-emerald-300 font-medium">
                          {session.skills.join(", ")}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Tags / rating / learners */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
                  {session.rating && (
                    <span className="px-2.5 py-1 rounded-full bg-slate-800/80 backdrop-blur border border-white/10 flex items-center gap-1 shadow-md">
                      ⭐ <span>{session.rating.toFixed(1)}</span>
                    </span>
                  )}
                  {session.learners && (
                    <span className="px-2.5 py-1 rounded-full bg-slate-800/80 backdrop-blur border border-white/10 shadow-md">
                      {session.learners}+ learners
                    </span>
                  )}
                  {Array.isArray(session.tags) &&
                    session.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full bg-slate-800/80 backdrop-blur border border-white/10 shadow-md"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sessions;
