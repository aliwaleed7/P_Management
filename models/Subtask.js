import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";
import Task from "./Task.js";

const Subtask = sequelize.define("Subtask", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.STRING, defaultValue: "pending" },
  taskId: {
    type: DataTypes.INTEGER,
    references: { model: Task, key: "id" },
    allowNull: false,
  },
});

// Relationships
Task.hasMany(Subtask, { foreignKey: "taskId", onDelete: "CASCADE" });
Subtask.belongsTo(Task, { foreignKey: "taskId" });

export default Subtask;
