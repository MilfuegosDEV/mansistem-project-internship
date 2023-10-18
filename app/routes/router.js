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
  req.logout(function (err) {
    req.flash("success", "Sesion cerrada correctamente");
    if (err) {
      console.error(err);
    }
    res.redirect("/login"); // Redirect the user to the login page (or any other page as needed)
  });
});

module.exports = router;
