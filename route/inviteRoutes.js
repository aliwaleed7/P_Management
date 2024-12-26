import express from "express";
import inviteController from "../controller/inviteController.js";
import authMiddleware from "../controller/authController.js";

const router = express.Router();

// protected middleware
router.use(authMiddleware.protected);

// Route to send an invite
router.post("/send", inviteController.sendInvite);

// Route to accept an invite
router.post("/accept", inviteController.acceptInvite);

// Route to delete an invite
router.delete("/delete", inviteController.deletInvite);

export default router;
