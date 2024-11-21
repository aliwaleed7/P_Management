import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";
import User from "./user.js";

const Workspace = sequelize.define("Workspace", {
  name: { type: DataTypes.STRING, allowNull: false },
  ownerId: { type: DataTypes.INTEGER, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

// Define relationships
User.hasMany(Workspace, { foreignKey: "ownerId" });
Workspace.belongsTo(User, { foreignKey: "ownerId" });

export default Workspace;
