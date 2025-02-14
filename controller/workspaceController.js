// controllers/workspaceController.js
import Workspace from "../models/workspace.js";
import Task from "../models/Task.js";
import Profile from "../models/Profile.js";
import sequelize from "../config/dbInit.js";
import UserTeamWorkspace from "../models/UserTeamWorkspace.js";
import User from "../models/user.js";
import utils from "./utils.js";

const workspaceController = {
  // Create a new workspace
  createWorkspace: async (req, res) => {
    const { name } = req.body; // Workspace name from the request body
    const userId = req.user.id; // Authenticated user's ID (creator)

    // Validate input
    if (!name) {
      return res.status(400).json({ message: "Workspace name is required" });
    }

    if (!userId) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Start a transaction to ensure atomicity
    const transaction = await sequelize.transaction();

    try {
      // Step 1: Create the workspace
      const workspace = await Workspace.create(
        {
          name,
          ownerId: userId, // Set the creator as the owner
          created_at: new Date(), // Set the creation timestamp
        },
        { transaction }
      );

      // Step 2: Add the creator to the user_team_workspaces table as admin
      await UserTeamWorkspace.create(
        {
          user_id: userId,
          workspace_id: workspace.id, // Link to the newly created workspace
          role: "admin", // Assign the admin role
          joined_at: new Date(), // Set the join timestamp
        },
        { transaction }
      );

      // Commit the transaction
      await transaction.commit();

      // Respond with success
      res.status(201).json({
        message: "Workspace created successfully",
        workspace,
      });
    } catch (error) {
      // Rollback the transaction in case of error
      await transaction.rollback();

      console.error("Error creating workspace:", error);

      // Avoid exposing detailed error messages in production
      const errorMessage =
        process.env.NODE_ENV === "production" ? "Server error" : error.message;

      res.status(500).json({ message: "Server error", error: errorMessage });
    }

  },
 
  fetchAllWorkS: async (req, res) => {
    try {
      const workspaces = await utils.fetchAllFromTable(Workspace);

      res.status(200).json({
        message: "Workspaces fetched successfully",
        workspaces,
      });
    } catch (error) {
      console.error("Error fetching workspaces:", error);

      const errorMessage =
        process.env.NODE_ENV === "production" ? "Server error" : error.message;

      res.status(500).json({ message: "Server error", error: errorMessage });
    }


  }
  

  // Get all users in a workspace
  // getAllUsersInWorkspace: async (req, res) => {
  //   const { workspaceId } = req.query;

  //   try {
  //     const profiles = await Profile.findAll({
  //       where: { workspaceId, isAccepted: true }, // Only accepted members
  //       include: [
  //         {
  //           model: User,
  //           attributes: ["id", "username", "email"], // Select relevant fields
  //         },
  //       ],
  //     });

  //     if (!profiles || profiles.length === 0) {
  //       return res.status(404).json({ message: "No users found in this workspace" });
  //     }

  //     // Extract users from profiles
  //     const users = profiles.map((profile) => profile.User);

  //     res.json(users);
  //   } catch (error) {
  //     res.status(500).json({ message: "Server error", error: error.message });
  //   }
  // },
};

export default workspaceController;