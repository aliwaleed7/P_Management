// routes/workspaceRoutes.js
import express from "express";
import workspaceController from "../controller/workspaceController.js";
import authMiddleware from "../controller/authController.js";

const router = express.Router();

router.use(authMiddleware.protected);

// create work space
router.post("/create", workspaceController.createWorkspace);

// get workspaces 
router.get("/workspaces", workspaceController.fetchAllWorkS);

// get user work spaces 
router.get("/users/:userId/workspaces", workspaceController.fetchUserWorkspaces);


export default router;
