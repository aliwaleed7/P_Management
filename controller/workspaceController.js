// controllers/workspaceController.js
import Workspace from "../models/workspace.js";
import Task from "../models/Task.js";
import Profile from "../models/Profile.js";
import User from "../models/user.js";


const workspaceController = {
  // Create a new workspace
  createWorkspace: async (req, res) => {
    const { name } = req.body;
    const ownerId = req.user.id;
    try {
      // Check if name is provided
      if (!name) {
        return res.status(400).json({ message: "Workspace name is required" });
      }

      // Create the workspace
      const workspace = await Workspace.create({
        name,
        ownerId,
      });

      // Create the profile for the user with role 'manager'
      const profile = await Profile.create({
        userId: ownerId,
        workspaceId: workspace.id,
        role: "manager",
      });

      res.status(201).json({
        message: "Workspace and profile created successfully",
        workspace,
        profile,
      });
    } catch (error) {
      console.error("Error creating workspace:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Get a workspace with its tasks
  getWorkspaceWithTasks: async (req, res) => {
    const { workspaceId } = req.params;
    try {
      const workspace = await Workspace.findByPk(workspaceId, {
        include: [
          {
            model: Task,
            attributes: ["id", "title", "description", "status", "dueDate"],
          },
        ],
      });

      if (!workspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }

      res.status(200).json({ workspace });
    } catch (error) {
      res.status(500).json({ message: "Error fetching workspace", error });
    }
  },
  getAllUsersInWorkspace: async (req, res) => {
    const { workspaceId } = req.query;

    try {
      const workspace = await Workspace.findByPk(workspaceId, {
        include: {
          model: User,
          through: {
            where: { isAccepted: true }, // Only accepted members
          },
          attributes: ["id", "username", "email"], // Select relevant fields
        },
      });

      if (!workspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }

      res.json(workspace.Users);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

export default workspaceController;
