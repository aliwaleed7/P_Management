// models/Task.js
import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";
import List from "./List.js";
import UserTeamWorkspace from "./UserTeamWorkspace.js";
import Sprint from "./sprints.js";
import Timeline from "./Timeline.js";

const Task = sequelize.define("Task", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("To Do", "In Progress", "Done"),
    allowNull: false,
    defaultValue: "To Do",
  },
  priority: {
    type: DataTypes.ENUM("Low", "Medium", "High"),
    allowNull: false,
    defaultValue: "Low",
  },
  estimatedTime: {
    type: DataTypes.STRING,
    allowNull: true, // Can be stored as "2h 30m" or similar format
  },
  assigned_to: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: UserTeamWorkspace, // Reference to user_team_workspaces
      key: "user_id",
    },
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  listId: {
    type: DataTypes.INTEGER,
    references: {
      model: List,
      key: "id",
    },
    allowNull: false,
  },
  milestoneId: {
    type: DataTypes.INTEGER,
    references: {
      model: Timeline,
      key: "id",
    },
    allowNull: true,
  },
  sprintId: {
    type: DataTypes.INTEGER,
    references: {
      model: Sprint,
      key: "id",
    },
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
List.hasMany(Task, { foreignKey: "listId", onDelete: "CASCADE" });
Task.belongsTo(List, { foreignKey: "listId" });

Sprint.hasMany(Task, { foreignKey: "sprintId", onDelete: "CASCADE" });
Task.belongsTo(Sprint, { foreignKey: "sprintId" });

Timeline.hasMany(Task, { foreignKey: "milestoneId", onDelete: "CASCADE" });
Task.belongsTo(Timeline, { foreignKey: "milestoneId" });

// Relationship between Task and User (via user_team_workspaces)
UserTeamWorkspace.hasMany(Task, { foreignKey: "assigned_to" });
Task.belongsTo(UserTeamWorkspace, { foreignKey: "assigned_to" });

export default Task;
