// models/Sprint.js
import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";
import List from "./List.js";

const Sprint = sequelize.define("sprint", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  goal: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER, // Represents the duration of the sprint
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Defaults to false (inactive)
  },
  status: {
    type: DataTypes.TEXT,
    allowNull: true, // Optional: e.g., "planned", "in progress", "completed"
  },
  list_id: {
    type: DataTypes.INTEGER,
    references: {
      model: List, // Reference to the Lists table
      key: "id",
    },
    allowNull: true,
    onDelete: "SET NULL", // If the referenced List is deleted, set list_id to NULL
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: "created_at", // ✅ Maps Sequelize `createdAt` to `created_at`
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: "updated_at", // ✅ Maps Sequelize `updatedAt` to `updated_at`
  },
});

// Relationships
List.hasMany(Sprint, { foreignKey: "list_id", onDelete: "SET NULL" });
Sprint.belongsTo(List, { foreignKey: "list_id" });

export default Sprint;
