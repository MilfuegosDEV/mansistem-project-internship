const db = require("../../config/db-config");
const bcrypt = require("bcryptjs");
const util = require("util");

// Promisificar db.query para poder usar async/await
db.query = util.promisify(db.query);

class userController {
  // Agregar un nuevo usuario a la base de datos
  static async addUser(
    name,
    lastname,
    username,
    email,
    password,
    role,
    province
  ) {
    try {
      // Hash de la contraseña antes de almacenarla
      const hashedPassword = await bcrypt.hash(password, 10); // El '10' es el número de rondas de salting, considera configurarlo externamente

      const query = `
        INSERT INTO USER 
          (name, last_name, username, email, password, role_id, province_id) 
        VALUES 
          (?, ?, ?, ?, ?, ?, ?)`;
      const result = await db.query(query, [
        name.toUpperCase(),
        lastname.toUpperCase(),
        username.toLowerCase(),
        email.toLowerCase(),
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
  static async editUser(id, email, password, role, province, user_status_id) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = `
        UPDATE USER 
          SET email=?,password=?, role_id=?, province_id = ?, user_status_id=?
        WHERE id=?;`;
      const result = await db.query(query, [
        email.toLowerCase(),
        hashedPassword,
        role,
        province,
        user_status_id,
        id,
      ]);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

module.exports = userController;
