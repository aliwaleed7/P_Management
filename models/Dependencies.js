import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";
import Task from "./Task.js";

const Dependency = sequelize.define("Dependency", {
  taskId: {
    type: DataTypes.INTEGER,
    references: {
      model: Task,
      key: "id",
    },
    allowNull: false,
  },
  dependentOnTaskId: {
    type: DataTypes.INTEGER,
    references: {
      model: Task,
      key: "id",
    },
    allowNull: false,
  },
  dependencyType: {
    type: DataTypes.ENUM(
      "Finish-to-Start",
      "Start-to-Start",
      "Finish-to-Finish",
      "Start-to-Finish"
    ),
    allowNull: false,
  },
});

// Relationships
Task.hasMany(Dependency, { foreignKey: "taskId", onDelete: "CASCADE" });
Dependency.belongsTo(Task, { foreignKey: "taskId" });

Task.hasMany(Dependency, {
  foreignKey: "dependentOnTaskId",
  onDelete: "CASCADE",
});
Dependency.belongsTo(Task, { foreignKey: "dependentOnTaskId" });

export default Dependency;
