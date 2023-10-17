const db = require("../db-connection/connection");

class roles {
  // Gets all information from PROVINCE TABLE
  async getAll() {
    try {
      const userRoles = await new Promise((resolve, reject) => {
        db.query("SELECT * FROM userRoles", (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        });
      });
      return userRoles;
    } catch (error) {
      throw error; // Aquí podrías manejar errores más específicos si lo deseas
    }
  }
}

module.exports = roles;
