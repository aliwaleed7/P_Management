import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";
import Workspace from "./workspace.js";

const Team = sequelize.define("Team", {
  teamName: {
    type: DataTypes.STRING,
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

// Relationships
Workspace.hasMany(Team, { foreignKey: "workspaceId", onDelete: "CASCADE" });
Team.belongsTo(Workspace, { foreignKey: "workspaceId" });

export default Team;
