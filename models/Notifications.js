import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";
import User from "./user.js";
import Workspace from "./workspace.js";

const Notification = sequelize.define(
  "Notifications",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User, // Reference to Users table
        key: "id",
      },
      onDelete: "CASCADE",
    },
    workspaceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Workspace, // Reference to Workspaces table
        key: "id",
      },
      onDelete: "CASCADE",
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    readStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    updatedAt: false,
  }
);

// Relationships
User.hasMany(Notification, { foreignKey: "userId", onDelete: "CASCADE" });
Notification.belongsTo(User, { foreignKey: "userId" });

Workspace.hasMany(Notification, {
  foreignKey: "workspaceId",
  onDelete: "CASCADE",
});
Notification.belongsTo(Workspace, { foreignKey: "workspaceId" });

export default Notification;
