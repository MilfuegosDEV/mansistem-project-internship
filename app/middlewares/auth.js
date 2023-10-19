const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("errors", "Debes iniciar sesion antes de ver este recurso.");
  res.redirect("/login");
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
