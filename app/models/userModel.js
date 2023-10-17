const db = require("../../config/db-config");
const util = require("util");

// Promisificar db.query para poder usar async/await
db.query = util.promisify(db.query);

class User {
  // Nombre de la clase actualizado para seguir las convenciones
  /**
   * Busca un usuario por medio de su username
   * @returns {Promise<Array>} Una promesa que se resuelve con un arreglo de la información del usuario.
   */
  async findOne(username) {
    try {
      const query = "SELECT * FROM users WHERE username = ?";
      const userInfo = await db.query(query, username);
      return userInfo;
    } catch (error) {
      console.error(error);
      throw new Error("Error al recuperar los roles de usuario.");
    }
  }
  async findById(user_id) {
    const query = `SELECT * FROM users WHERE id = ?`;
    const results = await db.query(query, user_id);
    return results;
  }
}

module.exports = User;
