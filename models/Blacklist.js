// models/Blacklist.js
import { DataTypes } from "sequelize";
import sequelize from "../config/dbInit.js";

const Blacklist = sequelize.define("Blacklist", {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

export default Blacklist;
