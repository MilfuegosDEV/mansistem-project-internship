import db from "../../db/index.mjs";

export default class {
  /**
   * Obtiene la información del usuario mediante su nombre de usuario.
   * @param {String} username
   * @returns {Promise<object>} Una promesa que se resulve devolviendo un objeto con la información del usuario.
   */
  static async findByUsername(username) {
    if (!username) return undefined;
    username = username.toLowerCase().trim();
    try {
      const QUERY = `SELECT * FROM USER WHERE username = ?`;
      const [result] = await db.query(QUERY, [username]);
      return result[0];
    } catch (err) {
      console.error("Error:", err);
      throw new Error(err);
    }
  }
  /**
   * Obtiene la información del usuario mediante su nombre de id.
   * @param {Int} id
   * @returns {Promise<object>} Una promesa que se resulve devolviendo un objeto con la información del usuario.
   */
  static async findById(id) {
    if (!id) return undefined;
    try {
      const QUERY = `SELECT * FROM USER WHERE id = ?`;
      const [result] = await db.query(QUERY, [id]);
      return result[0];
    } catch (err) {
      throw new Error(err);
    }
  }
  /**
   * Obtiene la información de todos los usuarios usuarios habilitados.
   * @returns {Promise<Array<object>>} Una promesa que se resulve devolviendo un arreglo con todos los usuarios habilitados.
   */
  static async getEnabled() {
    try {
      const query = "SELECT id, name, last_name FROM USER WHERE status_id = ?";
      const [results] = await db.query(query, [1]);
      return results;
    } catch (err) {
      throw new Error(err);
    }
  }
}
