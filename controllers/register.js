const db = require("../db-connection/connection");
const bcrypt = require("bcryptjs");

class RegisterController {
  async doesUserExist(username) {
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "SELECT id FROM users WHERE username = ?";
        db.query(query, [username], (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        });
      });

      // Si hay resultados, el usuario existe
      return results.length > 0;
    } catch (error) {
      throw error; // Aquí podrías manejar errores más específicos si lo deseas
    }
  }

  async addUser(name, lastname, username, email, password, role, province) {
    try {
      // Hash de la contraseña antes de almacenarla
      const hashedPassword = await bcrypt.hash(password, 10); // El '10' es el número de rondas de salting

      const result = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO users (name, lastname, username, email, password, role_id, province_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
        db.query(
          query,
          [name, lastname, username, email, hashedPassword, role, province],
          (err, results) => {
            if (err) {
              return reject(err);
            }
            resolve(results);
          }
        );
      });

      return result;
    } catch (error) {
      throw error; // Aquí podrías manejar errores más específicos si lo deseas
    }
  }
}

module.exports = RegisterController;
