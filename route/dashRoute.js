import express from "express";
import authMiddleware from "../controller/authController.js";
import dashController from "../controller/dashBoardController.js";

const router = express.Router();

// router.use(authMiddleware.protected);

router.post("/create", dashController.createDashboard); // Create Dashboard

router.get("/dashboards/:ws_id", dashController.getDashboardsByWorkspace);

router.put("/update-progress/:listId", dashController.updateListProgress);

router.get("/upcoming-deadlines/:listId", dashController.getUpcomingDeadlines);

router.get("/task-status/:projectId", dashController.getTaskStatusCounts);

router.get("/urgent/:projectId", dashController.getUrgentTasks);

router.get("/due-date/:listId", dashController.getDueTasks);

router.put("/update/:id", dashController.updateDashboardName);

router.get("/lists/:id", dashController.fetchProjectName);


export default router;
