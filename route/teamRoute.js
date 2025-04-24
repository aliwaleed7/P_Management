import express from "express";
import teamController from "../controller/teamController.js";
import authMiddleware from "../controller/authController.js";

const router = express.Router();

router.use(authMiddleware.protected);

router.post("/create", teamController.createTeam);

router.get(
  "/workspace/:workspace_id/teams",
  teamController.getTeamsByWorkspace
);

router.get("/project/:projectId/members", teamController.getProjectMembers);

router.get("/members/:teamId", teamController.getTeamMembers);

export default router;
