import db from "../../db/index.mjs";

export default class DeviceSupplierModel {
  /**
   * Recupera un proveedor de dispositivo mediante su nombre
   * @param {string} name
   * @returns {Promise <object> | undefined}
   */
  static async findByName(name) {
    if (!name) return undefined;
    name = name.toUpperCase().trim();
    try {
      const QUERY = "SELECT id, name FROM DEVICE_SUPPLIER WHERE name = ?";
      const [results] = await db.query(QUERY, [name]);
      return results[0];
    } catch (err) {
      throw new Error(err);
    }
  }
  /**
   * Recupera todos los provedores que estén habilitados
   * @returns {Promise<Array<object>> | undefined}
   */
  static async getEnabled() {
    try {
      const QUERY = "SELECT id, name FROM DEVICE_SUPPLIER WHERE status_id=?";
      const [results] = await db.query(QUERY, [1]);
      return results;
    } catch (err) {
      throw new Error(err);
    }
  }
}
