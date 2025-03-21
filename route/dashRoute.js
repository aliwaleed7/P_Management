import express from "express";
import authMiddleware from "../controller/authController.js";
import dashController from "../controller/dashBoardController.js";

const router = express.Router();

router.use(authMiddleware.protected);

router.post("/create",dashController.createDashboard); // Create Dashboard


export default router;
