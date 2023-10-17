// Importaciones necesarias
require("dotenv").config();
const path = require("path");
const express = require("express");
const layout = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const helmet = require("helmet");
const contentSecurityPolicy = require("helmet-csp");
const morgan = require("morgan");
const cookie = require("cookie-parser");

const router = require("./app/routes/router");
const authRouter = require("./app/routes/auth");

const app = express();

// Configuración de Express
const PORT = process.env.PORT || 3000;

// Mejoras de seguridad con Helmet
app.use(helmet());
app.use(
  contentSecurityPolicy({
    useDefaults: true,
    directives: {
      scriptSrc: [
        "'self'",
        "https://use.fontawesome.com",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com",
      ],
      // ... otras directivas ...
    },
  })
);

// Logging de solicitudes HTTP con Morgan
app.use(morgan("combined"));

// Middleware estándar y configuración de sesión
app.use(express.urlencoded({ extended: true }));
app.use(cookie(process.env.COOKIE_SECRET));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET, // clave secreta segura desde variables de entorno
    saveUninitialized: true,
    resave: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // habilitado en producción
      maxAge: 60000,
    },
  })
);

// Configuración de las vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Configuración del layout
app.set("layout", "layouts/layout"); // Busca layouts/layout en lugar de layout.
app.use(layout);

// Rutas
app.use("/", router);
app.use("/", authRouter);

// Carpeta estática
app.use("/static", express.static(path.join(__dirname, "static")));

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("¡Algo salió mal!");
});

// Middleware para manejo de 404 - Página no encontrada
app.use((req, res, next) => {
  res.status(404).send("404 - Página no encontrada");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
