// models/Spaces.js
import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js"; // Import your Sequelize instance
import Workspaces from "./workspace.js";
import Users from "./user.js";

const Spaces = sequelize.define(
  "space",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    workspace_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Workspaces,
        key: "id",
      },
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      references: {
        model: Users,
        key: "id",
      },
      allowNull: false,
    },
    created_at: {
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
Workspaces.hasMany(Spaces, { foreignKey: "workspace_id", onDelete: "CASCADE" });
Spaces.belongsTo(Workspaces, { foreignKey: "workspace_id" });

Users.hasMany(Spaces, { foreignKey: "created_by", onDelete: "CASCADE" });
Spaces.belongsTo(Users, { foreignKey: "created_by" });

export default Spaces;
