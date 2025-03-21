// models/Dashboard.js
import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js"; // Import your Sequelize instance
import Lists from "./List.js"; // Import Lists model

const Dashboard = sequelize.define(
  "dashboard",
  {
    dash_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    list_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Lists,
        key: "id",
      },
      allowNull: false,
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
    timestamps: true, // Enable timestamps
    createdAt: "created_at", // Map createdAt to created_at
    updatedAt: "updated_at", // Map updatedAt to updated_at
  }
);

// Relationships
Lists.hasMany(Dashboard, { foreignKey: "list_id", onDelete: "CASCADE" });
Dashboard.belongsTo(Lists, { foreignKey: "list_id" });

export default Dashboard;
