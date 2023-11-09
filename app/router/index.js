const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middlewares/auth");

// handlers
const clientsHandler = require("./clientsHandler");
const usersHandler = require("./usersHandler");
const auth = require("./auth");

const userModel = require("../models/userModel");
const userRolesModel = require("../models/userRolModel");
const provincesModel = require("../models/provinceModel");
const statusModel = require("../models/statusModel");

router.get("/", ensureAuthenticated, async (req, res, _next) => {
  res.render("index", {
    title: "INICIO",
    active: "home",
    user: req.user,
  });
});

router.get("/users", ensureAuthenticated, async (req, res, next) => {
  if (req.user.role_id === 1) {
    res.render("users", {
      title: "USUARIOS",
      active: "users",
      user: req.user,
      userRoles: await userRolesModel.getAll(),
      status: await statusModel.getAll(),
      provinces: await provincesModel.getAll(),
    });
    return;
  }
  next(401)
});

// Para para procesar formulariso respecto a los usuarios
router.use("/", usersHandler);

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

// Para procesar formularios respecto a los clientes.
router.use("/", clientsHandler);

router.get("/tickets", ensureAuthenticated, async (req, res, _next) => {
  res.render("tickets", {
    title: "CASOS",
    active: "tickets",
    user: req.user,
    enabledUsers: await userModel.getEnabledUsers(),
  });
});

/**
 * Para procesar la autenticación del usuario
 * esto incluye el login y el logout
 */
router.use("/", auth);

module.exports = router;
