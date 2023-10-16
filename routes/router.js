const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("index", { title: "Home", active: "home" });
});

router.get("/register", (req, res, next) => {
  res.render("register", { layout: false, title: "Register" });
});

module.exports = router;
