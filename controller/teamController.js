import Team from "../models/Team.js";
import Workspace from "../models/workspace.js";

const teamController = {
  createTeam: async (req, res) => {
    try {
      const { teamName, workspaceId } = req.body;

      if (!teamName || !workspaceId) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const team = await Team.create({
        team_name: teamName,
        workspace_id: workspaceId,
      });

      return res.status(201).json({
        message: "Team created successfully",
        team,
      });
    } catch (error) {
      console.error("Error creating team:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  getTeamsByWorkspace: async (req, res) => {
    const { workspace_id } = req.params;

    try {
      // Check if workspace exists
      const workspace = await Workspace.findByPk(workspace_id);
      if (!workspace) {
        return res.status(404).json({
          success: false,
          message: "Workspace not found.",
        });
      }

      // Fetch teams belonging to the workspace
      const teams = await Team.findAll({
        where: { workspace_id },
      });

      return res.status(200).json({
        success: true,
        message: "Teams retrieved successfully.",
        data: teams,
      });
    } catch (error) {
      console.error("Error fetching teams:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching teams.",
        error: error.message,
      });
    }
  },
};

export default teamController;
