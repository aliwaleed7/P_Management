// routes/taskRoutes.js
import express from "express";
import taskController from "../controller/taskController.js";
import authMiddleware from "../controller/authController.js";

const router = express.Router();

router.use(authMiddleware.protected);   

// create task 
router.post("/create", taskController.createTask);

// router.put("/:taskId", taskController.updateTask);

// delete task 
router.delete("/deleteTasks/:taskId", taskController.deleteTask);

export default router;
