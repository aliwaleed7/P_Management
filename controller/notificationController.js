import Notification from "../models/Notifications.js"; // Ensure the model name matches your Sequelize model
import { Op } from "sequelize";


const notificationController = {
  getUserNotifications: async (req, res) => {
    const { userId, workspaceId } = req.query;

    // Validate input
    if (!userId || !workspaceId) {
      return res
        .status(400)
        .json({ message: "userId and workspaceId are required." });
    }

    try {
      // Fetch notifications from the database
      const notifications = await Notification.findAll({
        where: {
          userId,
          workspaceId,
        },
        order: [["createdAt", "DESC"]], // Optional: Order notifications by newest first
      });

      if (notifications.length > 0) {
        return res.status(200).json({
          message: "Notifications retrieved successfully.",
          data: notifications,
        });
      } else {
        return res.status(404).json({
          message: "No notifications found for the given user and workspace.",
        });
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  },

  getInvitations : async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from request params

    // Fetch notifications where message starts with "You are invited to join workspace"
    const invitations = await Notification.findAll({
      where: {
        userId: userId,
        message: {
          [Op.like]: "You are invited to join workspace%" // SQL LIKE operator
        }
      },
      order: [["createdAt", "DESC"]] // Sort by newest first
    });

    return res.status(200).json({
      success: true,
      data: invitations
    });
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch invitations",
    });
  }
  },
  deleteNotification : async (req, res) => {
  try {
    const { id } = req.params; // Get notification ID from request params

    // Find and delete the notification
    const deleted = await Notification.destroy({
      where: { id: id }
    });

    if (deleted) {
      return res.status(200).json({
        success: true,
        message: "Notification deleted successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
    });
  }
}
};

export default notificationController;
