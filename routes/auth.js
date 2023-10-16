const express = require("express");
const router = express.Router();

// Register handle.
router.post("/register", (req, res, next) => {
  const { name, lastname, username, password, password2, role } = req.body;

  let errors = [];
  let success = [];

  if (!name || !lastname || !username || !password || !password2 || !role) {
    errors.push("Todos los campos deben estar llenos.");
  }

  if (password !== password2) {
    errors.push("Las contraseñas no coinciden.");
  }

  if (password.length < 6 || password2.length < 6) {
    errors.push("La contraseña debe ser mayor a 6 caracteres.");
  }

  if (errors.length > 0) {
    req.flash("errors", errors);
    req.flash("success", success);

    res.locals.message = req.flash();
    res.render("register", {
      title: "register",
      layout: false,
      name,
      lastname,
      username,
      password,
      password2,
      role,
    });
  }
});

module.exports = router;
