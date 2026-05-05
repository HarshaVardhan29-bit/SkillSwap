import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server as SocketIOServer } from "socket.io";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";

// If you have these extra routes, keep imports.
// If not, comment them out for now.
import sessionRoutes from "./routes/sessionRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
// import Message from "./models/Message.js"; // optional if you create it

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();

// ---------- CORS CONFIG (Express) ----------
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        /^http:\/\/localhost/,
        /\.vercel\.app$/,
        /\.onrender\.com$/,
        /skillswap-a3re\.onrender\.com/,
      ];

      if (!origin || allowedOrigins.some(pattern => pattern.test(origin))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// ---------- STATIC FILE SERVING ----------
// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------- API ROUTES ----------
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/ratings", ratingRoutes);

// Simple health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ---------- SERVE FRONTEND (Production) ----------
const frontendBuild = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendBuild));

// All non-API routes serve the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendBuild, "index.html"));
});

// ---------- SOCKET.IO SETUP ----------
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = [
        /^http:\/\/localhost/,
        /\.onrender\.com$/,
      ];
      if (!origin || allowedOrigins.some(pattern => pattern.test(origin))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
  },
});

// Basic realtime chat handling
io.on("connection", (socket) => {
  // Client should emit "joinRoom" with { bookingId }
  socket.on("joinRoom", ({ bookingId }) => {
    if (bookingId) {
      socket.join(bookingId);
    }
  });

  // Handle chat messages
  socket.on("chatMessage", async ({ bookingId, senderId, text }) => {
    if (!bookingId || !senderId || !text) return;

    // If you create a Message model later, you can store chat here.
    // try {
    //   const message = await Message.create({
    //     booking: bookingId,
    //     sender: senderId,
    //     text,
    //   });
    //
    //   io.to(bookingId).emit("chatMessage", {
    //     _id: message._id,
    //     bookingId,
    //     sender: senderId,
    //     text,
    //     createdAt: message.createdAt,
    //   });
    // } catch (err) {
    //   console.error("Error saving message:", err.message);
    // }

    // For now, just broadcast without saving:
    io.to(bookingId).emit("chatMessage", {
      bookingId,
      sender: senderId,
      text,
      createdAt: new Date().toISOString(),
    });
  });

  socket.on("disconnect", () => {
    // optional: console.log("Socket disconnected");
  });
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
