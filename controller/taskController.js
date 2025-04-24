// controllers/taskController.js
import Task from "../models/Task.js";
import List from "../models/List.js";
import User from "../models/user.js";
import path from "path";
import File from "../models/files.js";
import Subtask from "../models/Subtask.js";
import utils from "./utils.js";
import fs from "fs";
import Dependency from "../models/Dependencies.js";
import Comment from "../models/Comment.js";
import Notification from "../models/Notifications.js";
import UserTeamWorkspace from "../models/UserTeamWorkspace.js";
import io from "../app.js";
import { Op } from "sequelize";

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

  createComment: async (req, res) => {
    try {
      const { task_id, content } = req.body;
      const files = req.files; // Uploaded files
      const user_id = req.user.id;

      // Create comment
      const newComment = await Comment.create({
        task_id,
        user_id,
        content,
      });

      // If files were uploaded, save them
      if (files.length > 0) {
        const fileRecords = files.map((file) => ({
          file_path: file.path,
          task_id,
          comment_id: newComment.id,
          uploaded_by: user_id,
        }));
        await File.bulkCreate(fileRecords);
      }

      res
        .status(201)
        .json({ message: "Comment added successfully", newComment });
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ error: "Failed to add comment" });
    }
  },

  getComments: async (req, res) => {
    try {
      const { taskId } = req.params;

      const comments = await Comment.findAll({
        where: { task_id: taskId },
        attributes: ["content", "id"],
        include: [
          {
            model: File,
            attributes: ["file_path", "id"],
          },
        ],
      });

      res.status(200).json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  },
  updateTaskStatus: async (req, res) => {
    try {
      const { taskId } = req.params;
      const { status, workspaceId } = req.body;
      const userId = req.user.id;

      // Find the task along with the list to get team_id
      const task = await Task.findByPk(taskId, { include: { model: List } });

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      if (!task.List) {
        return res
          .status(400)
          .json({ message: "Task is not associated with any list" });
      }

      const teamId = task.List.team_id;

      // Find the team leader of the team
      const teamLeader = await UserTeamWorkspace.findOne({
        where: { team_id: teamId, role: "team_leader" },
      });

      // Update the task status
      await task.update({ status });

      // Handling notifications
      if (status === "Completed" && teamLeader) {
        // Notify the team leader when the task is completed
        const notification = await Notification.create({
          message: `The task "${task.title}" has been marked as Completed.`,
          userId: teamLeader.user_id, // Notify the team leader
          workspaceId: workspaceId,
        });

        // Emit notification to Team Leader when task is completed

        const io = req.app.get("io"); // Get the Socket.IO instance
        const userRoom = `user_${teamLeader.user_id}&${workspaceId}`; // Define a room for the specific user
        io.to(userRoom).emit("notification", {
          userId: teamLeader.user_id,
          workspaceId: workspaceId,
          message: notification.message,
        });
      }

      if (status === "Done" || status === "In Progress") {
        // Notify the assigned user when the team leader reviews the task
        if (task.assigned_to) {
          const notification = await Notification.create({
            message: `The task "${task.title}" status has been updated to "${status}".`,
            userId: task.assigned_to, // Notify the assigned user
            workspaceId: workspaceId,
          });

          const io = req.app.get("io"); // Get the Socket.IO instance
          const userRoom2 = `user_${teamLeader.user_id}&${workspaceId}`; // Define a room for the specific user
          io.to(userRoom2).emit("notification", {
            userId: task.assigned_to,
            workspaceId: workspaceId,
            message: notification.message,
          });
        }
      }
      res.status(200).json({ message: "Task status updated successfully" });
    } catch (error) {
      console.error("Error updating task status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  checkUpcomingDeadlines: async () => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Get tasks that are due within the next 24 hours
      const tasks = await Task.findAll({
        where: {
          dueDate: {
            [Op.between]: [new Date(), tomorrow],
          },
        },
      });

      for (const task of tasks) {
        if (task.assigned_to) {
          // Create a notification
          const notification = await Notification.create({
            userId: task.assigned_to,
            workspaceId: 2, // Assuming list belongs to a workspace
            message: `Task "${task.title}" is due soon! Deadline: ${task.dueDate}`,
          });

          const io = req.app.get("io"); // Get the Socket.IO instance
          const userRoom2 = `user_${task.assigned_to}&${2}`; // Define a room for the specific user
          io.to(userRoom2).emit("notification", {
            userId: task.assigned_to,
            workspaceId: 2,
            message: notification.message,
          });
        }
      }

      console.log("Upcoming deadlines checked and notifications sent.");
    } catch (error) {
      console.error("Error checking upcoming deadlines:", error);
    }
  },
};
export default taskController;
