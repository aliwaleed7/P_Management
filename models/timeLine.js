// models/Timeline.js
import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";
import List from "./List.js";

const Timeline = sequelize.define("Timeline", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  list_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: List, // Reference to the Lists table
      key: "id",
    },
    onDelete: "CASCADE", // If the referenced List is deleted, delete the Timeline
  },
  milestone: {
    type: DataTypes.STRING,
    allowNull: false, // Name or description of the milestone
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: false, // Due date for the milestone
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, // Automatically set to the current timestamp
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, // Automatically set to the current timestamp
  },
});

// Relationships
List.hasMany(Timeline, { foreignKey: "list_id", onDelete: "CASCADE" });
Timeline.belongsTo(List, { foreignKey: "list_id" });

export default Timeline;
