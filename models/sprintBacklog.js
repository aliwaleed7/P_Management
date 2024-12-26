// models/SprintBacklog.js
import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";
import Sprint from "./Sprint.js";
import BacklogItem from "./backlogItem.js";

const SprintBacklog = sequelize.define("SprintBacklog", {
  sprintId: {
    type: DataTypes.INTEGER,
    references: {
      model: Sprint,
      key: "id",
    },
    allowNull: false,
  },
  backlogItemId: {
    type: DataTypes.INTEGER,
    references: {
      model: BacklogItem,
      key: "id",
    },
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Relationships
Sprint.hasMany(SprintBacklog, { foreignKey: "sprintId", onDelete: "CASCADE" });
SprintBacklog.belongsTo(Sprint, { foreignKey: "sprintId" });

BacklogItem.hasMany(SprintBacklog, { foreignKey: "backlogItemId", onDelete: "CASCADE" });
SprintBacklog.belongsTo(BacklogItem, { foreignKey: "backlogItemId" });

export default SprintBacklog;
