import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";

const TimeLog = sequelize.define(
  "TimeLog",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    subtask_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
      type: DataTypes.TEXT, // Duration in minutes
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "time_logs",
    timestamps: false, // Disable auto timestamps since created_at and updated_at are manually defined
  }
);

// Define relationships (associations)
TimeLog.associate = (models) => {
  TimeLog.belongsTo(models.Task, {
    foreignKey: "task_id",
    onDelete: "CASCADE",
  });
  TimeLog.belongsTo(models.Subtask, {
    foreignKey: "subtask_id",
    onDelete: "CASCADE",
  });
  TimeLog.belongsTo(models.User, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });
};

export default TimeLog;
