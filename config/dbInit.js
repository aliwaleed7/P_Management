// dbInit.js
import { Sequelize } from "sequelize";
import config from "./database.js";

const { database, username, password, host, dialect } = config.development;

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
});

export default sequelize;
