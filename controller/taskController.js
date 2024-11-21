// controllers/taskController.js
import Task from "../models/Task.js";
import Workspace from "../models/workspace.js";

const taskController = {
  // Create a task in a workspace
  createTask: async (req, res) => {
    const { workspaceId, title, description, dueDate } = req.body;

    try {
      // Check if workspace exists
      const workspace = await Workspace.findByPk(workspaceId);
      if (!workspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }

      const task = await Task.create({
        title,
        description,
        dueDate,
        workspaceId,
      });

      res.status(201).json({ message: "Task created", task });
    } catch (error) {
      res.status(500).json({ message: "Error creating task", error });
    }
  },

  // Delete a task from workspace
  deleteTask: async (req, res) => {
    const { taskId } = req.params;

    try {
      const task = await Task.findByPk(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      await task.destroy(); // Deletes the task
      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

export default taskController;
