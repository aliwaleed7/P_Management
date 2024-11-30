import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";
import User from "./user.js";

const Notification = sequelize.define("Notification", {
  message: { type: DataTypes.TEXT, allowNull: false },
  readStatus: { type: DataTypes.BOOLEAN, defaultValue: false },
});

User.hasMany(Notification, { foreignKey: "userId", onDelete: "CASCADE" });
Notification.belongsTo(User, { foreignKey: "userId" });

export default Notification;
