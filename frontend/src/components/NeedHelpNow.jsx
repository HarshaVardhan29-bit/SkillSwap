import React, { useState } from "react";
import api from "../api/axios";

const NeedHelpNow = ({ onClose }) => {
  const [selectedSkill, setSelectedSkill] = useState("");
  const [availableMentors, setAvailableMentors] = useState([]);
  const [loading, setLoading] = useState(false);

  const commonSkills = [
    "JavaScript", "Python", "React", "Node.js", "HTML/CSS", 
    "Data Science", "Machine Learning", "Web Development",
    "Mobile Development", "Database Design", "System Design"
  ];

  const findMentors = async () => {
    if (!selectedSkill) return;
    
    setLoading(true);
    try {
      const res = await api.get(`/leaderboard/available-mentors?skill=${selectedSkill}`);
      setAvailableMentors(res.data);
    } catch (err) {
      console.error("Error finding mentors:", err);
    } finally {
      setLoading(false);
    }
  };

  const contactMentor = (mentor) => {
    // In a real app, this would open a chat or booking flow
    alert(`Contacting ${mentor.name} for help with ${selectedSkill}!\n\nThis would open a direct chat or booking interface.`);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">🆘 Need Help Now?</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <p className="text-slate-400 mb-6">
          Get instant help from available mentors in our community
        </p>

        {/* Skill Selection */}
        <div className="mb-6">
          <label className="text-sm text-slate-300 mb-3 block">What do you need help with?</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {commonSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => setSelectedSkill(skill)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedSkill === skill
                    ? "bg-blue-500 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
          
          <input
            type="text"
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            placeholder="Or type a custom skill..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
          />
        </div>

        <button
          onClick={findMentors}
          disabled={!selectedSkill || loading}
          className="w-full mb-6 px-4 py-3 bg-blue-500 hover:bg-blue-400 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg font-medium transition-colors"
        >
          {loading ? "Finding Mentors..." : "Find Available Mentors"}
        </button>

        {/* Available Mentors */}
        {availableMentors.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Available Mentors ({availableMentors.length})
            </h3>
            <div className="space-y-3">
              {availableMentors.map((mentor) => (
                <div
                  key={mentor._id}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-semibold">
                      {mentor.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{mentor.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span>⭐ {mentor.averageRating.toFixed(1)}</span>
                        <span>•</span>
                        <span>{mentor.points} points</span>
                        <span>•</span>
                        <span className="text-green-400">🟢 Online</span>
                      </div>
                      {mentor.skills && mentor.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {mentor.skills.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => contactMentor(mentor)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-sm font-medium transition-colors"
                  >
                    Get Help
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {availableMentors.length === 0 && selectedSkill && !loading && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">😔</div>
            <p className="text-slate-400 mb-4">No mentors available right now for "{selectedSkill}"</p>
            <p className="text-sm text-slate-500">Try browsing sessions or check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NeedHelpNow;