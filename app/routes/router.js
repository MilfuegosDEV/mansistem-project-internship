const express = require("express");
const router = express.Router();
const {
  ensureAuthenticated,
  forwardAuthenticated,
} = require("../middlewares/auth");

const userRolesModel = require("../models/userRolModel");
const provincesModel = require("../models/provinceModel");

router.get("/", ensureAuthenticated, (req, res, next) => {
  res.render("index", { title: "Home", active: "home", user: req.user });
});

router.get("/login", forwardAuthenticated, async (req, res, next) => {
  res.render("login", {
    layout: false,
    title: "Login",
    message: req.flash(),
  });
});

router.get("/register", forwardAuthenticated, async (req, res, next) => {
  res.render("register", {
    title: "Register",
    layout: false,
    userRoles: await userRolesModel.getAll(),
    provinces: await provincesModel.getAll(),
    message: req.flash(),
  });
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      // Manejar errores, por ejemplo, redirigir al usuario a una página de error
      return res.redirect("/error");
    }
    // La sesión se ha cerrado con éxito
    req.flash("success", "Sesión cerrada correctamente");
    res.redirect("/login"); // Redirigir al usuario a la página de inicio de sesión
  });
});

module.exports = router;
