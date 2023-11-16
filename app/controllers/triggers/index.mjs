import db from "../../../db/index.mjs";
import bcryptjs from "bcryptjs";

export default class Triggers {
  constructor() {
    if (new.target === triggers) {
      throw new Error("No puedes instanciar directamente la clase base.");
    }
  }

  /**
   * Registra dentro de una tabla quién registró un nuevo usuario y cuándo lo hizo.
   * @param {int} performed_by_user_id
   */
  static async auditUserCreation(performed_by_user_id) {
    try {
      const [last] = await db.query(
        "SELECT id FROM USER ORDER BY id DESC LIMIT 1;"
      );

      const results = await db.query(
        `INSERT INTO USER_AUDIT (user_updated_id, action_performed, performed_by_user_id, field_changed) VALUES (?, ?, ?, ?);`,
        [last[0].id, "INSERT", performed_by_user_id, "NUEVO USUARIO"]
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  /**
   * Registra los cambios que se han realizado en la tabla usuarios. Además, indica quién los realizó.
   * @param {int} performed_by_user_id
   * @param {int} user_updated_id
   * @param {{email: string, password: string, role: string, province: string, status: string}} editedFields
   */
  static async auditUserUpdate(
    performed_by_user_id,
    user_updated_id,
    editedFields
  ) {
    try {
      const [results] = await db.query(
        `SELECT 
            email, password, role_id, province_id, status_id 
        FROM 
            USER 
        WHERE id=?`,
        [user_updated_id]
      );
      const oldValues = results[0];
      // Comparar los valores antiguos con los nuevos y auditar los cambios
      for (const field in editedFields) {
        const oldValue = oldValues[field];
        const newValue = editedFields[field];

        if (oldValue !== newValue) {
          await db.query(
            `INSERT INTO USER_AUDIT (user_updated_id, action_performed, performed_by_user_id, field_changed, old_value, new_value) VALUES (?, ?, ?, ?, ?, ?);`,
            [
              user_updated_id,
              "UPDATE",
              performed_by_user_id,
              field,
              oldValue,
              newValue,
            ]
          );
        }
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
