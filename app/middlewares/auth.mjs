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

export const justForAdmins = (req, _res, next) => {
  if ([1,2].includes(req.user.role_id)) {
    return next();
  }
  return next(401);
};
