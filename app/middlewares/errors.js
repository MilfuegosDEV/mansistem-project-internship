const path = require("path");
const views = path.join(__dirname, "..", "..", "views");

function errors(err, _req, res, _next) {
  if (err === 401) {
    res.status(401).sendFile(path.join(views, "errors/401.html"));
    return;
  }
  // Manejo de otros errores...
  console.error(err.stack);
  res.status(500).sendFile(path.join(views, "errors/500.html"));
  return;
}

// Middleware para manejo de 404 - Página no encontrada
function pageNotFound(_req, res, _next) {
  res.status(404).sendFile(path.join(views, "errors/404.html"));
  return;
}

module.exports = {
  errors,
  pageNotFound,
};
