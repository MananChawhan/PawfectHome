// controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Helper: Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

/**
 * @desc    Register new user (always role=user)
 * @route   POST /api/auth/signup
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password, // plain text as requested
      role: "user", // always user
    });

    await newUser.save();

    res.status(201).json({
      message: "✅ User registered successfully",
      token: generateToken(newUser._id, newUser.role),
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error signing up", error: err.message });
  }
};

/**
 * @desc    Add new admin (only admins can do this)
 * @route   POST /api/auth/add-admin
 * @access  Private (Admin only)
 */
export const addAdmin = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "❌ Only admins can create another admin" });
    }

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const adminUser = new User({
      name,
      email,
      password, // plain text
      role: "admin",
    });

    await adminUser.save();

    res.status(201).json({
      message: "✅ Admin added successfully",
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error adding admin", error: err.message });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "✅ Login successful",
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        name: user.name || email.split("@")[0], // ✅ ensure name is always sent
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

/**
 * @desc    Get profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatarUrl: req.user.avatarUrl || "",
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
};

/**
 * @desc    Update profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.avatarUrl = req.body.avatarUrl || user.avatarUrl;

    if (req.body.password) {
      user.password = req.body.password; // plain text as requested
    }

    await user.save();

    res.json({
      message: "✅ Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl || "",
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};

/**
 * @desc    Seed Admin user
 * @route   GET /api/auth/seed-admin
 */
export const seedAdmin = async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingAdmin) {
      return res.json({ message: "⚠️ Admin already exists" });
    }

    const adminUser = new User({
      name: "Admin",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD, // plain text as requested
      role: "admin",
    });

    await adminUser.save();
    res.json({ message: "✅ Admin user created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error seeding admin", error: err.message });
  }
};
