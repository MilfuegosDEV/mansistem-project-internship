// Importaciones necesarias
require("dotenv").config();
const db = require("./config/db-config");
const path = require("path");
const { createServer } = require("http");

const express = require("express");
const layout = require("express-ejs-layouts");

const cookie = require("cookie-parser");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const socketConfig = require("./config/socket-config");

const passport = require("passport");
const initialize = require("./app/controllers/passport-config");

const crypto = require("crypto");
const helmet = require("helmet");
const contentSecurityPolicy = require("helmet-csp");
const morgan = require("morgan");
const rfs = require("rotating-file-stream");

const router = require("./app/routes/router");
const authRouter = require("./app/routes/auth");
const usersRouter = require("./app/routes/users");
const clientsRouter = require("./app/routes/clients");
const api = require("./app/api/endpoints");

const { errors, pageNotFound } = require("./app/middlewares/errors");

const app = express();

// Configuración de Express
const PORT = process.env.PORT || 3000;

/**
 * Permite insertar scripts dentro de la página debido a la politica de seguridad
 * configurada con helmet. Si se requiere insertar un script, se debe hacer de la siguiente manera:
 * <script nonce="<%= cspNonce%>
 *  Tú código acá...
 * </script>"
 */
app.use((_req, res, next) => {
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
        (_req, res) => `'nonce-${res.locals.cspNonce}'`,
      ],
      // ... otras directivas ...
    },
  })
);

/**
 * Este bloque de codigo permite guardar los logs de la página dentro de un archivo.
 * para una posible auditoría del sistema. Este archivo se genera cada día. Además,
 * es recomendable revisar este archivo en el caso de que el servidor fallé para ver que
 * es lo que lo hace fallar.
 */

const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotar diariamente
  path: path.join(__dirname, "log"), // directorio para los logs
});
// Configuración de morgan para usar rotating-file-stream
app.use(morgan("combined", { stream: accessLogStream }));

app.use(express.urlencoded({ extended: true }));
app.use(cookie(process.env.COOKIE_SECRET));
app.use(express.json());

// Crea una tabla dentro de la base de datos que guarde las sesiones.
const sessionStore = new MySQLStore({}, db);
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET, // clave secreta segura desde variables de entorno
  saveUninitialized: true,
  resave: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // habilitado en producción
    maxAge: 1 * 3_600_000, // cantidad de horas * lo equivalente a una hora en milisegundos.
  },
  store: sessionStore,
});

app.use(sessionMiddleware);

// Para el login.
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
app.use("/", usersRouter);
app.use("/", clientsRouter);

// API
app.use("/api", api);

// Carpeta estática
app.use("/static", express.static(path.join(__dirname, "static")));

// Middleware para manejo de errores
app.use(errors); // manejo de errores del tipo 500 y 401
app.use(pageNotFound); // manejo de errores 404

// Socket config.
const server = createServer(app);

const io = socketConfig(server);
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
