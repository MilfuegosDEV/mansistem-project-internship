require("dotenv").config();
const mysql = require("mysql2");

const CONFIG = {
  host: process.env.DATABASE_SERVER,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
};

const connection = mysql.createPool(CONFIG);

module.exports = connection;
