import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";
import Task from "./Task.js";
import User from "./user.js";

const File = sequelize.define("File", {
  filePath: { type: DataTypes.STRING, allowNull: false },
  uploadedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

Task.hasMany(File, { foreignKey: "taskId", onDelete: "CASCADE" });
File.belongsTo(Task, { foreignKey: "taskId" });

User.hasMany(File, { foreignKey: "uploadedBy", onDelete: "CASCADE" });
File.belongsTo(User, { foreignKey: "uploadedBy" });

export default File;
