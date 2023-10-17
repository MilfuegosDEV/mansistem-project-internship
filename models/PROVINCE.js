const db = require("../db-connection/connection");

class Province {
  // Gets all information from PROVINCE TABLE
  async getAll() {
    try {
      const provinces = await new Promise((resolve, reject) => {
        db.query("SELECT * FROM provinces", (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        });
      });
      return provinces;
    } catch (error) {
      throw error; // Aquí podrías manejar errores más específicos si lo deseas
    }
  }
}

module.exports = Province;