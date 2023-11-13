import "dotenv/config";
import mysql from "mysql2/promise";

const CONFIG = {
  host: process.env.DATABASE_SERVER,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
};

const connection = mysql.createPool(CONFIG);
connection
  .getConnection()
  .then((connection) => console.log("Conectado a la base de datos"))
  .catch((err) => {
    throw new Error(err);
  });
export default connection;