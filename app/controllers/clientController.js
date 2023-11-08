const db = require("../../config/db-config");
const util = require("util");

db.query = util.promisify(db.query);

class clientController {
  static async addClient(name, address, phone, email, province_id) {
    try {
      const query = `
        INSERT INTO CLIENT 
          (name, address, phone, email, province_id)
        VALUES 
          (?, ?, ?, ? ,?);`;
      const result = await db.query(query, [
        name.toUpperCase().trim(),
        address.toUpperCase().trim(),
        phone.toLowerCase(),
        email.toLowerCase().trim(),
        province_id,
      ]);

      return result;
    } catch (error) {
      console.error(error);
      throw new Error("Error al agregar el cliente");
    }
  }
  static async editClient(
    id,
    name,
    address,
    phone,
    email,
    province_id,
    status_id
  ) {
    try {
      const query = `
        UPDATE CLIENT
          SET name=?,address=?, phone=?, email=?, province_id=?, status_id=?
        WHERE id=?  
        `;

      const result = await db.query(query, [
        name.toUpperCase().trim(),
        address.toUpperCase().trim(),
        phone.toLowerCase(),
        email.toLowerCase().trim(),
        province_id,
        status_id,
        id,
      ]);

      return result;
    } catch (error) {
      console.error(error);
      throw new Error("Error al editar el cliente");
    }
  }
}

module.exports = clientController;
