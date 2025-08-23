import express from "express";
import {
  signup,
  login,
  getProfile,
  updateProfile,
  seedAdmin,
  addAdmin,
  removeAdmin,
  getAdmins,
  getUsers,
  deleteUser,
  promoteUserToAdmin
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/seed-admin", seedAdmin);

// Protected user routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// ✅ Admin management routes
router.post("/add-admin", protect, addAdmin);
router.delete("/remove-admin/:id", protect, removeAdmin);
router.get("/admins", protect, getAdmins); 
router.get("/users", protect, getUsers); 
router.delete("/remove-user/:id", protect, deleteUser);
router.put("/promote-user/:id", protect, promoteUserToAdmin); // 🚀 Promote user

export default router;
