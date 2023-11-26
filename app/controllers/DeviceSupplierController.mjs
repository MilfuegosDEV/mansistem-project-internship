import db from "../../db/index.mjs";
import Triggers from "../../db/triggers/index.mjs";

class DeviceSupplierController extends Triggers {
  constructor() {
    super("DEVICE_SUPPLIER");
  }
  /**
   * Registra un nuevo proveedor
   * @param {string} name
   * @param {number} performed_by_user_id El usuario que realiza la acción.
   * @returns {Promise <1|0>}
   */
  async add(name, performed_by_user_id) {
    if (!name || !performed_by_user_id) return 0;
    try {
      const QUERY = "INSERT INTO DEVICE_SUPPLIER (name) VALUES (?)";

      await db.query(QUERY, [name]);

      await this.InsertionAudit(performed_by_user_id);
      return 1;
    } catch (err) {
      console.error("Error:", err);
      return 0;
    }
  }
  /**
   * Actualiza el estado de un proveedor
   * @param {number} updated_id El proveedor que será actualizada
   * @param {number} status
   * @param {number} performed_by_user_id El usuario que realizó la acción
   * @returns {Promise <1|0>}
   */
  async edit(updated_id, status, performed_by_user_id) {
    if (typeof status === "undefined") return 0;
    try {
      const QUERY = "UPDATE DEVICE_SUPPLIER SET status_id=? WHERE id=?";
      await this.UpdateAudit(performed_by_user_id, updated_id, {
        status_id: status,
      });

      if (status === 0) {
        await db.query(
          "UPDATE DEVICE_TYPE set status_id=0 WHERE device_supplier_id=?",
          updated_id
        );
        await db.query(
          "UPDATE DEVICE set status_id=0 WHERE device_supplier_id=?",
          updated_id
        );
      }
      await db.query(QUERY, [status, updated_id]);
      return 1;
    } catch (err) {
      console.error(err);
      return 0;
    }
  }
}

export default new DeviceSupplierController();
