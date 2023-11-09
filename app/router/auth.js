/**
 * Este módulo contiene funciones que permiten el acceso al sitio.
 */

const flashMessages = require("../middlewares/flash-messages");
const { Router } = require("express");

const {
  forwardAuthenticated,
  ensureAuthenticated,
} = require("../middlewares/auth");

const router = Router();

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

router.get("/login", forwardAuthenticated, async (_req, res, _next) => {
  res.render("login", {
    layout: false,
    title: "INICIAR SESION",
    message: flashMessages.getMessages(),
  });
});

router.get("/logout", ensureAuthenticated, (req, res) => {
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
