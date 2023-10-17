const AuthController = require("../controllers/register");
const registerController = new AuthController();
const express = require("express");
const router = express.Router();

const {
  handleValidation,
  checkNotEmpty,
  checkMinLength,
  checkPasswordsMatch,
  checkUserExists,
} = require("../middlewares/validationRegister"); // Asegúrate de usar la ruta correcta al archivo 'validationMiddleware.js'

// Manejo de registro
router.post(
  "/register",
  (req, res, next) => {
    // Definir las validaciones
    const validations = [
      (req) => checkNotEmpty(req.body.name, "Nombre"),
      (req) => checkNotEmpty(req.body.lastname, "Apellido"),
      (req) => checkNotEmpty(req.body.username, "Nombre de usuario"),
      (req) => checkNotEmpty(req.body.email, "Email"),
      (req) => checkMinLength(req.body.password, 6),
      (req) => checkPasswordsMatch(req.body.password, req.body.password2),
      (req) => checkUserExists(req.body.username),
      // ... otras validaciones según sea necesario
    ];

    // Manejar las validaciones
    handleValidation(validations, req, res, next);
  },
  async (req, res) => {
    await registerController.addUser(
      req.body.name,
      req.body.lastname,
      req.body.username,
      req.body.email,
      req.body.password,
      req.body.role,
      req.body.province
    );

    req.flash("success", "Te has registrado exitosamente");
    res.redirect("/register");
  }
);

module.exports = router;
