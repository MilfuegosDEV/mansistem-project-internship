// Importaciones necesarias
require("dotenv").config();
const path = require("path");
const express = require("express");
const layout = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const initialize = require("./app/controllers/passport-config");
const crypto = require("crypto");
const helmet = require("helmet");
const contentSecurityPolicy = require("helmet-csp");
const morgan = require("morgan");
const rfs = require("rotating-file-stream");
const cookie = require("cookie-parser");

const router = require("./app/routes/router");
const authRouter = require("./app/routes/auth");
const api = require("./app/api/router");

const app = express();

// Passport config

// Configuración de Express
const PORT = process.env.PORT || 3000;
// create a nonce
app.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString("hex");
  next();
});

// Mejoras de seguridad con Helmet
app.use(helmet({ permissionsPolicy: false }));
app.use(
  contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: [
        "'self'",
        "https://cdn.datatables.net",
        "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
      ],
      scriptSrc: [
        "'self'",
        "https://use.fontawesome.com",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com",
        "https://cdn.datatables.net",
        (req, res) => `'nonce-${res.locals.cspNonce}'`,
      ],
      // ... otras directivas ...
    },
  })
);

// Logging de solicitudes HTTP con Morgan

// Configuración para rotating-file-stream
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotar diariamente
  path: path.join(__dirname, "log"), // directorio para los logs
});

// Configuración de morgan para usar rotating-file-stream
app.use(morgan("combined", { stream: accessLogStream }));
// Middleware estándar y configuración de sesión
app.use(express.urlencoded({ extended: true }));
app.use(cookie(process.env.COOKIE_SECRET));

app.use(flash());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET, // clave secreta segura desde variables de entorno
    saveUninitialized: true,
    resave: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // habilitado en producción
      maxAge: 1 * 3_600_000, // cantidad de horas * lo equivalente a una hora en milisegundos.
    },
  })
);

initialize(passport);
app.use(passport.initialize());
app.use(passport.session());

// Configuración de las vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Configuración del layout
app.set("layout", "layouts/layout"); // Busca layouts/layout en lugar de layout.
app.use(layout);

// Rutas
app.use("/", router);
app.use("/", authRouter);

// API
app.use("/api", api);

// Carpeta estática
app.use("/static", express.static(path.join(__dirname, "static")));

// Middleware para manejo de errores
app.use((err, req, res, _next) => {
  if (err.status === 401) {
    return res
      .status(401)
      .render("errors/401", { title: "Acceso No Autorizado", layout: false });
  }
  // Manejo de otros errores...
  console.error(err.stack);
  res.status(500).render("errors/500", {
    title: "Error Interno Del Servidor",
    layout: false,
  });
});

// Middleware para manejo de 404 - Página no encontrada
app.use((req, res, next) => {
  res
    .status(404)
    .render("errors/404", { title: "Página No Encontrada", layout: false });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
