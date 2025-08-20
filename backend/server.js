import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import petRoutes from "./routes/petRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("🐾 PawfectHome Backend is running! Use /api/pets to access data.");
});

// Routes
app.use("/api/pets", petRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ Mongo Error:", err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
import connectDB from "./config/db.js";