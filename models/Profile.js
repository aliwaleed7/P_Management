// models/Profile.js
import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";
import User from "./user.js";
import Workspace from "./workspace.js";  

const Profile = sequelize.define("Profile", {
  jobTitle: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  department: { type: DataTypes.STRING },
  role: {
    type: DataTypes.STRING,
  },
  picture: { type: DataTypes.STRING },

  // Adding the foreign keys for userId and workspaceId
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
    allowNull: false,
  },
  workspaceId: {
    type: DataTypes.INTEGER,
    references: {
      model: Workspace,
      key: "id",
    },
    allowNull: false,
  },
});

// Set up relationships with User and Workspace
User.hasOne(Profile, { foreignKey: "userId", onDelete: "CASCADE" });
Profile.belongsTo(User, { foreignKey: "userId" });

Workspace.hasMany(Profile, { foreignKey: "workspaceId", onDelete: "CASCADE" });
Profile.belongsTo(Workspace, { foreignKey: "workspaceId" });

export default Profile;
