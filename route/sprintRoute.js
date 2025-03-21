import express from "express";
import authMiddleware from "../controller/authController.js";
import sprintController from "../controller/sprintController.js";

const router = express.Router();

router.use(authMiddleware.protected);

router.get("/getTasksById/:projectId", sprintController.getTasksByProject);

router.post("/create", sprintController.createSprint);

router.get(
  "/getSprintsByProject/:projectId",
  sprintController.getSprintsByProject
);

router.post("/filter-tasks", sprintController.filterTasksBySprints);

export default router;
