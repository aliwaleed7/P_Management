// models/Sprint.js
import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";
import Project from "./Project.js";
import Workspace from "./workspace.js";

const Sprint = sequelize.define("Sprint", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  goal: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  projectId: {
    type: DataTypes.INTEGER,
    references: {
      model: Project,
      key: "id",
    },
    allowNull: false,
  },
  workspaceId: {
    type: DataTypes.INTEGER,
    references: {
      model: Workspace,
      key: "id",
    },
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Relationships
Project.hasMany(Sprint, { foreignKey: "projectId", onDelete: "CASCADE" });
Sprint.belongsTo(Project, { foreignKey: "projectId" });

Workspace.hasMany(Sprint, { foreignKey: "workspaceId", onDelete: "CASCADE" });
Sprint.belongsTo(Workspace, { foreignKey: "workspaceId" });

export default Sprint;
