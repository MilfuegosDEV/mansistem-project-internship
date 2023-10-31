const flashMessages = require("../utils/flash-messages");

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  flashMessages.addMessage("errors", "Debes iniciar sesion antes de ver este recurso.");
  res.status(401).redirect("/login");
};

const forwardAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
};

module.exports = {
  forwardAuthenticated,
  ensureAuthenticated,
};
