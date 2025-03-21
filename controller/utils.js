import Task from "../models/Task.js";
import User from "../models/user.js";
import Dependency from "../models/Dependencies.js";
import UserTeamWorkspace from "../models/UserTeamWorkspace.js";
import TimeLog from "../models/timeLogs.js";

const utils = {
  // get profile
  updateEntity: async (model, id, updateData) => {
    try {
      // Find the entity by ID
      const entity = await model.findByPk(id);
      if (!entity) {
        throw new Error(`${model.name} not found`);
      }

      // Update the entity fields
      for (const key in updateData) {
        if (updateData[key] !== undefined) {
          entity[key] = updateData[key];
        }
      }

      // Save the updated entity
      await entity.save();

      return entity;
    } catch (error) {
      throw new Error(`Error updating ${model.name}: ${error.message}`);
    }
  },

  deleteEntity: async (model, id) => {
    try {
      // Find the entity by ID
      const entity = await model.findByPk(id);
      if (!entity) {
        throw new Error(`${model.name} not found`);
      }

      // Delete the entity
      await entity.destroy();
    } catch (error) {
      throw new Error(`Error deleting ${model.name}: ${error.message}`);
    }
  },

  fetchAllFromTable: async (model) => {
    try {
      // Fetch all rows from the specified table
      const data = await model.findAll();
      return data;
    } catch (error) {
      console.error(`Error fetching data from table ${model.name}:`, error);
      throw error; // Re-throw the error for the caller to handle
    }
  },

  getTaskDetails: async (taskId) => {
    try {
      // Fetch the task by ID with dependencies
      const task = await Task.findByPk(taskId, {
        include: [
          {
            model: Dependency,
            as: "dependencies", // Ensure this alias matches the association
            attributes: ["dependencyType"],
            required: false, // Task is returned even if it has no dependencies
          },
          {
            model: UserTeamWorkspace, // Join through user_team_workspaces
            as: "user_team_workspace", // Ensure this alias matches the association
            attributes: ["user_id"],
            include: [
              {
                model: User,
                as: "User", // Ensure this alias matches the association
                attributes: ["username"],
              },
            ],
            // Don't fetch user_team_workspaces fields
            required: false,
          },
          {
            model: TimeLog,
            as: "timeLogs", // Ensure this alias matches the association
            attributes: ["duration"],
            required: false, // Task is returned even if it has no dependencies
          },
        ],
      });

      return task;
    } catch (error) {
      console.error("Error fetching task:", error.message);
      throw error;
    }
  },
};

export default utils;
