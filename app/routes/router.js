const express = require("express");
const router = express.Router();
const {
  ensureAuthenticated,
  forwardAuthenticated,
} = require("../middlewares/auth");

const userRolesModel = require("../models/userRolModel");
const provincesModel = require("../models/provinceModel");
const statusModel = require("../models/statusModel");
const flashMessages = require("../utils/flash-messages");

router.get("/", ensureAuthenticated, async (req, res, _next) => {
  res.render("index", {
    title: "INICIO",
    active: "home",
    user: req.user,
    userRoles: await userRolesModel.getAll(),
    status: await statusModel.getAll(),
    provinces: await provincesModel.getAll(),
  });
});

// ADMISTRAR LOS CLIENTES
router.get("/clients", ensureAuthenticated, async (req, res, _next) => {
  res.render("clients", {
    title: "CLIENTES",
    active: "clients",
    user: req.user,
    status: await statusModel.getAll(),
    provinces: await provincesModel.getAll(),
  });
});

router.get("/login", forwardAuthenticated, async (_req, res, _next) => {
  res.render("login", {
    layout: false,
    title: "INICIAR SESION",
    message: flashMessages.getMessages(),
  });
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      // Manejar errores, por ejemplo, redirigir al usuario a una página de error
      next(err);
    }
    // La sesión se ha cerrado con éxito
    flashMessages.addMessage("success", "Sesión cerrada correctamente");
    res.redirect("/login"); // Redirigir al usuario a la página de inicio de sesión
  });
});

module.exports = router;
