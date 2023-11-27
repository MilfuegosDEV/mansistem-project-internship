import db from "../../db/index.mjs";
import Triggers from "../../db/triggers/index.mjs";
import DeviceClassModel from "../models/DeviceClassModel.mjs";

class DeviceTypeController extends Triggers {
  constructor() {
    super("DEVICE_TYPE");
  }
  /**
   * Registra un nuevo proveedor
   * @param {string} name
   * @param {number} class_id clase del producto
   * @param {number} performed_by_user_id El usuario que realiza la acción.
   * @returns {Promise <1|0>}
   */
  async add(name, class_id, performed_by_user_id) {
    if (!name || !class_id || !performed_by_user_id) return 0;
    try {
      const QUERY =
        "INSERT INTO DEVICE_TYPE (name, device_class_id) VALUES (?, ?)";

      await db.query(QUERY, [name, class_id]);

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
  async edit(updated_id, className, status, performed_by_user_id) {
    if (!className || typeof status === "undefined") return 0;
    try {
      const classInfo = await DeviceClassModel.findByName(className);

      if (classInfo.status_id) {
        const QUERY = "UPDATE DEVICE_TYPE SET status_id=? WHERE id=?";
        if (status === 0)
          await db.query(
            "UPDATE DEVICE SET status_id=? WHERE device_type_id=?",
            [0, updated_id]
          );

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
