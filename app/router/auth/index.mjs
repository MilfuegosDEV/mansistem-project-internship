import { flashMessages } from "../../middlewares/flash-messages.mjs";
import {
  checkNotEmpty,
  checkForBlank,
  handleValidation,
} from "../../middlewares/validation.mjs";

import {
  forwardAuthenticated,
  ensureAuthenticated,
} from "../../middlewares/auth.mjs";

import passport from "passport";
import { Router } from "express";

const router = Router();

//Login
// Route for handling the POST request to /login

router.post("/login", async function (req, res, next) {
  const validations = [
    (req) => checkNotEmpty(req.body.username, "nombre de usuario"),
    (req) => checkNotEmpty(req.body.password, "contraseña"),
    (req) => checkForBlank(req.body.username, "nombre de usuario"),
    (req) => checkForBlank(req.body.password, "contraseña"),
  ];

  const error = handleValidation(validations, req);
  if (error) return res.status(422).json({ errors: error });

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ errors: [info] });
    } else {
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.status(200).json({ redirectUrl: "/" });
      });
    }
  })(req, res, next);
});

router.get("/login", forwardAuthenticated, function (_req, res, _next) {
  return res.render("login", {
    layout: false,
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

export default router;
