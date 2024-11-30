import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";
import Workspace from "./workspace.js";
import Team from "./Team.js";
import UserWorkspace from "./userWorkspace.js";

const Project = sequelize.define("Project", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  workspaceId: {
    type: DataTypes.INTEGER,
    references: {
      model: Workspace,
      key: "id",
    },
    allowNull: false,
  },
  createdByUserId: {
    type: DataTypes.INTEGER,
    references: {
      model: UserWorkspace,
      key: "id",
    },
    allowNull: false,
  },
  teamId: {
    type: DataTypes.INTEGER,
    references: {
      model: Team,
      key: "id",
    },
    allowNull: true,
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true,
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
Workspace.hasMany(Project, { foreignKey: "workspaceId", onDelete: "CASCADE" });
Project.belongsTo(Workspace, { foreignKey: "workspaceId" });

UserWorkspace.hasMany(Project, {
  foreignKey: "createdByUserId",
  onDelete: "CASCADE",
});
Project.belongsTo(UserWorkspace, { foreignKey: "createdByUserId" });

Team.hasMany(Project, { foreignKey: "teamId", onDelete: "SET NULL" });
Project.belongsTo(Team, { foreignKey: "teamId" });

export default Project;
