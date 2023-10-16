const express = require("express");
const router = express.Router();
const PROVINCE_MODEL = require("../models/PROVINCE");

const PROVINCE = new PROVINCE_MODEL();

router.get("/", (req, res, next) => {
  res.render("index", { title: "Home", active: "home" });
});

router.get("/register", async (req, res, next) => {
  res.render("register", {
    layout: false,
    title: "Register",
    message: req.flash(),
    provinces: await PROVINCE.getAll(),
  });
});

router.get("/login", async (req, res, next) => {
  res.render("login", {
    layout: false,
    title: "Login",
    message: req.flash,
  });
});
module.exports = router;
