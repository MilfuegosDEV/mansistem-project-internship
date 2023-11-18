import db from "../../db/index.mjs";

export default class {
  /**
   * Busca un cliente mediante su nombre.
   * @param {String} name
   * @returns {Promise<object>} Una promesa que se resuelve con un objeto que contiene la información del cliente.
   */
  static async findByName(name) {
    if (!name) return undefined;
    name = name.toUpperCase().trim();
    try {
      const QUERY = "SELECT id, name FROM CLIENT WHERE name = ?";
      const [results] = await db.query(QUERY, [name]);
      return results[0];
    } catch (err) {
      console.log(err)
      throw new Error(err);
    }
  }
  /**
   * Busca un cliente mediante su email.
   * @param {String} email
   * @returns {Promise<object>} Una promesa que se resuelve con un objeto que contiene la información del cliente.
   */
  static async findByEmail(email) {
    if (!email) return undefined;
    email = email.toLowerCase().trim();
    try {
      const QUERY = "SELECT id, name FROM CLIENT WHERE email = ?";
      const [results] = await db.query(QUERY, [email]);
      return results[0];
    } catch (err) {
      console.log(err)
      throw new Error(err);
    }
  }
  /**
   * Busca un cliente mediante su número de teléfono.
   * @param {string} phone
   * @returns {Promise<object>} Una promesa que se resuelve con un objeto que contiene la información del cliente.
   */
  static async findByPhoneNumber(phone) {
    if (!phone) return undefined;
    try {
      const query = "SELECT id, name FROM CLIENT WHERE phone = ?";
      const [results] = await db.query(query, [phone]);
      return results[0];
    } catch (err) {
      console.log(err)
      throw new Error(err);
    }
  }
  /**
   * Obtiene la información de todos los clientes habilitados.
   * @returns {Promise<Array<object>>} Una promesa que se resulve devolviendo un arreglo con todos los clientes habilitados.
   */
  static async getEnabled() {
    try {
      const QUERY = "SELECT id, name FROM CLIENT WHERE status_id = ?";
      const [results] = await db.query(QUERY, [1]);
      return results;
    } catch (err) {
      console.log(err)
      throw new Error(err);
    }
  }
}
