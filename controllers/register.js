const db = require("../db-connection/connection");

class registerController {
  isUser(username) {
    const isUser = new Promise((resolve, reject) => {
      db.query(
        "SELECT id FROM USER WHERE username = ?",
        username,
        (err, results) => {
          return err ? reject(err) : resolve(results);
        }
      );
    });
    return isUser;
  }
  addUser(name, lastname, username, email, password, role, province) {
    const newUser = new Promise((reject, resolve) => {
      db.query(
        `INSERT INTO USER (name, lastname, username, email,password, role, province) VALUES ('${name}','${lastname}','${username}', '${email}','${password}','${role}', '${province}')`,
        (err, results) => {
          return err ? reject(err) : resolve(results);
        }
      );
    });
    return newUser;
  }
}
module.exports = registerController;
