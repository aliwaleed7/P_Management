// models/Folder.js
import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js"; // Import your Sequelize instance

const Folder = sequelize.define(
  "folder",
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
      allowNull: true, // A folder can belong directly to a space (optional)
      references: {
        model: "Spaces", // References the Spaces table
        key: "id",
      },
    },
    parent_folder_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // A folder can belong to another folder (optional)
      references: {
        model: "folders", // Self-referencing to allow nested folders
        key: "id",
      },
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false, // The user who created the folder
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
    timestamps: false, // Disable Sequelize's default timestamps (createdAt, updatedAt)
  }
);

export default Folder;
