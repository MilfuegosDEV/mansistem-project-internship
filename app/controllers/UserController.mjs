import db from "../../db/index.mjs";
import bcryptjs from "bcryptjs";
import Triggers from "../../db/triggers/index.mjs";

class UserController extends Triggers {
  constructor() {
    super("USER");
  }
  /**
   * Inserta un nuevo usuario
   * @param {string} name
   * @param {string} last_name
   * @param {string} username
   * @param {string} email
   * @param {string} password
   * @param {number} role
   * @param {number} province
   * @param {number} performed_by_user_id
   * @returns
   */
  async add(
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
      const hashedPassword = await bcryptjs.hash(password, 10);
      const query = `
        INSERT INTO USER 
        (name, last_name, username, email, password, role_id, province_id) 
        VALUES 
        (?, ?, ?, ?, ?, ?, ?)`;
      await db.query(query, [
        name,
        last_name,
        username,
        email,
        hashedPassword,
        role,
        province,
      ]);

      await this.InsertionAudit(performed_by_user_id);
      return 1;
    } catch (error) {
      console.error("Error", error);
      return 0;
    }
  }
  /**
   * Actualiza la información de un usuario
   * @param {number} updated_id El usuario que será actualizado
   * @param {string} email
   * @param {string} password
   * @param {number} role
   * @param {number} province
   * @param {number} status
   * @param {number} performed_by_user_id El usuario que realizó la actualización
   * @returns
   */
  async edit(
    updated_id,
    email,
    password,
    role,
    province,
    status,
    performed_by_user_id
  ) {
    if (
      !updated_id ||
      !email ||
      !password ||
      !role ||
      !province ||
      typeof status === "undefined" ||
      !performed_by_user_id
    )
      return 0;

    try {
      const hashedPassword = await bcryptjs.hash(password, 10);
      await this.UpdateAudit(performed_by_user_id, updated_id, {
        email: email,
        password: hashedPassword,
        role_id: role,
        province_id: province,
        status_id: status,
      });

      const query = `
        UPDATE USER 
          SET email=?,password=?, role_id=?, province_id=?, status_id=?
        WHERE id=?;`;
      const result = await db.query(query, [
        email,
        hashedPassword,
        role,
        province,
        status,
        updated_id,
      ]);

      return result;
    } catch (error) {
      console.error("Error", error);
      return 0;
    }
  }
}

export default new UserController();
