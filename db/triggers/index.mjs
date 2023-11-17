import db from "../index.mjs";

export default class Triggers {
  /**
   * HISTORIAL DE CAMBIOS. ADEMÁS, INDICA QUIÉN REALIZÓ EL CAMBIO.
   * Si no existe una tabla de auditoria para la tabla que deseas auditar,
   * esta se generará automáticamente.
   * @param {string} TABLE La tabla que será auditada.
   */
  constructor(TABLE) {
    if (!TABLE) throw new Error("No se ha indicado la tabla a auditar.");
    this.TABLE = TABLE;
    this.TABLE_AUDIT = `${this.TABLE}_AUDIT`;

    // CREAR LA TABLA DE AUDITORIA EN EL CASO DE QUE NO EXISTA PARA X TABLA;
    db.query(`
      CREATE TABLE IF NOT EXISTS ${this.TABLE_AUDIT} (
        audit_id INT AUTO_INCREMENT PRIMARY KEY,
        updated_id INT NOT NULL,
        action_performed ENUM('INSERT','UPDATE'),
        performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        performed_by_user_id INT NOT NULL,
        field_changed VARCHAR(255),
        old_value VARCHAR(255),
        new_value VARCHAR(255),
        
      FOREIGN KEY (updated_id) REFERENCES ${this.TABLE}(id),
      FOREIGN KEY (performed_by_user_id) REFERENCES ${this.TABLE}(id)
    );`);
  }

  /**
   * Registra un nuevo registro dentro de la base de datos.
   * @param {int} performed_by_user_id El USUARIO QUE REALIZÓ EL REGISTRO.
   */
  async InsertionAudit(performed_by_user_id) {
    try {
      const [last] = await db.query(
        `SELECT id FROM ${this.TABLE} ORDER BY id DESC LIMIT 1;`
      );

      await db.query(
        `INSERT INTO ${this.TABLE_AUDIT} (updated_id, action_performed, performed_by_user_id, field_changed) VALUES (?, ?, ?, ?);`,
        [
          last[0].id,
          "INSERT",
          performed_by_user_id,
          `new ${this.TABLE.toLowerCase()}`,
        ]
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  /**
   * Registra los cambios que se han realizado en la tabla usuarios. Además, indica quién los realizó.
   * @param {int} performed_by_user_id El usuario que realizo el nombre
   * @param {int} updated_id El registro que fue editado
   * @param {object} editedFields // Los valores que se esperan que sean editados.
   */
  async UpdateAudit(performed_by_user_id, updated_id, editedFields) {
    if (!performed_by_user_id || !updated_id || !editedFields)
      throw new Error("Faltan parametros.");
    const fields = Object.keys(editedFields);
    try {
      const [results] = await db.query(
        `SELECT 
            ${fields.join(",")}
        FROM 
            ${this.TABLE}
        WHERE id=?`,
        [updated_id]
      );
      const oldValues = results[0];
      // Comparar los valores antiguos con los nuevos y auditar los cambios
      fields.forEach(async (field) => {
        const oldValue = oldValues[field];
        const newValue = editedFields[field];

        if (oldValue !== newValue) {
          await db.query(
            `INSERT INTO ${this.TABLE_AUDIT} (updated_id, action_performed, performed_by_user_id, field_changed, old_value, new_value) VALUES (?, ?, ?, ?, ?, ?);`,
            [
              updated_id,
              "UPDATE",
              performed_by_user_id,
              field,
              oldValue,
              newValue,
            ]
          );
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
