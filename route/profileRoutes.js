// routes/userRoutes.js
import express from "express";
import profileController from "../controller/profileController.js";
import authMiddleware from "../controller/authController.js";

const router = express.Router();

// protected middleware
router.use(authMiddleware.protected);

// fetch profile
router.get("/getProfile", profileController.getProfile);

// update profile
router.patch("/updateProfile", profileController.updateProfile);

export default router;
