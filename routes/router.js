const express = require("express");
const router = express.Router();
// Models
const ModelProvince = require("../models/province");
const ModeluserRoles = require("../models/usersRoles");

const provinceModel = new ModelProvince();
const userRolesModel = new ModeluserRoles();

router.get("/", (req, res, next) => {
  res.render("index", { title: "Home", active: "home" });
});

router.get("/register", async (req, res, next) => {
  res.render("register", {
    layout: false,
    title: "Register",
    message: req.flash(),
    provinces: await provinceModel.getAll(),
    userRoles: await userRolesModel.getAll(),
  });
});

router.get("/login", async (req, res, next) => {
  res.render("login", {
    layout: false,
    title: "Login",
    message: req.flash(),
  });
});
module.exports = router;
