import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";
import Space from "./Space.js";
import Team from "./Team.js";
import Folder from "./Folder.js";
import User from "./user.js";

const List = sequelize.define(
  "List",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    space_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "spaces",
        key: "id",
      },
    },
    team_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "teams",
        key: "id",
      },
    },
    folder_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "folders",
        key: "id",
      },
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
  },
  {
    tableName: "lists",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Define associations
List.belongsTo(Space, { foreignKey: "space_id", onDelete: "SET NULL" });
List.belongsTo(Team, { foreignKey: "team_id", onDelete: "SET NULL" });
List.belongsTo(Folder, { foreignKey: "folder_id", onDelete: "SET NULL" });
List.belongsTo(User, { foreignKey: "created_by", onDelete: "CASCADE" });

Space.hasMany(List, { foreignKey: "space_id", onDelete: "SET NULL" });
Team.hasMany(List, { foreignKey: "team_id", onDelete: "SET NULL" });
Folder.hasMany(List, { foreignKey: "folder_id", onDelete: "SET NULL" });
User.hasMany(List, { foreignKey: "created_by", onDelete: "CASCADE" });

export default List;
