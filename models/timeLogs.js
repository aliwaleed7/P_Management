import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";
import Task from "./Task.js";

const TimeLog = sequelize.define(
  "TimeLog",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Tasks", // References the Tasks model
        key: "id",
      },
      onDelete: "CASCADE",
    },
    subtask_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Subtasks", // References the Subtasks model
        key: "id",
      },
      onDelete: "CASCADE",
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // References the Users model
        key: "id",
      },
      onDelete: "CASCADE",
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    duration: {
      type: DataTypes.TEXT, // Duration stored as text (minutes)
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      field: "updated_at",
    },
  },
  {
    tableName: "time_logs",
    timestamps: true,
    underscored: true,
  }
);

// ✅ Fix Association
Task.hasMany(TimeLog, {
  foreignKey: "task_id", // Sequelize uses `taskId` but maps to `task_id`
  as: "timeLogs",
});

TimeLog.belongsTo(Task, {
  foreignKey: "task_id",
  as: "task",
});

export default TimeLog;
