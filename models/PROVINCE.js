const db = require("../db-connection/connection");

class province {

  // Gets all information into PROVINCE TABLE
  getAll() {
    const PROVINCES = new Promise((resolve, reject) => {
      db.query("SELECT * FROM PROVINCE", (err, results) => {
        return err ? reject(err) : resolve(results);
      });
    });
    return PROVINCES;
  }
}

module.exports = province;
