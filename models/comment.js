import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";
import Task from "./Task.js";
import Subtask from "./Subtask.js";
import User from "./user.js";

const Comment = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "tasks",
        key: "id",
      },
    },
    subtask_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "subtasks",
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    tableName: "comments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Define associations
Comment.belongsTo(Task, { foreignKey: "task_id", onDelete: "SET NULL" });
Comment.belongsTo(Subtask, { foreignKey: "subtask_id", onDelete: "SET NULL" });
Comment.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

Task.hasMany(Comment, { foreignKey: "task_id", onDelete: "SET NULL" });
Subtask.hasMany(Comment, { foreignKey: "subtask_id", onDelete: "SET NULL" });
User.hasMany(Comment, { foreignKey: "user_id", onDelete: "CASCADE" });

export default Comment;
