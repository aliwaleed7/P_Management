import Dashboard from "../models/dashboard.js";
import Task from "../models/Task.js";
import List from "../models/List.js";
import { Op } from "sequelize";

const dashController = {
  createDashboard: async (req, res) => {
    try {
      const { dash_name, list_id, ws_id } = req.body;

      // Validate input
      if (!dash_name || !list_id) {
        return res
          .status(400)
          .json({ message: "dash_name and list_id are required" });
      }

      // Create a new dashboard
      const newDashboard = await Dashboard.create({
        dash_name,
        list_id,
        ws_id,
      });

      res.status(201).json({
        message: "Dashboard created successfully",
        dashboard: newDashboard,
      });
    } catch (error) {
      console.error("Error creating dashboard:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getDashboardsByWorkspace: async (req, res) => {
    try {
      const { ws_id } = req.params; // Extract workspace ID from URL parameters

      if (!ws_id) {
        return res.status(400).json({ message: "ws_id is required" });
      }

      // Fetch dashboards where ws_id matches
      const dashboards = await Dashboard.findAll({
        where: { ws_id }, // Filter by workspace ID
        attributes: ["id", "dash_name", "list_id"], // Only fetch id and dash_name
        order: [["created_at", "DESC"]], // Order by creation date (latest first)
      });

      return res.status(200).json(dashboards);
    } catch (error) {
      console.error("Error fetching dashboards:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  calculateProgress: async (listId) => {
    try {
      // Fetch total tasks and completed tasks
      const totalTasks = await Task.count({ where: { listId } });
      const completedTasks = await Task.count({
        where: { listId, status: "Completed" },
      });

      // Calculate progress percentage
      const progress =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Update the list's progress
      await List.update({ progress }, { where: { id: listId } });

      return { listId, progress };
    } catch (error) {
      console.error("Error calculating progress:", error);
      throw error;
    }
  },

  updateListProgress: async (req, res) => {
    try {
      const { listId } = req.params;

      if (!listId) {
        return res.status(400).json({ message: "List ID is required" });
      }

      const result = await dashController.calculateProgress(listId);
      return res
        .status(200)
        .json({ message: "Progress updated successfully", result });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  getUpcomingDeadlines: async (req, res) => {
    try {
      const { listId } = req.params;
      const now = new Date();
      const oneDayAhead = new Date();
      oneDayAhead.setDate(now.getDate() + 1); // 24 hours ahead

      // Fetch tasks in the given list with deadlines in the next 24 hours
      const tasks = await Task.findAll({
        where: {
          listId,
          dueDate: {
            [Op.between]: [now, oneDayAhead], // Only upcoming deadlines
          },
        },
        attributes: ["id", "title", "dueDate"], // Fetch relevant fields
        order: [["dueDate", "ASC"]],
      });

      return res.status(200).json({ tasks });
    } catch (error) {
      console.error("Error fetching upcoming tasks:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getTaskStatusCounts: async (req, res) => {
    try {
      const { projectId } = req.params;

      // Count total tasks in the project
      const totalTasks = await Task.count({ where: { listId: projectId } });

      if (totalTasks === 0) {
        return res.json({
          message: "No tasks available for this project",
          data: { "To Do": 0, "In Progress": 0, Completed: 0, Done: 0 },
        });
      }

      // Count tasks by status
      const statuses = ["To Do", "In Progress", "Completed", "Done"];
      const statusCounts = {};

      for (const status of statuses) {
        const count = await Task.count({
          where: { listId: projectId, status },
        });
        statusCounts[status] = Math.round((count / totalTasks) * 100); // Percentage
      }

      res.json({
        message: "Task status percentage fetched",
        data: statusCounts,
      });
    } catch (error) {
      console.error("Error fetching task status percentage:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getUrgentTasks: async (req, res) => {
    try {
      const { projectId } = req.params;

      const urgentTasks = await Task.findAll({
        where: {
          priority: "High",
          listId: projectId,
          status: ["To Do", "In Progress"],
        },
        order: [["dueDate", "ASC"]],
      });

      res.status(200).json({ tasks: urgentTasks });
    } catch (error) {
      console.error("Error fetching urgent tasks:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getDueTasks: async (req, res) => {
    try {
      const { listId } = req.params;
      const now = new Date(); // Get the current date and time

      const dueTasks = await Task.findAll({
        where: {
          listId,
          status: { [Op.in]: ["To Do", "In Progress"] },
          dueDate: { [Op.lt]: now }, // Tasks with past due dates
        },
        order: [["dueDate", "ASC"]],
      });

      return res.status(200).json({ tasks: dueTasks });
    } catch (error) {
      console.error("Error fetching due date tasks:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateDashboardName: async (req, res) => {
    try {
      const { id } = req.params; // Get dashboard ID from URL
      const { dash_name } = req.body; // Get new name from request body

      if (!dash_name) {
        return res.status(400).json({ message: "Dashboard name is required" });
      }

      const dashboard = await Dashboard.findByPk(id);
      if (!dashboard) {
        return res.status(404).json({ message: "Dashboard not found" });
      }

      // Update the name
      dashboard.dash_name = dash_name;
      await dashboard.save();

      res.json({ message: "Dashboard updated successfully", dashboard });
    } catch (error) {
      console.error("Error updating dashboard name:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  fetchProjectName: async (req, res) => {
    try {
      const list = await List.findByPk(req.params.id);
      if (!list) return res.status(404).json({ message: "List not found" });

      res.json({ id: list.id, name: list.name });
    } catch (error) {
      console.error("Error fetching list:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

export default dashController;
