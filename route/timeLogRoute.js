import express from "express";
import timeLogController from "../controller/timeLogController.js";
import authMiddleware from "../controller/authController.js";

const router = express.Router();

router.use(authMiddleware.protected);

// Route to start the timer
router.post("/start", timeLogController.startTimer);

// Route to stop the timer
router.put("/stop", timeLogController.stopTimer);

// delete timer
router.delete("/delete/:id", timeLogController.deleteTimer);

// get time logs
router.get("/time-logs/:taskId", timeLogController.getTimeLogs);


export default router;
