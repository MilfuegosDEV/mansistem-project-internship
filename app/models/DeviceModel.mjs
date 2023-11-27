import db from "../../db/index.mjs";

export default class DeviceModel {
  /**
   * Retorna un dispositivo si concuerda el nombre, el tipo, la clase y el proveedor.
   * @param {string} name
   * @param {number} type_id
   * @param {number} class_id
   * @param {number} supplier_id
   * @returns {Promise<object> | undefined} Promise
   */
  static async find(name, type_id, class_id, supplier_id) {
    if (!name || !class_id || !type_id || !supplier_id) return undefined;
    name = name.toUpperCase().trim();
    try {
      const QUERY =
        "SELECT id, model FROM DEVICE WHERE model=? AND device_type_id=? AND device_class_id=? AND device_supplier_id=?";
      const [results] = await db.query(QUERY, [
        name,
        type_id,
        class_id,
        supplier_id,
      ]);
      return results[0];
    } catch (err) {
      throw new Error(err);
    }
  }
  /**
   * Recupera todos los dispostivos que estén habilitados
   * @returns {Promise<Array<object>> | undefined}
   */
  static async getEnabled() {
    try {
      const QUERY = "SELECT id, name FROM DEVICE WHERE status_id=?";
      const [results] = await db.query(QUERY, [1]);
      return results;
    } catch (err) {
      throw new Error(err);
    }
  }
}
