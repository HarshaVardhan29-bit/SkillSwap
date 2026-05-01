import React, { useState } from "react";
import api from "../api/axios";

const CreateSession = () => {
  const [form, setForm] = useState({
    title: "",
    category: "Tech",
    description: "",
    durationMinutes: 60,
    preferredTime: ""
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/sessions", {
        ...form,
        durationMinutes: Number(form.durationMinutes)
      });
      setMsg("Course uploaded successfully!");
      setForm({
        title: "",
        category: "Tech",
        description: "",
        durationMinutes: 60,
        preferredTime: ""
      });
    } catch {
      setMsg("Failed to create session");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 text-white flex items-start justify-center px-4 py-8">
      <div className="max-w-xl w-full bg-slate-900/80 border border-slate-700 rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur">
        <h2 className="text-2xl font-semibold mb-1">Upload a Course</h2>
        <p className="text-xs text-slate-400 mb-4">
          Create a new course to share your knowledge with students.
        </p>

        {msg && (
          <div className="mb-3 text-xs bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-emerald-200">
            {msg}
          </div>
        )}

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Course title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Intro to Python for absolute beginners"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
            >
              <option>Tech</option>
              <option>Soft Skills</option>
              <option>Design</option>
              <option>Art</option>
              <option>Languages</option>
              <option>Other</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300">Course Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What will students learn from this course? Any prerequisites?"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-300">Duration (minutes)</label>
              <input
                name="durationMinutes"
                type="number"
                min="15"
                value={form.durationMinutes}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-300">
                Preferred timing (text)
              </label>
              <input
                name="preferredTime"
                value={form.preferredTime}
                onChange={handleChange}
                placeholder="Evenings, weekend 5–7pm"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
              />
            </div>
          </div>

          <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-medium py-2.5 rounded-lg mt-2 transition">
            Publish Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSession;
