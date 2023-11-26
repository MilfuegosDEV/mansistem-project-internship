import db from "../../db/index.mjs";

export default class DeviceClassModel {
  /**
   * Recupera una clase de dispositivo mediante su nombre
   * @param {string} name
   * @returns {Promise <object> | undefined}
   */
  static async findByName(name) {
    if (!name) return undefined;
    name = name.toUpperCase().trim();
    try {
      const QUERY = "SELECT id, name, status_id FROM DEVICE_CLASS WHERE name = ?";
      const [results] = await db.query(QUERY, [name]);
      return results[0];
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Recupera todas las clases de los dispositivos que estén habilitados
   * @returns {Promise <Array<object>> | undefined}
   */
  static async getEnabled() {
    try {
      const QUERY = "SELECT id, name FROM DEVICE_CLASS WHERE status_id = ?";
      const [results] = await db.query(QUERY, [1]);
      return results;
    } catch (err) {
      throw new Error(err);
    }
  }
  static async getById(id) {
    if (typeof id === "undefined") return undefined;
    try {
      const QUERY = "SELECT * FROM DEVICE_CLASS WHERE id=?";
      const [results] = await db.query(QUERY, [id]);
      return results[0];
    } catch (err) {
      throw new Error(err);
    }
  }
}
