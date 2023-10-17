const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", (req, res, next) => {
  res.render("index", { title: "Home", active: "home" });
});

router.get("/register", userController.getRegister);

router.get("/login", async (req, res, next) => {
  res.render("login", {
    layout: false,
    title: "Login",
    message: req.flash(),
  });
});
module.exports = router;
