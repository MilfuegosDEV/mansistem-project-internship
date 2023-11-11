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
    province,
    performed_by_user_id
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
        name.toUpperCase().trim(),
        lastname.toUpperCase().trim(),
        username.toLowerCase().trim(),
        email.toLowerCase().trim(),
        hashedPassword,
        role,
        province,
      ]);

      try {
        this.#audit_new_user(performed_by_user_id);
      } catch (err) {
        console.error(error);
      } finally {
        return result;
      }
    } catch (error) {
      console.error(error);
      throw new Error("Error al agregar el usuario.");
    }
  }
  static async editUser(id, email, password, role, province, status_id) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = `
        UPDATE USER 
          SET email=?,password=?, role_id=?, province_id = ?, status_id=?
        WHERE id=?;`;
      const result = await db.query(query, [
        email.toLowerCase().trim(),
        hashedPassword,
        role,
        province,
        status_id,
        id,
      ]);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  static async #audit_new_user(performed_by_user_id) {
    try {
      const [last] = await db.query(
        "SELECT id FROM USER ORDER BY id DESC LIMIT 1;"
      );

      const results = await db.query(
        `INSERT INTO USER_AUDIT (user_updated_id, action_performed, performed_by_user_id, field_changed) VALUES (?, ?, ?, ?);`,
        [last.id, "INSERT", performed_by_user_id, "NUEVO USUARIO"]
      );

      return results;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

module.exports = userController;
