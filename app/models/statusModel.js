const db = require("../../config/db-config");
const util = require("util");

// Promisificar db.query para poder usar async/await
db.query = util.promisify(db.query);

class STATUS {
  // Nombre de la clase actualizado para seguir las convenciones
  /**
   * Recupera todos los estados de usuario de la base de datos.
   * @returns {Promise<Array>} Una promesa que se resuelve con un arreglo de estados.
   */
  static async getAll() {
    try {
      const userRoles = await db.query("SELECT * FROM STATUS");
      return userRoles;
    } catch (error) {
      console.error(error);
      throw new Error("Error al recuperar los roles de usuario.");
    }
  }
}

module.exports = STATUS;