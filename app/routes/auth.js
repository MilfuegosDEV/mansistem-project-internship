const registerController = require("../controllers/register");
const express = require("express");
const router = express.Router();

const passport = require("passport");

const userModel = require("../models/userModel");
const userRolesModel = require("../models/userRolModel");
const provincesModel = require("../models/provinceModel");

const {
  handleValidation,
  checkNotEmpty,
  checkMinLength,
  checkPasswordsMatch,
  checkMaxLength,
} = require("../middlewares/validation"); // Middleware de validaciones.

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
      (req) => checkMaxLength(req.body.name, 60, "nombre"),
      (req) => checkMaxLength(req.body.lastname, 60, "apellido"),
      (req) => checkMaxLength(req.body.username, 20, "usuario"),
    ];

    // Manejar las validaciones
    handleValidation(validations, req, res, next, "/register");
  },
  async (req, res) => {
    /**
     * Verifica que el usuario no exista, en el caso de verdadero indica el error y el estado 400.
     * De lo contrario registra el usuario a la base de datos.
     */
    if ((await userModel.findOne(req.body.username)).length > 0) {
      req.flash("errors", "El usuario ya existe.");
      res.status(400).render("register", {
        title: "Register",
        layout: false,
        userRoles: await userRolesModel.getAll(),
        provinces: await provincesModel.getAll(),
        message: req.flash(),
      });
    } else {
      await registerController.addUser(
        req.body.name,
        req.body.lastname,
        req.body.username,
        req.body.email,
        req.body.password,
        req.body.role,
        req.body.province
      );

      req.flash("success", "Usuario registrado.");
      res.render("register", {
        title: "Register",
        layout: false,
        userRoles: await userRolesModel.getAll(),
        provinces: await provincesModel.getAll(),
        message: req.flash(),
      });
    }
  }
);

//Login
// Route for handling the POST request to /login
router.post(
  "/login",
  (req, res, next) => {
    const validations = [
      (req) => checkNotEmpty(req.body.username, "Nombre de usuario"),
      (req) => checkNotEmpty(req.body.password, "Contraseña"),
    ];

    handleValidation(validations, req, res, next, "/login");
  },
  (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        // Manejar errores de autenticación
        return next(err);
      }
      if (!user) {
        // Redirigir al usuario de nuevo a la página de inicio de sesión con el mensaje de error
        req.flash("errors", info);
        return res.status(400).redirect("/login");
      } else {
        // La autenticación fue exitosa, el usuario está en req.user
        req.login(user, (err) => {
          if (err) {
            // Manejar errores de inicio de sesión
            return next(err);
          }
          return res.redirect("/");
        });
      }
    })(req, res, next);
  }
);

module.exports = router;