import db from "../../db/index.mjs";

export default class DeviceTypeModel {
  /**
   * Recupera un tipo de dispositivo mediante su nombre, clase y proveedor.
   * @param {string} name
   * @param {number} class_id
   * @param {number} supplier_id
   * @returns {Promise <object> | undefined}
   */
  static async findType(name, class_id, supplier_id) {
    if (!name || !class_id || !supplier_id) return undefined;
    name = name.toUpperCase().trim();
    try {
      const QUERY =
        "SELECT id, name FROM DEVICE_TYPE WHERE name=? AND device_class_id=? AND device_supplier_id=?";
      const [results] = await db.query(QUERY, [name, class_id, supplier_id]);
      return results[0];
    } catch (err) {
      throw new Error(err);
    }
  }
  /**
   * Recupera todos los tipos de dispostivos que estén habilitados
   * @returns {Promise<Array<object>> | undefined}
   */
  static async getEnabled() {
    try {
      const QUERY = "SELECT id, name FROM DEVICE_TYPE WHERE status_id=?";
      const [results] = await db.query(QUERY, [1]);
      return results;
    } catch (err) {
      throw new Error(err);
    }
  }
}
