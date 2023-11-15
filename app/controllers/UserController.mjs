import db from "../../db/index.mjs";
import bcryptjs from "bcryptjs";

export default class {
  /**
   * Añade un nuevo usuario
   * @param {string} name Nombre del usuario
   * @param {string} last_name Apellido del usuario
   * @param {string} username Nombre de usuario
   * @param {string} email Correo del usuario
   * @param {string} password Contraseña del usuario
   * @param {string} role_id Rol del usuario
   * @param {string} province_id Provincia del usuario
   */
  static async add(name, last_name, username, email, password, role, province) {
    try {
      // Hash de la contraseña antes de almacenarla
      const hashedPassword = await bcryptjs.hash(password, 10); // El '10' es el número de rondas de salting, considera configurarlo externamente

      const query = `
        INSERT INTO USER 
          (name, last_name, username, email, password, role_id, province_id) 
        VALUES 
          (?, ?, ?, ?, ?, ?, ?)`;
      await db.query(query, [
        name.toUpperCase().trim(),
        last_name.toUpperCase().trim(),
        username.toLowerCase().trim(),
        email.toLowerCase().trim(),
        hashedPassword,
        role,
        province,
      ]);

      return 1;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }
  static async edit(id, email, password, role, province, status_id) {
    try {
      const hashedPassword = await bcryptjs.hash(password, 10);
      const query = `
        UPDATE USER 
          SET email=?,password=?, role_id=?, province_id = ?, status_id=?
        WHERE id=?;`;
      await db.query(query, [
        email.toLowerCase().trim(),
        hashedPassword,
        role,
        province,
        status_id,
        id,
      ]);
      return 1;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
}
