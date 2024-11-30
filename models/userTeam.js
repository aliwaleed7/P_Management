import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";
import User from "./user.js";
import Team from "./Team.js";

const UserTeam = sequelize.define("UserTeam", {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
    allowNull: false,
  },
  teamId: {
    type: DataTypes.INTEGER,
    references: {
      model: Team,
      key: "id",
    },
    allowNull: false,
  },
  joinedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

// Relationships
User.belongsToMany(Team, {
  through: UserTeam,
  foreignKey: "userId",
  onDelete: "CASCADE",
});
Team.belongsToMany(User, {
  through: UserTeam,
  foreignKey: "teamId",
  onDelete: "CASCADE",
});

export default UserTeam;
