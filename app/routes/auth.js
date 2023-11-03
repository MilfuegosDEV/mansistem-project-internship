const registerController = require("../controllers/register");
const express = require("express");
const router = express.Router();

const passport = require("passport");

const userModel = require("../models/userModel");

const {
  handleValidation,
  checkNotEmpty,
  checkMinLength,
  checkPasswordsMatch,
  checkMaxLength,
  checkForBlank,
} = require("../middlewares/validation"); // Middleware de validaciones.

// Manejo de registro
router.post("/register", async (req, res, next) => {
  const validations = [
    (req) => checkNotEmpty(req.body.name, "nombre"),
    (req) => checkNotEmpty(req.body.lastname, "apellido"),
    (req) => checkNotEmpty(req.body.username, "nombre de usuario"),
    (req) => checkNotEmpty(req.body.email, "email"),
    (req) => checkMinLength(req.body.password, 6),
    (req) => checkPasswordsMatch(req.body.password, req.body.password2),
    (req) => checkForBlank(req.body.password, "contraseña"),
    (req) => checkMaxLength(req.body.name, 60, "nombre"),
    (req) => checkMaxLength(req.body.lastname, 60, "apellido"),
    (req) => checkMaxLength(req.body.username, 20, "usuario"),
  ];

  // Manejar las validaciones
  const errors = handleValidation(validations, req, res);

  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  try {
    const existingUser = await userModel.findOne(req.body.username);
    if (existingUser.length > 0) {
      res.status(400).json({ error: "El usuario ya existe" });
      return; // Termina la ejecución si el usuario ya existe
    }

    await registerController.addUser(
      req.body.name,
      req.body.lastname,
      req.body.username,
      req.body.email,
      req.body.password,
      req.body.role,
      req.body.province
    );
    res.status(200).json({ success: "Usuario registrado" });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

//Login
// Route for handling the POST request to /login
router.post("/login", async (req, res, next) => {
  const validations = [
    (req) => checkNotEmpty(req.body.username, "nombre de usuario"),
    (req) => checkNotEmpty(req.body.password, "contraseña"),
    (req) => checkForBlank(req.body.password, "contraseña")
  ];

  // Manejar las validaciones
  const errors = handleValidation(validations, req, res);

  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      // Manejar errores de autenticación
      return next(err);
    }
    if (!user) {
      // Redirigir al usuario de nuevo a la página de inicio de sesión con el mensaje de error
      return res.status(400).json({ success: false, error: info });
    } else {
      // La autenticación fue exitosa, el usuario está en req.user
      req.login(user, (err) => {
        if (err) {
          // Manejar errores de inicio de sesión
          return next(err);
        }
        res.status(200).json({ success: true, redirectUrl: "/" });
      });
    }
  })(req, res, next);
});

module.exports = router;
