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
      allowNull: false,
    },
    taskId: {
      type: DataTypes.INTEGER,
      field: "task_id", // ✅ Ensure it matches DB column name
      references: {
        model: Task,
        key: "id",
      },
      allowNull: false,
    },
    subtaskId: {
      type: DataTypes.INTEGER,
      field: "subtask_id", // ✅ Ensure correct column mapping
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      field: "user_id",
      allowNull: false,
    },
    startTime: {
      type: DataTypes.DATE,
      field: "start_time",
      allowNull: true,
    },
    endTime: {
      type: DataTypes.DATE,
      field: "end_time",
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "time_logs", // ✅ Explicitly define table name
    timestamps: true,
  }
);

// ✅ Fix Association
Task.hasMany(TimeLog, {
  foreignKey: "taskId", // Sequelize uses `taskId` but maps to `task_id`
  as: "timeLogs",
});

TimeLog.belongsTo(Task, {
  foreignKey: "taskId",
  as: "task",
});

export default TimeLog;
