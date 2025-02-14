import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";
import Workspace from "./workspace.js"; // Assuming you have a Workspace model

const Team = sequelize.define(
  "Team",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    team_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    workspace_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Workspaces", // Matches the migration file
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "teams",
    timestamps: true, // This will create createdAt and updatedAt automatically
  }
);

// Define the association
Team.belongsTo(Workspace, { foreignKey: "workspace_id", onDelete: "CASCADE" });
Workspace.hasMany(Team, { foreignKey: "workspace_id", onDelete: "CASCADE" });

export default Team;
