// routes/taskRoutes.js
import express from "express";
import taskController from "../controller/taskController.js";
import authMiddleware from "../controller/authController.js";
import multer from "multer";
import checkTaskPermissions from "../controller/checkTaskPermissions.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the upload folder
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/gif",
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/vnd.ms-powerpoint", // .ppt
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, Word, and PowerPoint are allowed."
        )
      );
    }
  },
});

const router = express.Router();

router.use(authMiddleware.protected);

// Create a new task
router.post("/tasks", taskController.createTask);

// Attach a file to a task
router.post("/comments", upload.array("files"), taskController.createComment);

router.get("/comments/:taskId", taskController.getComments);

router.post("/subtasks", taskController.createSubTask);

router.put("/task/:id", taskController.updateTask); 

//======================================

router.put(
  "/tasks/:taskId",
  checkTaskPermissions,
  taskController.updateTaskStatus
);

//======================================

router.delete("/tasks/:id", taskController.deleteTask);

router.put("/subtasks/:id", taskController.updateSubTask);

router.delete("/subtasks/:id", taskController.deleteSubTask);

router.post("/createDepend", taskController.createDependency);

router.delete("/deleteDepend/:id", taskController.deleteDependency);

router.get("/tasks/list/:listId", taskController.getTasksByListId);

router.get("/getTaskDetails/:taskId", taskController.getTaskDetails);

export default router;
