const AuthController = require("../controllers/register");
const registerController = new AuthController();
const express = require("express");
const router = express.Router();



const passport = require("passport");

const userRolesModel = require("../models/userRolModel");
const provincesModel = require("../models/provinceModel");

const userRoles = new userRolesModel();
const provinces = new provincesModel();

const {
  handleValidation,
  checkNotEmpty,
  checkMinLength,
  checkPasswordsMatch,
  checkMaxLength,
} = require("../middlewares/validationRegister"); // Middleware de validaciones.

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
    handleValidation(validations, req, res, next);
  },
  async (req, res) => {
    /**
     * Verifica que el usuario no exista, en el caso de verdadero indica el error y el estado 400.
     * De lo contrario registra el usuario a la base de datos.
     */
    if ((await registerController.doesUserExist(req.body.username)) === true) {
      req.flash("errors", "El usuario ya existe.");
      res.status(400).render("register", {
        title: "Register",
        layout: false,
        userRoles: await userRoles.getAll(),
        provinces: await provinces.getAll(),
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
        userRoles: await userRoles.getAll(),
        provinces: await provinces.getAll(),
        message: req.flash(),
      });
    }
  }
);

//Login

// Route for handling the POST request to /login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

module.exports = router;
