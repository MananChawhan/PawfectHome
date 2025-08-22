import express from "express";
import { signup, login, getProfile, updateProfile, seedAdmin, addAdmin } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/seed-admin", seedAdmin);

// ✅ New route for admin creation
router.post("/add-admin", protect, addAdmin);

export default router;
