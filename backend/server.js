import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import petRoutes from "./routes/petRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

// ✅ CORS Configuration (fix for localhost + vercel)
app.use(
  cors({
    origin: [
      "http://localhost:5173",              // local Vite dev
      "https://pawfecthome-liart.vercel.app" // deployed frontend on Vercel
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Handle preflight requests
app.options("*", cors());

// Middleware
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("🐾 PawfectHome Backend is running! Use /api/pets and /api/auth");
});

// ✅ Routes
app.use("/api/pets", petRoutes);
app.use("/api/auth", authRoutes);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

// ✅ Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
