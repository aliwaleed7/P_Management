import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";

const Subtask = sequelize.define(
  "Subtask",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    task_id: {
      type: DataTypes.INTEGER,
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
    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
    due_date: {
      type: DataTypes.DATE,
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
    tableName: "subtasks",
    timestamps: false, // Disable auto timestamps if not required
  }
);

// Define relationships (associations) if needed
Subtask.associate = (models) => {
  Subtask.belongsTo(models.Task, { foreignKey: "task_id" });
  Subtask.belongsTo(models.User, { foreignKey: "assigned_to" });
};

export default Subtask;
