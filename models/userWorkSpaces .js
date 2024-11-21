import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user.js";
import Workspace from "./workspace.js";

const UserWorkspaces = sequelize.define("UserWorkspaces", {
  role: {
    type: DataTypes.STRING,
    defaultValue: "Member", // Role in the workspace
  },
  isAccepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Pending until the user accepts the invite
  },
});

// Many-to-Many Relationship
User.belongsToMany(Workspace, {
  through: UserWorkspaces,
  foreignKey: "userId",
});
Workspace.belongsToMany(User, {
  through: UserWorkspaces,
  foreignKey: "workspaceId",
});

export default UserWorkspaces;
