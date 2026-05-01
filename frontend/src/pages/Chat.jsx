import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const socket = io("http://localhost:5000"); // or your backend port

const Chat = () => {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.emit("joinRoom", { bookingId });

    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chatMessage");
    };
  }, [bookingId]);

  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit("chatMessage", {
      bookingId,
      senderId: user.id,
      text
    });
    setText("");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 text-white flex items-center justify-center px-4 py-6">
      <div className="max-w-3xl w-full bg-slate-900/80 border border-slate-700 rounded-2xl shadow-xl flex flex-col h-[70vh]">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-300/80 uppercase tracking-[0.25em]">
              Chat
            </p>
            <h2 className="text-sm sm:text-base font-semibold">
              Booking #{bookingId}
            </h2>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-slate-950/40">
          {messages.length === 0 && (
            <p className="text-xs text-slate-500">
              No messages yet. Say hi to your mentor/learner!
            </p>
          )}
          {messages.map((m) => (
            <div
              key={m._id || Math.random()}
              className={`max-w-xs px-3 py-2 rounded-xl text-xs ${
                m.sender === user.id
                  ? "bg-emerald-500 text-slate-950 ml-auto"
                  : "bg-slate-800 text-slate-100"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-slate-700 flex gap-2 bg-slate-900">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs sm:text-sm font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
