import Task from "../models/Task.js";
import Sprint from "../models/sprints.js";
import List from "../models/List.js";
import { Op } from "sequelize"; // Sequelize operators




const sprintController = {
  getTasksByProject: async (req, res) => {
    try {
      const { projectId } = req.params; // Extract project ID (list_id)

      const tasks = await Task.findAll({
        where: {
          listId: projectId, // Ensure `list_id` (project ID) matches
          sprintId: null, // Only fetch tasks where `sprint_id` is NULL
        },
        attributes: ["id", "title"], // Only return id and title
      });

      if (tasks.length === 0) {
        return res
          .status(404)
          .json({
            message: "No tasks found for this project without a sprint.",
          });
      }

      res.json(tasks); // Return tasks in response
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Server error." });
    }
  },
  createSprint: async (req, res) => {
    try {
      const { name, goal, duration, list_id } = req.body;

      if (![1, 2, 3, 4].includes(duration)) {
        return res.status(400).json({ message: "Invalid duration" });
      }

      const startDate = new Date(); // Sprint starts now
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + duration * 7); // Calculate end date

      const newSprint = await Sprint.create({
        name,
        goal,
        duration,
        start_date: startDate,
        end_date: endDate,
        list_id,
      });

      return res.status(201).json({
        message: "Sprint created successfully",
        sprint: newSprint,
      });
    } catch (error) {
      console.error("Error creating sprint:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getSprintsByProject: async (req, res) => {
    try {
      const { projectId } = req.params; // Extract project ID from request params

      // Check if the project (list) exists
      const project = await List.findByPk(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Fetch sprints related to the project (list_id)
      const sprints = await Sprint.findAll({
        where: { list_id: projectId },
        attributes: ["id", "name"], // Only return id and name
      });

      res.json(sprints);
    } catch (error) {
      console.error("Error fetching sprints:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  filterTasksBySprints : async (req, res) => {
  try {
    const { sprintIds } = req.body; // Expecting an array of sprint IDs

    if (!sprintIds || !Array.isArray(sprintIds) || sprintIds.length === 0) {
      return res.status(400).json({ message: "Invalid sprint IDs" });
    }
      
    const tasks = await Task.findAll({
      where: {
        sprintId: {
          [Op.in]: sprintIds, // Filters tasks where sprint_id is in the given list
        },
      },
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
};

export default sprintController;
