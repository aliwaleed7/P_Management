import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";

const Comment = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "comments",
    timestamps: false, // Disable automatic Sequelize timestamps if not needed
  }
);

// Define relationships (associations)
Comment.associate = (models) => {
  Comment.belongsTo(models.Task, { foreignKey: "task_id" });
  Comment.belongsTo(models.Subtask, { foreignKey: "subtask_id" });
  Comment.belongsTo(models.User, { foreignKey: "user_id" });
};

export default Comment;
