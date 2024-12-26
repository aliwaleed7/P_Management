import Notification from "../models/Notifications.js"; // Ensure the model name matches your Sequelize model

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
};

export default notificationController;
