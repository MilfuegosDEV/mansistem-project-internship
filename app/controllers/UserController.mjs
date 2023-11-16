import db from "../../db/index.mjs";
import bcryptjs from "bcryptjs";
import Triggers from "./triggers/index.mjs";

export default class extends Triggers {
  /**
   * Añade un nuevo usuario
   * @param {string} name Nombre del usuario
   * @param {string} last_name Apellido del usuario
   * @param {string} username Nombre de usuario
   * @param {string} email Correo del usuario
   * @param {string} password Contraseña del usuario
   * @param {string} role Rol del usuario
   * @param {string} province Provincia del usuario
   * @param {string} performed_by_user_id usuario que añadió el perfil
   * @returns {int} 1 si completa la acción de lo contrario 0;
   */
  static async add(
    name,
    last_name,
    username,
    email,
    password,
    role,
    province,
    performed_by_user_id
  ) {
    if (
      !name ||
      !last_name ||
      !username ||
      !email ||
      !password ||
      !role ||
      !province ||
      !performed_by_user_id
    )
      return 0;
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

      await this.auditUserCreation(performed_by_user_id);
      return 1;
    } catch (error) {
      console.error("Error", error);
      return 0;
    }
  }
  /**
   * Actualiza la información del usuario
   * @param {int} user_updated_id id del usuario
   * @param {string} email Email del usuario
   * @param {string} password Contraseña del usuario
   * @param {int} role Rol del usuario
   * @param {int} province Provincia del usuario
   * @param {int} status Estado del usuario `{1: "habilitado", 0: 'inhabilitado'}`
   * @param {int} performed_by_user_id id del usuario que realizó la acción
   * @returns {int} 1 si completa la acción de lo contrario 0;
   */
  static async edit(
    user_updated_id,
    email,
    password,
    role,
    province,
    status,
    performed_by_user_id
  ) {
    if (
      !user_updated_id ||
      !email ||
      !password ||
      !role ||
      !province ||
      !status ||
      !performed_by_user_id
    )
      return 0;
    try {
      const hashedPassword = await bcryptjs.hash(password, 10);
      this.auditUserUpdate(performed_by_user_id, user_updated_id, {
        email: email,
        password: hashedPassword,
        role_id: parseInt(role),
        province_id: parseInt(province),
        status_id: parseInt(status),
      });
      const query = `
        UPDATE USER 
          SET email=?,password=?, role_id=?, province_id = ?, status_id=?
        WHERE id=?;`;
      await db.query(query, [
        email.toLowerCase().trim(),
        hashedPassword,
        role,
        province,
        status,
        user_updated_id,
      ]);
      return 1;
    } catch (error) {
      console.error("Error", error);
      return 0;
    }
  }
}
