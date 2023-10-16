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

  if (password.length < 6 || password2.length < 6) {
    errors.push("La contraseña debe ser mayor a 6 caracteres.");
  }

  if (errors.length > 0) {
    // Flashing the errors to be available in the next request
    req.flash("errors", errors);

    // Redirecting back to the registration form along with the flashed messages
    res.render("register", {
      layout: false,
      title: "Register",
      message: req.flash(),
    });
  }
});

module.exports = router;
