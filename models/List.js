// models/List.js
import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js"; // Adjust the path to your Sequelize configuration

const List = sequelize.define(
  "list",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    space_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // A list can belong directly to a space (optional)
      references: {
        model: "spaces", // References the Spaces table
        key: "id",
      },
    },
    folder_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // A list can belong to a folder (optional)
      references: {
        model: "folders", // References the Folders table
        key: "id",
      },
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false, // The user who created the list
      references: {
        model: "Users", // References the Users table
        key: "id",
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Automatically set to the current timestamp
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Automatically set to the current timestamp
    },
  },
  {
    tableName: "lists", // Explicitly set the table name
    timestamps: false, // Disable Sequelize's default timestamps (createdAt, updatedAt)
  }
);

export default List;
