const userModel = require("../models/userModel");
const userController = require("../controllers/userController");

const { Router } = require("express");
const router = Router();

const {
  handleValidation,
  checkNotEmpty,
  checkMinLength,
  checkPasswordsMatch,
  checkMaxLength,
  checkForBlank,
} = require("../middlewares/validation"); // Middleware de validaciones.

// Manejo de registro
router.post("/addUser", async (req, res, next) => {
  const validations = [
    (req) => checkNotEmpty(req.body.name, "nombre"),
    (req) => checkNotEmpty(req.body.lastname, "apellido"),
    (req) => checkNotEmpty(req.body.username, "nombre de usuario"),
    (req) => checkNotEmpty(req.body.email, "email"),
    (req) => checkMinLength(req.body.password, 6),
    (req) => checkPasswordsMatch(req.body.password, req.body.password2),
    (req) => checkForBlank(req.body.password, "contraseña"),
    (req) => checkForBlank(req.body.email, "email"),
    (req) => checkForBlank(req.body.username, "nombre de usuario"),
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

    await userController.addUser(
      req.body.name,
      req.body.lastname,
      req.body.username,
      req.body.email,
      req.body.password.trim(),
      req.body.role,
      req.body.province
    );
    res.status(200).json({ success: "Usuario registrado" });
    return;
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/editUser", async (req, res, next) => {
  const validations = [
    (req) => checkMinLength(req.body.password, 6),
    (req) => checkPasswordsMatch(req.body.password, req.body.password2),
    (req) => checkForBlank(req.body.password, "editar contraseña"),
  ];

  // Manejar las validaciones
  const errors = handleValidation(validations, req, res);

  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  try {
    const existingUser = await userModel.findById(req.body.userId);
    if (existingUser.length <= 0) {
      res.status(400).json({ error: "El usuario no existe" });
      return; // Termina la ejecución si el usuario no existe
    }

    await userController.editUser(
      req.body.userId,
      req.body.email,
      req.body.password.trim(),
      req.body.role,
      req.body.province,
      req.body.status
    );
    res.status(200).json({ success: "Usuario editado" });
    return;
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
