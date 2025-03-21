// routes/taskRoutes.js
import express from "express";
import taskController from "../controller/taskController.js";
import authMiddleware from "../controller/authController.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the upload folder
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.use(authMiddleware.protected);

// Create a new task
router.post("/tasks", taskController.createTask);

// Attach a file to a task
router.post(
  "/attachFileTasks",
  upload.single("file"),
  taskController.attachFile
);

router.delete("/tasks/:taskId/files/:fileId", taskController.deleteFile);

router.post("/comments", upload.single("file"), taskController.addComment);

router.post("/subtasks", taskController.createSubTask);

router.put("/tasks/:id", taskController.updateTask); 

router.delete("/tasks/:id", taskController.deleteTask); 

router.put("/subtasks/:id", taskController.updateSubTask); 

router.delete("/subtasks/:id", taskController.deleteSubTask); 

router.post("/createDepend", taskController.createDependency); 

router.delete("/deleteDepend/:id", taskController.deleteDependency); 

router.get("/tasks/list/:listId", taskController.getTasksByListId);

router.get("/getTaskDetails/:taskId", taskController.getTaskDetails);



export default router;
