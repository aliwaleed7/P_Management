import TimeLog from "../models/timeLogs.js";

const timeLogController = {
  startTimer: async (req, res) => {
    try {
      const { taskId, subtaskId } = req.body;
      const userId = req.user.id; // Assuming user is authenticated

      // Validate that at least taskId or subtaskId is provided
      if (!taskId && !subtaskId) {
        return res.status(400).json({
          message: "Either taskId or subtaskId must be provided",
        });
      }

      // Create a new time log entry
      const newLog = await TimeLog.create({
        task_id: taskId || null,
        subtask_id: subtaskId || null,
        user_id: userId,
        start_time: new Date(),
        end_time: null,
        duration: null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      res.status(201).json({
        message: "Timer started successfully",
        log: newLog,
      });
    } catch (error) {
      console.error("Error starting timer:", error);
      res.status(500).json({ message: "Failed to start timer", error });
    }
  },

  stopTimer: async (req, res) => {
    try {
      const { taskId, subtaskId } = req.body; // Identify which timer to stop
      const userId = req.user.id; // Assuming user is authenticated

      if (!taskId && !subtaskId) {
        return res.status(400).json({
          message: "Either taskId or subtaskId must be provided",
        });
      }

      // Find the latest active time log
      const activeLog = await TimeLog.findOne({
        where: {
          user_id: userId,
          ...(taskId ? { task_id: taskId } : {}),
          ...(subtaskId ? { subtask_id: subtaskId } : {}),
          end_time: null, // Ensure it's still running
        },
        order: [["start_time", "DESC"]], // Get the most recent log
      });

      if (!activeLog) {
        return res
          .status(404)
          .json({ message: "No active timer found for this task/subtask" });
      }

      const endTime = new Date();
      const durationInMinutes = Math.floor(
        (endTime - new Date(activeLog.start_time)) / 60000
      ); // Convert ms to minutes

      // Calculate hours and minutes
      const hours = Math.floor(durationInMinutes / 60);
      const minutes = durationInMinutes % 60;
      

      let duration;
      if (hours > 0) {
        duration = `${hours}h${minutes > 0 ? `:${minutes}m` : ""}`;
      } else {
        duration = `${minutes}m`;
      }

      // Update the time log with end time and duration
      await activeLog.update({
        end_time: endTime,
        duration,
        updated_at: new Date(),
      });

      // Ensure the updated data is returned
      await activeLog.reload();

      res.status(200).json({
        message: "Timer stopped successfully",
        log: activeLog,
      });
    } catch (error) {
      console.error("Error stopping timer:", error);
      res.status(500).json({ message: "Failed to stop timer", error });
    }
  },

  deleteTimer: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id; // Ensure user is authenticated

      // Find the time log by ID and ensure it belongs to the user
      const timeLog = await TimeLog.findOne({
        where: { id, user_id: userId },
      });

      if (!timeLog) {
        return res
          .status(404)
          .json({ message: "Time log not found or unauthorized" });
      }

      // Delete the time log
      await timeLog.destroy();

      // Respond with success message
      return res.status(200).json({ message: "Time log deleted successfully" });
    } catch (error) {
      console.error("Error deleting time log:", error);
      return res
        .status(500)
        .json({ message: "Failed to delete time log", error });
    }
  },
};

export default timeLogController;
