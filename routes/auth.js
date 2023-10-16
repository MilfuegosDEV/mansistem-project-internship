const express = require("express");
const router = express.Router();

// Register handle.
router.post("/register", (req, res, next) => {
  const { name, lastname, username, password, password2, role } = req.body;

  let errors = [];

  if (!name || !lastname || !username || !password || !password2 || !role) {
    errors.push("Todos los campos deben estar llenos.");
  }

  if (password !== password2) {
    errors.push("Las contraseñas no coinciden.");
  }

  if (password < 6 || password2 < 6) {
    errors.push("La contraseña debe ser mayor a 6 caracteres.");
  }

  if (errors.length > 0) {
    req.flash("errors", errors);
    res.render('/register', {})
  }
});

module.exports = router;
