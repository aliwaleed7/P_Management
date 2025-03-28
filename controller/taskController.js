// controllers/taskController.js
import Task from "../models/Task.js";
import List from "../models/List.js";
import User from "../models/user.js";
import path from "path";
import File from "../models/files.js";
import Comment from "../models/comment.js";
import Subtask from "../models/Subtask.js";
import utils from "./utils.js";
import fs from "fs";
import Dependency from "../models/Dependencies.js";

const taskController = {
  // Create a new task
  createTask: async (req, res) => {
    const {
      title,
      description,
      list_id,
      assigned_to,
      status,
      priority,
      due_date,
    } = req.body;

    try {
      // Validate input
      if (!title || !list_id) {
        return res.status(400).json({
          success: false,
          message: "Title and list_id are required.",
        });
      }

      // Check if the list exists
      const list = await List.findByPk(list_id);
      if (!list) {
        return res.status(404).json({
          success: false,
          message: "List not found.",
        });
      }

      // Check if the assigned user exists (if assigned_to is provided)
      if (assigned_to) {
        const user = await User.findByPk(assigned_to);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: "Assigned user not found.",
          });
        }
      }

      // Create the task
      const task = await Task.create({
        title,
        description: description || null, // Optional field
        listId: list_id,
        assigned_to: assigned_to || null, // Optional field
        status: status || "To Do", // Default status
        priority: priority || "Medium", // Default priority
        dueDate: due_date || null, // Optional field
      });

      // Send success response
      return res.status(201).json({
        success: true,
        message: "Task created successfully.",
        data: task,
      });
    } catch (error) {
      console.error("Error creating task:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while creating the task.",
        error: error.message,
      });
    }
  },

  createSubTask: async (req, res) => {
    const {
      task_id,
      title,
      description,
      assigned_to,
      priority,
      status,
      due_date,
    } = req.body;

    try {
      // Check if the parent task exists
      const task = await Task.findByPk(task_id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Create the subtask
      const subtask = await Subtask.create({
        task_id,
        title,
        description: description || null,
        assigned_to: assigned_to || null,
        priority: priority || null,
        status: status || "pending",
        due_date: due_date || null,
      });

      res.status(201).json(subtask);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating subtask", error: error.message });
    }
  },

  updateTask: async (req, res) => {
    const { id } = req.params; // Task ID to update
    const updateData = req.body; // Data to update

    try {
      const updatedTask = await utils.updateEntity(Task, id, updateData);
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateSubTask: async (req, res) => {
    const { id } = req.params; // Subtask ID to update
    const updateData = req.body; // Data to update

    try {
      const updatedSubtask = await utils.updateEntity(Subtask, id, updateData);
      res.status(200).json(updatedSubtask);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteTask: async (req, res) => {
    const { id } = req.params; // Subtask ID to delete

    try {
      await utils.deleteEntity(Task, id);
      res.status(204).send(); // No content response for successful deletion
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteSubTask: async (req, res) => {
    const { id } = req.params; // Subtask ID to delete

    try {
      await utils.deleteEntity(Subtask, id);
      res.status(204).send(); // No content response for successful deletion
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Attach a file to a task
  attachFile: async (req, res) => {
    const { taskId, subtaskId } = req.body; // Extract taskId or subtaskId from the request
    const uploadedBy = req.user.id; // Assuming req.user contains authenticated user info
    const file = req.file; // File uploaded via middleware (e.g., multer)

    try {
      // Ensure either taskId or subtaskId is provided, not both
      if (!taskId && !subtaskId) {
        return res.status(400).json({
          message: "Either taskId or subtaskId must be provided",
        });
      }

      if (taskId && subtaskId) {
        return res.status(400).json({
          message: "Provide only one: taskId or subtaskId, not both",
        });
      }

      // Check if the task or subtask exists
      let parent;
      if (taskId) {
        parent = await Task.findByPk(taskId);
        if (!parent) {
          return res.status(404).json({ message: "Task not found" });
        }
      } else if (subtaskId) {
        parent = await Subtask.findByPk(subtaskId);
        if (!parent) {
          return res.status(404).json({ message: "Subtask not found" });
        }
      }

      // Ensure a file is uploaded
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Save the file path to the database
      const filePath = path.join("uploads", file.filename); // Adjust the file path if needed
      const savedFile = await File.create({
        file_path: filePath,
        task_id: taskId || null,
        subtask_id: subtaskId || null,
        uploaded_by: uploadedBy,
        uploaded_at: new Date(),
      });

      res.status(201).json({
        message: "File attached successfully",
        file: savedFile,
      });
    } catch (error) {
      console.error("Error attaching file:", error);
      res.status(500).json({ message: "Failed to attach file", error });
    }
  },

  // Delete an attached file from a task
  deleteFile: async (req, res) => {
    const { taskId, fileId } = req.params; // Extract taskId and fileId from request params

    try {
      // Check if the task exists
      const task = await Task.findByPk(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Find the file in the database
      const file = await File.findByPk(fileId);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      // Check if the file is attached to the correct task
      if (String(file.task_id) !== String(taskId)) {
        return res
          .status(400)
          .json({ message: "File is not attached to this task" });
      }

      // Delete the file from the file system
      const filePath = path.join("uploads", file.file_path); // Get the full file path
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the file
      }

      // Remove the file from the database
      await file.destroy();

      res.status(200).json({
        message: "File deleted successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to delete file", error });
    }
  },

  addComment: async (req, res) => {
    const { taskId, subtaskId, content } = req.body; // Extract data from request body
    const file = req.file; // Assuming file is uploaded using multer and available as req.file
    const userId = req.user.id; // Assuming user ID is available from authentication middleware

    try {
      // Validate input: At least one of content or file should be provided
      if (!content && !file) {
        return res
          .status(400)
          .json({ message: "Either content or file must be provided" });
      }

      if (!taskId && !subtaskId) {
        return res
          .status(400)
          .json({ message: "Either taskId or subtaskId must be provided" });
      }

      // Create the comment in the database
      const newComment = await Comment.create({
        task_id: taskId || null,
        subtask_id: subtaskId || null,
        user_id: userId,
        content: content || null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      // If a file is uploaded, save it and associate it with the comment
      if (file) {
        const filePath = path.join("uploads", file.filename); // Assuming multer saves the file to `uploads/`
        await File.create({
          file_path: filePath,
          comment_id: newComment.id,
          uploaded_by: userId,
          uploaded_at: new Date(),
        });
      }

      res.status(201).json({
        message: "Comment created successfully",
        comment: newComment,
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Failed to create comment", error });
    }
  },

  createDependency: async (req, res) => {
    try {
      const {
        task_id,
        subtask_id,
        dependent_on_task_id,
        dependent_on_subtask_id,
        dependency_type,
      } = req.body;

      // Validate input: At least one task or subtask must be provided
      if (!task_id && !subtask_id) {
        return res.status(400).json({
          success: false,
          message: "Either task_id or subtask_id must be provided.",
        });
      }
      if (!dependent_on_task_id && !dependent_on_subtask_id) {
        return res.status(400).json({
          success: false,
          message:
            "Either dependent_on_task_id or dependent_on_subtask_id must be provided.",
        });
      }

      // Create dependency in database
      const dependency = await Dependency.create({
        taskId: task_id,
        subtask_id: subtask_id,
        dependentOnTaskId: dependent_on_task_id,
        dependentOnSubTaskId: dependent_on_subtask_id,
        dependencyType: dependency_type,
      });

      return res.status(201).json({ success: true, data: dependency });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteDependency: async (req, res) => {
    const { id } = req.params; // Subtask ID to delete

    try {
      await utils.deleteEntity(Dependency, id);
      res.status(204).send(); // No content response for successful deletion
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getTasksByListId: async (req, res) => {
    try {
      const { listId } = req.params; // Extract list ID from URL

      const tasks = await Task.findAll({
        where: { listId: listId },
        attributes: [
          "id",
          "title",
          "description",
          "status",
          "priority",
          "dueDate",
        ],
        order: [["createdAt", "DESC"]],
      });

      if (tasks.length === 0) {
        return res
          .status(404)
          .json({ message: "No tasks found for this list." });
      }

      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Server error." });
    }
  },

  getTaskDetails: async (req, res) => {
    try {
      const { taskId } = req.params;
      const taskDetails = await utils.getTaskDetails(taskId);

      if (!taskDetails) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.status(200).json(taskDetails);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
export default taskController;
