import { Router } from "express";
import UserController from "../controllers/UserController.mjs";
import {
  checkNotEmpty,
  checkForBlank,
  checkMaxLength,
  checkMinLength,
  checkPasswordsMatch,
  handleValidation,
} from "../middlewares/validation.mjs";
import UserModel from "../models/UserModel.mjs";

const router = Router();

// Manejo de registro
router.post("/add", async (req, res, _next) => {
  const validations = [
    (req) => checkNotEmpty(req.body.name, "nombre"),
    (req) => checkNotEmpty(req.body.lastname, "apellido"),
    (req) => checkNotEmpty(req.body.username, "nombre de usuario"),
    (req) => checkNotEmpty(req.body.email, "email"),
    (req) => checkMinLength(req.body.password, 6, "contraseña"),
    (req) => checkPasswordsMatch(req.body.password, req.body.password2),
    (req) => checkForBlank(req.body.password, "contraseña"),
    (req) => checkForBlank(req.body.email, "email"),
    (req) => checkForBlank(req.body.username, "nombre de usuario"),
    (req) => checkMaxLength(req.body.name, 60, "nombre"),
    (req) => checkMaxLength(req.body.lastname, 60, "apellido"),
    (req) => checkMaxLength(req.body.username, 20, "usuario"),
  ];

  // Manejar las validaciones
  const error = handleValidation(validations, req);
  if (error) return res.status(422).json({ errors: error });
  try {
    const existingUser = await UserModel.findByUsername(req.body.username);
    if (existingUser)
      return res
        .status(400)
        .json({ errors: [{ msg: "El usuario ya existe" }] });

    const result = await UserController.add(
      req.body.name,
      req.body.lastname,
      req.body.username,
      req.body.email,
      req.body.password.trim(),
      req.body.role,
      req.body.province,
      req.user.id
    );

    if (result) return res.status(200).json({ result: "Usuario registrado" });
    return res
      .status(422)
      .json({ errors: [{ msg: "No se ha podido registrar el usuario." }] });
  } catch (err) {
    return res.status(422).json({ errors: [{ msg: "Ha ocurrido un error" }] });
  }
});

// Manejo de registro
router.post("/edit", async (req, res, _next) => {
  const validations = [
    (req) => checkNotEmpty(req.body.email, "email"),
    (req) => checkMinLength(req.body.password, 6, "contraseña"),
    (req) => checkPasswordsMatch(req.body.password, req.body.password2),
    (req) => checkForBlank(req.body.password, "contraseña"),
    (req) => checkForBlank(req.body.email, "email"),
    (req) => checkForBlank(req.body.username, "nombre de usuario"),
  ];

  // Manejar las validaciones
  const error = handleValidation(validations, req);
  if (error) return res.status(422).json({ errors: error });
  try {
    if (req.user.id != req.body.userId) {
      const result = await UserController.edit(
        req.body.userId,
        req.body.email,
        req.body.password.trim(),
        req.body.role,
        req.body.province,
        req.body.status,
        req.user.id
      );
      if (result) return res.status(200).json({ result: "Usuario editado." });
      return res
        .status(422)
        .json({ errors: [{ msg: "No se ha podido editar el usuario." }] });
    } else {
      return res
        .status(422)
        .json({ errors: [{ msg: "No puedes editar tu propio usuario." }] });
    }
  } catch (err) {
    return res.status(422).json({ errors: [{ msg: "Ha ocurrido un error" }] });
  }
});
export default router;
