import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";
import User from "./user.js";
import Workspace from "./workspace.js"; // Import the Workspace model if it exists

const Notification = sequelize.define(
  "Notification",
  {
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    readStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    updatedAt: false, // Ensure updatedAt is completely disabled
  }
);

// Define associations
User.hasMany(Notification, { foreignKey: "userId", onDelete: "CASCADE" });
Notification.belongsTo(User, { foreignKey: "userId" });

Workspace.hasMany(Notification, {
  foreignKey: "workspaceId",
  onDelete: "CASCADE",
});
Notification.belongsTo(Workspace, { foreignKey: "workspaceId" });

export default Notification;
