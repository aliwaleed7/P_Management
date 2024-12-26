import express from "express";
import notificationController from "../controller/notificationController.js"; // Adjust path to the controller
import authMiddleware from "../controller/authController.js";


const router = express.Router();


router.use(authMiddleware.protected);

// Define the route for fetching user notifications
router.get("/getAllnotifications", notificationController.getUserNotifications);

export default router;
