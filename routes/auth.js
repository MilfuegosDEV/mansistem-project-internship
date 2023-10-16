const authController = require("../controllers/register");
const registerController = new authController();
const express = require("express");
const router = express.Router();

const modelProvince = require("../models/PROVINCE");
const PROVINCE = new modelProvince();

const bcrypt = require("bcryptjs");
// Register handle.
router.post("/register", async (req, res, next) => {
  const {
    name,
    lastname,
    username,
    email,
    password,
    password2,
    role,
    province,
  } = req.body;

  let errors = [];
  let success = [];

  if (
    !name ||
    !lastname ||
    !username ||
    !email ||
    !password ||
    !password2 ||
    !role ||
    !province
  ) {
    errors.push("Todos los campos deben estar llenos.");
  }

  if (password !== password2) {
    errors.push("Las contraseñas no coinciden.");
  }

  if (password.length < 6 || password2.length < 6) {
    errors.push("La contraseña debe ser mayor a 6 caracteres.");
  }

  // Check for errors.
  if (errors.length > 0) {
    req.flash("errors", errors);
    if (errors.length > 0) {
      req.flash("errors", errors);
      return res.render("register", {
        layout: false,
        title: "Register",
        message: req.flash(),
        provinces: await PROVINCE.getAll(),
      });
    }
  } else {
    // validation passed
    if (registerController.isUser(username)) {
      // User exists
      errors.push("Nombre de usuario en uso.");
      req.flash("errors", errors);
      res.render("register", {
        layout: false,
        title: "Register",
        message: req.flash(),
        provinces: await PROVINCE.getAll(),
      });
    }
    const newUserResponse = registerController.addUser(
      name,
      lastname,
      username,
      email,
      bcrypt.hash(password, 12),
      role,
      province
    );
    if (newUserResponse.length > 0) {
      success.push("Usuario registado");
      req.flash("success", success);
      res.send({ user: newUserResponse, flash: req.flash() });
    }
  }
});

module.exports = router;
