const db = require("../db-connection/connection");
const util = require('util');

// Promisificar db.query para poder usar async/await
db.query = util.promisify(db.query);

class Province {
  /**
   * Recupera todas las provincias de la base de datos.
   * @returns {Promise<Array>} Una promesa que se resuelve con un arreglo de provincias.
   */
  async getAll() {
    try {
      // Directamente usando db.query con async/await gracias a la promisificación
      const provinces = await db.query("SELECT * FROM provinces");
      return provinces;
    } catch (error) {
      console.error(error);
      throw new Error('Error al recuperar las provincias.');
    }
  }
}

module.exports = Province;
