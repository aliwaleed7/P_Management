import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";
import Task from "./Task.js";
import Subtask from "./Subtask.js";
import Comment from "./Comment.js";
import User from "./user.js";

const File = sequelize.define(
  "File",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: false,
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
    comment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "comments",
        key: "id",
      },
    },
    uploaded_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    tableName: "files",
    timestamps: true,
    createdAt: "uploaded_at",
    updatedAt: false, // Files are not typically updated
  }
);

// Define associations
File.belongsTo(Task, { foreignKey: "task_id", onDelete: "SET NULL" });
File.belongsTo(Subtask, { foreignKey: "subtask_id", onDelete: "SET NULL" });
File.belongsTo(Comment, { foreignKey: "comment_id", onDelete: "SET NULL" });
File.belongsTo(User, { foreignKey: "uploaded_by", onDelete: "CASCADE" });

Task.hasMany(File, { foreignKey: "task_id", onDelete: "SET NULL" });
Subtask.hasMany(File, { foreignKey: "subtask_id", onDelete: "SET NULL" });
Comment.hasMany(File, { foreignKey: "comment_id", onDelete: "SET NULL" });
User.hasMany(File, { foreignKey: "uploaded_by", onDelete: "CASCADE" });

export default File;
