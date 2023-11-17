import db from "../../db/index.mjs";
import Triggers from "../../db/triggers/index.mjs";

class ClientController extends Triggers {
  constructor() {
    super("CLIENT");
  }
  /**
   * Inserta un nuevo cliente
   * @param {string} name
   * @param {string} address
   * @param {string} phone
   * @param {string} email
   * @param {number} province
   * @param {number} performed_by_user_id El usuario que realizó la acción.
   * @returns
   */
  async add(name, address, phone, email, province, performed_by_user_id) {
    if (
      !name ||
      !address ||
      !phone ||
      !email ||
      !province ||
      !performed_by_user_id
    )
      return 0;

    try {
      const query = `
        INSERT INTO CLIENT 
            (name, address, phone, email, province_id) 
        VALUES 
            (?, ?, ?, ?, ?)`;
      await db.query(query, [
        name,
        address,
        phone,
        email,
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
   * Actualiza la información de un cliente
   * @param {number} updated_id El cliente que será actualizado
   * @param {string} name
   * @param {string} address
   * @param {string} phone
   * @param {string} email
   * @param {number} province
   * @param {number} status
   * @param {number} performed_by_user_id El usuario que realizó la actualización
   * @returns
   */
  async edit(
    updated_id,
    name,
    address,
    phone,
    email,
    province,
    status,
    performed_by_user_id
  ) {
    if (
      !updated_id ||
      !name ||
      !address ||
      !phone ||
      !email ||
      !province ||
      typeof status === 'undefined' ||
      !performed_by_user_id
    )
      return 0;

    try {
      await this.UpdateAudit(performed_by_user_id, updated_id, {
        name: name,
        address: address,
        phone: phone,
        email: email,
        province_id: province,
        status_id: province, 
      });

      const query = `
        UPDATE USER 
          SET name=?, address=?, phone=?, email=?, province_id=?, status_id=?
        WHERE id=?;`;
      const result = await db.query(query, [
        name,
        address,
        phone,       
        email,
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

export default new ClientController();
