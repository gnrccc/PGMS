import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Find user
    const user = await User.findOne({ userName });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Incorrect username or password" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ message: "Incorrect username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Remove password from response
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    // Set token in both cookie and header for better security
    res.cookie("token", token, {
      httpOnly: true, // Prevents JavaScript access to the cookie
      secure: process.env.NODE_ENV === "production", // Only sends cookie over HTTPS in production
      sameSite: "strict", // Protects against CSRF
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });
    res.header("Authorization", `Bearer ${token}`);

    res.status(200).json({
      user: userWithoutPassword,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

export const createAdmin = async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin user already exists" });
    }

    // Generate secure admin password
    const adminPassword = "Admin@123";

    // Hash admin password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = new User({
      userName: "admin",
      password: hashedPassword,
      role: "admin",
      firstName: "System",
      lastName: "Admin",
      gender: "Other",
      birthDate: new Date(),
      address: "System",
      phoneNumber: "0000000000",
    });

    await admin.save();

    // Generate JWT token for auto-login
    const token = jwt.sign(
      { userId: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set token in response header
    res.cookie("token", token, {
      httpOnly: true, // Prevents JavaScript access to the cookie
      secure: process.env.NODE_ENV === "production", // Only sends cookie over HTTPS in production
      sameSite: "strict", // Protects against CSRF
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });
    res.header("Authorization", `Bearer ${token}`);

    res.status(201).json({
      message: "Admin user created successfully",
      adminCredentials: {
        userName: admin.userName,
        password: adminPassword, // Send unhashed password in response
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create admin user",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    // Optional: Check if cookies exist first
    if (!req.cookies || !req.cookies.token) {
      return res.status(401).json({
        success: false,
        message: "No active session found",
      });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.removeHeader("Authorization");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};

// Check if user is authenticated
export const check = async (req, res) => {
  try {
    // req.user is set by verifyToken middleware
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Return user data without sensitive information
    const userWithoutPassword = {
      _id: req.user._id,
      userName: req.user.userName,
      role: req.user.role,
      // Add other user fields you want to send to frontend
    };

    res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Auth check failed", error: error.message });
  }
};

export const checkAdmin = async (req, res) => {
  try {
    const adminCount = await User.countDocuments({ role: "admin" });
    res.json({ hasAdmin: adminCount > 0 });
  } catch (error) {
    res.status(500).json({ message: "Error checking admin status" });
  }
};
