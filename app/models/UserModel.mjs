import db from "../../db/index.mjs";

export default class {
  static async findByUsername(username) {
    if (!username) return undefined;
    try {
      const QUERY = `SELECT * FROM USER WHERE username = ?`;
      const [result] = await db.query(QUERY, [username]);
      return result[0];
    } catch (err) {
      console.error("Error:", err);
      throw new Error(err);
    }
  }
  static async findById(id) {
    if (!id) return undefined;
    try {
      const QUERY = `SELECT * FROM USER WHERE id = ?`;
      const [result] = await db.query(QUERY, [id]);
      return result[0];
    } catch (err) {
      console.error("Error:", err);
      throw new Error(err);
    }
  }
}
