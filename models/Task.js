// models/Task.js
import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";
import Workspace from "./workspace.js";

const Task = sequelize.define("Task", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Pending",
  },
  dueDate: {
    type: DataTypes.DATE,
  },
});

// Establishing relationships
Workspace.hasMany(Task, { foreignKey: "workspaceId", onDelete: "CASCADE" });
Task.belongsTo(Workspace, { foreignKey: "workspaceId" });

export default Task;
