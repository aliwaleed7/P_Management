// controllers/workspaceController.js
import Workspace from "../models/workspace.js";
import Task from "../models/Task.js";
import Profile from "../models/Profile.js";
import nodemailer from "nodemailer";
import UserWorkspaces from "../models/userWorkSpaces .js";
import User from "../models/user.js";
import dotenv from "dotenv";


dotenv.config();


// Transporter for nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail", // Use your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

  // send invite through an email
  sendInvite: async (req, res) => {
    const { email, workspaceId } = req.body;

    try {
      // Check if user exists
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if workspace exists
      // note this note necessery remove it in future
      const workspace = await Workspace.findByPk(workspaceId);
      if (!workspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }

      // Add to UserWorkspaces table as pending
      await UserWorkspaces.findOrCreate({
        where: { userId: user.id, workspaceId },
        defaults: { isAccepted: false },
      });

      // Send email invite
      const inviteLink = `http://localhost:3000/invite/accept?workspaceId=${workspaceId}&userId=${user.id}`;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Invitation to join workspace: ${workspace.name}`,
        text: `You have been invited to join the workspace "${workspace.name}". Accept your invitation here: ${inviteLink}`,
      };

      await transporter.sendMail(mailOptions);

      res.json({ message: "Invitation sent successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  acceptInvite: async (req, res) => {
    const { userId, workspaceId } = req.body;
    try {
      // Update the UserWorkspaces entry to accepted
      const userWorkspace = await UserWorkspaces.findOne({
        where: { userId, workspaceId },
      });

      if (!userWorkspace) {
        return res.status(404).json({ message: "Invitation not found" });
      }

      await userWorkspace.update({ isAccepted: true });

      res.json({ message: "Invitation accepted, welcome to the workspace!" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
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


  }
};

export default workspaceController;
