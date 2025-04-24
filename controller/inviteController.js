import nodemailer from "nodemailer";
import UserWorkspaces from "../models/UserTeamWorkspace.js";
import User from "../models/user.js";
import Notification from "../models/Notifications.js";
import Workspace from "../models/workspace.js";
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

const inviteController = {
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
      const workspace = await Workspace.findByPk(workspaceId);
      if (!workspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }

      // Add to UserWorkspaces table as pending
      const [userWorkspace, created] = await UserWorkspaces.findOrCreate({
        where: { user_id: user.id, workspace_id: workspaceId },
        defaults: { isAccepted: false },
      });

      if (!created) {
        return res
          .status(400)
          .json({ message: "User is already invited to this workspace" });
      }

      // Save invite notification
      const notification = await Notification.create({
        userId: user.id,
        workspaceId,
        message: `You are invited to join workspace: ${workspace.name}`,
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

      // Emit the notification in real-time to the specific user and workspace
      const io = req.app.get("io"); // Get the Socket.IO instance
      const userRoom = `user_${user.id}`; // Define a room for the specific user

      io.to(userRoom).emit("inviteNotification", {
        userId: user.id,
        workspaceId,
        message: notification.message,
      });

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
        where: { user_id: userId, workspace_id: workspaceId },
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

  deletInvite: async (req, res) => {
    const { workspaceId, email } = req.body;

    try {
      // Find the user by email
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Delete the record from UserWorkspaces
      const result = await UserWorkspaces.destroy({
        where: {
          user_id: user.id,
          workspace_id: workspaceId,
        },
      });

      if (result > 0) {
        return res
          .status(200)
          .json({ message: "Record deleted successfully." });
      } else {
        return res.status(404).json({ message: "No record found to delete." });
      }
    } catch (error) {
      console.error("Error :", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  addUserToTeam: async (req, res) => {
    try {
      const { email, workspaceId, teamId, role , team_name } = req.body;

      if (!email || !workspaceId || !teamId) {
        return res
          .status(400)
          .json({ message: "Email, workspaceId, and teamId are required." });
      }

      // Find user by email
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Check if the user is already in the team
      const existingInWS = await UserWorkspaces.findOne({
        where: {
          user_id: user.id,
          workspace_id: workspaceId,
          isAccepted: true,
        },
      });

      if (!existingInWS) {
        return res
          .status(400)
          .json({ message: "User is not at this Work Space " });
      }

      // Check if the user is already in the team
      const existingMember = await UserWorkspaces.findOne({
        where: { user_id: user.id, workspace_id: workspaceId, team_id: teamId },
      });

      if (existingMember) {
        return res
          .status(400)
          .json({ message: "User is already a member of this team." });
      }

      // Update existing user-workspace relationship
      const [updated] = await UserWorkspaces.update(
        { team_id: teamId, role: role || "member" }, // Fields to update
        { where: { user_id: user.id, workspace_id: workspaceId } } // Condition
      );

      if (updated === 0) {
        return res
          .status(404)
          .json({ message: "User is not part of this workspace." });
      }

      // Create a notification
      const notification = await Notification.create({
        userId: user.id,
        workspaceId,
        message: `You have been added to a new team (${team_name})`,
      });


      // emit notifcation when add user to team 
      const io = req.app.get("io"); // Get the Socket.IO instance
      const userRoom = `user_${user.id}&${workspaceId}`;
      io.to(userRoom).emit("notification", {
        userId: user.id,
        workspaceId,
        message: notification.message,
      });

      return res
        .status(200)
        .json({ message: "User added to the team successfully." });
    } catch (error) {
      console.error("Error adding user to team:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  },
};

export default inviteController;
