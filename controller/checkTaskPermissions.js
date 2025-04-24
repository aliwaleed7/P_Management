import UserTeamWorkspace from "../models/UserTeamWorkspace.js";
import Task from "../models/Task.js";
import List from "../models/List.js";

const checkTaskPermissions = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Fetch the task with its list
    const task = await Task.findByPk(taskId, { include: { model: List } });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (!task.List) {
      return res
        .status(400)
        .json({ message: "Task is not associated with any list" });
    }

    const teamId = task.List.team_id; // Get the team_id from the list

    // Get the user's role in the team
    const userRole = await UserTeamWorkspace.findOne({
      where: { user_id: userId, team_id: teamId },
    });

    if (!userRole) {
      return res.status(403).json({ message: "You are not part of this team" });
    }

    // ✅ Allow assigned user to set "To Do" or "Completed"
    if (["To Do", "Completed"].includes(status)) {
      if (task.assigned_to !== userId) {
        return res
          .status(403)
          .json({ message: "Only the assigned user can update this task" });
      }
    }

    // ✅ Allow only assigned user or team leader to set "In Progress"
    else if (status === "In Progress") {
      if (task.assigned_to !== userId && userRole.role !== "Team Leader") {
        return res.status(403).json({
          message:
            "Only the assigned user or team leader can set this task to In Progress",
        });
      }
    }

    // ✅ Only the team leader can set "Done"
    else if (status === "Done") {
      if (userRole.role !== "team_leader") {
        return res
          .status(403)
          .json({ message: "Only the team leader can review this task" });
      }
    }

    // Invalid status
    else {
      return res.status(400).json({ message: "Invalid status update" });
    }

    next();
  } catch (error) {
    console.error("Permission check error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default checkTaskPermissions;
