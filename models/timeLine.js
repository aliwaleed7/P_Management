import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";
import Project from "./Project.js";

const Timeline = sequelize.define("Timeline", {
  milestone: { type: DataTypes.STRING, allowNull: false },
  dueDate: { type: DataTypes.DATE, allowNull: false },
});

Project.hasMany(Timeline, { foreignKey: "projectId", onDelete: "CASCADE" });
Timeline.belongsTo(Project, { foreignKey: "projectId" });

export default Timeline;
