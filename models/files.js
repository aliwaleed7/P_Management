import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";

const File = sequelize.define(
  "File",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    subtask_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    comment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    uploaded_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    uploaded_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "files",
    timestamps: false, // Disable createdAt and updatedAt fields if not needed
  }
);

// Define relationships (associations) if needed
File.associate = (models) => {
  File.belongsTo(models.Task, { foreignKey: "task_id" });
  File.belongsTo(models.Subtask, { foreignKey: "subtask_id" });
  File.belongsTo(models.Comment, { foreignKey: "comment_id" });
  File.belongsTo(models.User, { foreignKey: "uploaded_by" });
};

export default File;
