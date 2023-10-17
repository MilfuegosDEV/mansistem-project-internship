const db = require("../../config/db-config");
const bcrypt = require("bcryptjs");
const util = require("util");

// Promisificar db.query para poder usar async/await
db.query = util.promisify(db.query);

class RegisterController {
  // Verificar si el usuario ya existe en la base de datos
  async doesUserExist(username) {
    try {
      const query = "SELECT id FROM users WHERE username = ?";
      const results = await db.query(query, username);

      // Si hay resultados, el usuario existe
      return results.length > 0;
    } catch (error) {
      console.error(error);
      throw new Error("Error al verificar la existencia del usuario.");
    }
  }

  // Agregar un nuevo usuario a la base de datos
  async addUser(name, lastname, username, email, password, role, province) {
    try {
      // Hash de la contraseña antes de almacenarla
      const hashedPassword = await bcrypt.hash(password, 10); // El '10' es el número de rondas de salting, considera configurarlo externamente

      const query =
        "INSERT INTO users (name, lastname, username, email, password, role_id, province_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
      const result = await db.query(query, [
        name,
        lastname,
        username,
        email,
        hashedPassword,
        role,
        province,
      ]);

      return result;
    } catch (error) {
      console.error(error);
      throw new Error("Error al agregar el usuario.");
    }
  }
}

module.exports = RegisterController;
