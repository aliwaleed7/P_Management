import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";
import Blacklist from "../models/Blacklist.js";

dotenv.config();

const authMiddleware = {
  protected: async (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Extract token from "Bearer <token>"
      const token = authHeader.split(" ")[1];

      // Check if token is blacklisted
      const isBlacklisted = await Blacklist.findOne({ where: { token } });
      if (isBlacklisted) {
        return res.status(403).json({ message: "Invalid or expired" });
      }
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });

      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }

      next();
    } catch (err) {
      console.error("Authentication error:", err);
      res.status(403).json({ message: "Invalid token" });
    }
  },
};

export default authMiddleware;
