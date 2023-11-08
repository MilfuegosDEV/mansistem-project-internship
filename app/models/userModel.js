const db = require("../../config/db-config");
const util = require("util");

// Promisificar db.query para poder usar async/await
db.query = util.promisify(db.query);

class User {
  /**
   * Busca a un usuario por medio de su username
   * @returns {Promise<Array>} Una promesa que se resuelve con un arreglo de la información de un
   * usuario si el usuario no se encuentra, entonces retorna un arreglo vacío.
   */
  static async findOne(username) {
    try {
      const query = "SELECT * FROM USER WHERE username = ?";
      const userInfo = await db.query(query, username);
      return userInfo;
    } catch (error) {
      console.error(error);
      throw new Error("Error al recuperar los roles de usuario.");
    }
  }
  /**
   * Busca un usuario por del id
   * @returns {Promise<Array>} Una promesa que se resuelve con un arreglo de la información del usuario.
   */
  static async findById(user_id) {
    try {
      const query = "SELECT * FROM USER WHERE id = ?";
      const results = await db.query(query, user_id);
      return results;
    } catch (error) {
      console.error(error);
      throw new Error("Error al recuperar el usuario.");
    }
  }
  /**
   * Obtiene el id, el nombre y el apellido de los usuarios habilitados
   * @returns {Promise<Array>} Una promesa que se resuelve con un arreglo que incluye la el id, nombre y apellidos de los todos los usuarios habilitados.
   */
  static async getEnabledUsers() {
    try {
      const query = `
        SELECT 
          id, name, last_name 
        FROM USER
        WHERE 
          status_id = ?
      `;
      const results = await db.query(query, 1);
      return results;
    } catch (error) {
      console.error(error);
      throw new Error("ERROR AL RECUPERAR LOS USUARIOS");
    }
  }
}

module.exports = User;
