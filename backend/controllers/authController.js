import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🔑 Helper: Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

/**
 * @desc    Register new user
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
      password, // ⚠️ store plain (use bcrypt in production)
      role: "user",
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
 * @desc    Login user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "✅ Login successful",
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        name: user.name || email.split("@")[0],
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
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
};

/**
 * @desc    Update profile
 */
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    if (req.body.password) {
      user.password = req.body.password;
    }

    await user.save();

    res.json({
      message: "✅ Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};

/**
 * @desc    Add new admin
 */
export const addAdmin = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "❌ Only admins can create another admin" });
    }

    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const adminUser = new User({ name, email, password, role: "admin" });
    await adminUser.save();

    res.status(201).json({
      message: "✅ Admin added successfully",
      user: adminUser,
    });
  } catch (err) {
    res.status(500).json({ message: "Error adding admin", error: err.message });
  }
};

/**
 * @desc    Get all admins
 */
export const getAdmins = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "❌ Only admins can view admins" });
    }

    const admins = await User.find({ role: "admin" }).select("-password");
    res.json({ admins });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

/**
 * @desc    Get all users
 */
export const getUsers = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "❌ Only admins can view users" });
    }

    const users = await User.find({ role: "user" }).select("-password");
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

/**
 * @desc    Remove admin (demote to user)
 */
export const removeAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "admin") {
      return res.status(400).json({ message: "User is not an admin" });
    }
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: "You cannot remove yourself" });
    }

    user.role = "user";
    await user.save();

    res.json({ message: "✅ Admin removed successfully", user });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

/**
 * @desc    Delete a user
 */
export const deleteUser = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "❌ Only admins can delete users" });
    }

    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "✅ User deleted successfully", user: deletedUser });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

/**
 * @desc    Promote user to admin
 */
export const promoteUserToAdmin = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "❌ Only admins can promote users" });
    }

    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") {
      return res.status(400).json({ message: "User is already an admin" });
    }

    user.role = "admin";
    await user.save();

    res.json({ message: "✅ User promoted to admin successfully", user });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

/**
 * @desc    Seed initial admin
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
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
    });

    await adminUser.save();
    res.json({ message: "✅ Admin user created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error seeding admin", error: err.message });
  }
};
