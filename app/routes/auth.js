const express = require("express");
const router = express.Router();

const {
  checkForBlank,
  checkNotEmpty,
  handleValidation,
} = require("../middlewares/validation");

const passport = require("passport");

//Login
// Route for handling the POST request to /login
router.post("/login", async (req, res, next) => {
  const validations = [
    (req) => checkNotEmpty(req.body.username, "nombre de usuario"),
    (req) => checkNotEmpty(req.body.password, "contraseña"),
    (req) => checkForBlank(req.body.password, "contraseña"),
  ];

  // Manejar las validaciones
  const errors = handleValidation(validations, req, res);

  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      // Manejar errores de autenticación
      return next(err);
    }
    if (!user) {
      // Redirigir al usuario de nuevo a la página de inicio de sesión con el mensaje de error
      return res.status(400).json({ success: false, error: info });
    } else {
      // La autenticación fue exitosa, el usuario está en req.user
      req.login(user, (err) => {
        if (err) {
          // Manejar errores de inicio de sesión
          return next(err);
        }
        res.status(200).json({ success: true, redirectUrl: "/" });
      });
    }
  })(req, res, next);
});

module.exports = router;
