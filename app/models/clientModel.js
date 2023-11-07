const db = require("../../config/db-config");
const util = require("util");

// Promisificar db.query para poder usar async/await
db.query = util.promisify(db.query);

class CLIENT {
  /**
   * Recupera todos los clientes.
   * @returns {Promise<Array>} Una promesa que se resuelve con un arreglo de clientes.
   */
  static async getAll() {
    try {
      const userRoles = await db.query("SELECT * FROM CLIENT");
      return userRoles;
    } catch (error) {
      console.error(error);
      throw new Error("Error al recuperar los clientes.");
    }
  }
  static async findByName(name) {
    try {
      const query = "SELECT * FROM CLIENT WHERE name = ?";
      const results = await db.query(query, name);
      return results;
    } catch (error) {
      console.error(error);
      throw new Error("Error al recuperar el cliente.");
    }
  }
  static async findByEmail(email) {
    try {
      const query = "SELECT * FROM CLIENT WHERE email = ?";
      const results = await db.query(query, email);
      return results;
    } catch (error) {
      console.error(error);
      throw new Error("Error al recuperar el cliente.");
    }
  }
  static async findByPhoneNumber(phone) {
    try {
      const query = "SELECT * FROM CLIENT WHERE phone = ?";
      const results = await db.query(query, phone);
      return results;
    } catch (error) {
      console.error(error);
      throw new Error("Error al recuperar el cliente.");
    }
  }
}

module.exports = CLIENT;
