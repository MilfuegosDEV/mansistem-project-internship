import { flashMessages } from "./flash-messages.mjs";

export const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  flashMessages.addMessage("errors", "Debes iniciar sesion para continuar.");
  res.status(401).redirect("/login");
};

export const forwardAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
};

export const isUserAdmin = (req, _res, next) => {
  if (req.user.role_id === 1) {
    return next();
  }
  return next(401);
};
