// routes/userRoutes.js
import express from "express";
import UserController from "../controller/userController.js";
import authMiddleware from "../controller/authController.js";

const router = express.Router();

// signup
router.post("/signup", UserController.registerUser);

// login 
router.post("/login", UserController.loginUser);

// protected middleware 
router.use(authMiddleware.protected);

// logout
router.post("/logout", UserController.logoutUser);

export default router;
