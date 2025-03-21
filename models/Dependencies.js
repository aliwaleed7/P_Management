import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";
import Task from "./Task.js";
import Subtask from "./Subtask.js";

const Dependency = sequelize.define(
  "Dependency",
  {
    taskId: {
      type: DataTypes.INTEGER,
      references: {
        model: Task,
        key: "id",
      },
      allowNull: true,
    },

    subtask_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Subtask,
        key: "id",
      },
      allowNull: true,
    },

    dependentOnTaskId: {
      type: DataTypes.INTEGER,
      references: {
        model: Task,
        key: "id",
      },
      allowNull: true, // Changed to true
    },
    dependentOnSubTaskId: {
      type: DataTypes.INTEGER,
      references: {
        model: Subtask,
        key: "id",
      },
      allowNull: true, // Changed to true
    },
    dependencyType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "dependencies", // Ensures table name matches
    timestamps: true, // Enable createdAt and updatedAt
  }
);

// Relationships
Task.hasMany(Dependency, {
  foreignKey: "taskId",
  onDelete: "CASCADE",
  as: "dependencies",
});
Dependency.belongsTo(Task, { foreignKey: "taskId", as: "task" });

// Dependency.belongsTo(Task, {
//   foreignKey: "dependentOnTaskId",
//   as: "dependentOnTask",
// });
// Dependency.belongsTo(Subtask, {
//   foreignKey: "dependentOnSubTaskId",
//   as: "dependentOnSubTask",
// });

export default Dependency;
  