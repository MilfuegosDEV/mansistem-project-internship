import db from "../../db/index.mjs";
import Triggers from "../../db/triggers/index.mjs";
import DeviceClassModel from "../models/DeviceClassModel.mjs";
import DeviceSupplierModel from "../models/DeviceSupplierModel.mjs";

class DeviceTypeController extends Triggers {
  constructor() {
    super("DEVICE_TYPE");
  }
  /**
   * Registra un nuevo proveedor
   * @param {string} name
   * @param {number} supplier_id proveedor
   * @param {number} class_id clase del producto
   * @param {number} performed_by_user_id El usuario que realiza la acción.
   * @returns {Promise <1|0>}
   */
  async add(name, supplier_id, class_id, performed_by_user_id) {
    if (!name || !supplier_id || !class_id || !performed_by_user_id) return 0;
    try {
      const QUERY =
        "INSERT INTO DEVICE_TYPE (name, device_supplier_id, device_class_id) VALUES (?, ?, ?)";

      await db.query(QUERY, [name, supplier_id, class_id]);

      await this.InsertionAudit(performed_by_user_id);
      return 1;
    } catch (err) {
      console.error("Error:", err);
      return 0;
    }
  }
  /**
   * Actualiza el estado de un tipo de dispositivo
   * @param {number} updated_id El tipo de dispositivo que será actualizada
   * @param {number} status
   * @param {string} className
   * @param {string} supplier
   * @param {number} performed_by_user_id El usuario que realizó la acción
   * @returns {Promise <1|0>}
   */
  async edit(updated_id, className, supplier, status, performed_by_user_id) {
    if (!className || !supplier || typeof status === "undefined") return 0;
    try {
      // Verifica si la clase o el proveedor están habilitados
      const supplierInfo = await DeviceSupplierModel.findByName(supplier);
      const classInfo = await DeviceClassModel.findByName(className);

      if (supplierInfo.status_id && classInfo.status_id) {
        const QUERY = "UPDATE DEVICE_TYPE SET status_id=? WHERE id=?";
        await this.UpdateAudit(performed_by_user_id, updated_id, {
          status_id: status,
        });
        await db.query(QUERY, [status, updated_id]);
        return 1;
      }
      return null;
    } catch (err) {
      console.error(err);
      return 0;
    }
  }
}

export default new DeviceTypeController();
