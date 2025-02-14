// models/UserTeamWorkspace.js
import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";
import User from "./user.js";
import Workspace from "./workspace.js";
import Team from "./Team.js";

const UserTeamWorkspace = sequelize.define("user_team_workspaces", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Reference to Users table
      key: "id",
    },
    onDelete: "CASCADE",
  },
  workspace_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Workspace, // Reference to Workspaces table
      key: "id",
    },
    onDelete: "CASCADE",
  },
  team_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Team, // Reference to Teams table
      key: "id",
    },
    onDelete: "CASCADE",
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true, // Optional: e.g., "admin" or "member"
  },
  isAccepted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Invitations are not accepted by default
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

// Relationships
User.hasMany(UserTeamWorkspace, { foreignKey: "user_id", onDelete: "CASCADE" });
UserTeamWorkspace.belongsTo(User, { foreignKey: "user_id" });

Workspace.hasMany(UserTeamWorkspace, {
  foreignKey: "workspace_id",
  onDelete: "CASCADE",
});
UserTeamWorkspace.belongsTo(Workspace, { foreignKey: "workspace_id" });

Team.hasMany(UserTeamWorkspace, { foreignKey: "team_id", onDelete: "CASCADE" });
UserTeamWorkspace.belongsTo(Team, { foreignKey: "team_id" });

export default UserTeamWorkspace;
