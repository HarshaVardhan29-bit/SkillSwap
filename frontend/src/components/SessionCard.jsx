// src/components/SessionCard.jsx
import React from "react";

const SessionCard = ({ s, onBook }) => {
  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-4 flex flex-col gap-2 shadow-lg">
      <h3 className="font-semibold text-base text-white">{s.title}</h3>
      <p className="text-[11px] uppercase text-emerald-300 tracking-wide">
        {s.category}
      </p>
      <p className="text-xs text-slate-300 line-clamp-3">{s.description}</p>
      <p className="text-[11px] text-slate-400">
        Mentor:{" "}
        <span className="text-slate-100 font-medium">
          {s.mentor?.name || "Unknown"}
        </span>{" "}
        • {s.durationMinutes} mins
      </p>
      {s.preferredTime && (
        <p className="text-[11px] text-slate-500">
          Preferred: {s.preferredTime}
        </p>
      )}
      <button
        onClick={onBook}
        className="mt-2 text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full px-3 py-1.5 font-medium self-start transition"
      >
        Request session
      </button>
    </div>
  );
};

export default SessionCard;
