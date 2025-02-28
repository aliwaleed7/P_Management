import Team from "../models/Team.js";
import Workspace from "../models/workspace.js";
import UserTeamWorkspace from "../models/UserTeamWorkspace.js"
import User from "../models/user.js";
import List from "../models/List.js";
import sequelize from "../config/dbInit.js";


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

  getProjectMembers: async (req, res) => {
    try {
      const { projectId } = req.params;

      // Find the project
      const project = await List.findOne({
        where: { id: projectId },
        attributes: ["team_id"],
      });

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      let response = {};

      if (project.team_id) {
        // Fetch team name
        const team = await Team.findOne({
          where: { id: project.team_id },
          attributes: ["team_name"],
        });

        // Fetch team members with user IDs and usernames
        const members = await UserTeamWorkspace.findAll({
          where: { team_id: project.team_id },
          include: [{
            model: User,
            attributes: ["id", "username"] // Include both ID and username
          }],
        });

        response.team_name = team ? team.team_name : "Unknown Team";
        response.members = members.map((member) => ({
          id: member.User?.id,          // Include user ID
          username: member.User?.username
        })).filter(member => member.id && member.username); // Filter invalid entries

      } else {
        // Get users without a team including their IDs
        const usersWithoutTeam = await User.findAll({
          where: {
            id: sequelize.literal(`
          id NOT IN (
            SELECT user_id 
            FROM user_team_workspaces 
            WHERE team_id IS NOT NULL
          )
        `)
          },
          attributes: ["id", "username"], // Include both ID and username
        });

        response.team_name = null;
        response.members = usersWithoutTeam.map((user) => ({
          id: user.id,          // Include user ID
          username: user.username
        }));
      }

      res.json(response);
    } catch (error) {
      console.error("Error fetching project members:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
};

export default teamController;
