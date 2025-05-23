import User from "../models/user.js";
import Blacklist from "../models/Blacklist.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import UserTeamWorkspace from "../models/UserTeamWorkspace.js";

dotenv.config();

const UserController = {
  registerUser: async (req, res) => {
    const { username, email, password } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create a new user
      const user = await User.create({ username, email, password });

      // Generate JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "9000h",
      });

      res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  loginUser: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Check if user exists
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      // Validate password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "2000h",
      });

      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  logoutUser: async (req, res) => {
    // Extract token from headers
    const token = req.headers.authorization?.split(" ")[1];
    try {
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      await Blacklist.create({
        token,
        expiresAt: new Date(decoded.exp * 1000),
      });
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  getUserRole: async (req, res) => {
    try {
      const { user_id } = req.params;
      const { workspace_id } = req.query; // ✅ GET request => use query

      const userRole = await UserTeamWorkspace.findOne({
        where: { user_id, workspace_id },
        attributes: ["role"],
      });

      if (!userRole) {
        return res.status(404).json({ message: "User role not found" });
      }

      res.json({ role: userRole.role });
    } catch (error) {
      console.error("Error fetching user role:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

export default UserController;
