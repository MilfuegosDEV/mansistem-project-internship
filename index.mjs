import "dotenv/config";
import db from "./db/index.mjs";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";

import { randomBytes } from "crypto";
import helmet from "helmet";
import contentSecurityPolicy from "helmet-csp";
import morgan from "morgan";
import rfs from "rotating-file-stream";

import express from "express";
import session from "express-session";
import layout from "express-ejs-layouts";
import cookieParser from "cookie-parser";
const require = createRequire(import.meta.url);
import passport from "passport";
import passport_config from "./config/passport-config.mjs";
const MySQLStore = require("express-mysql-session")(session);
import socket_config from "./config/socket-config.mjs";

import http from "http";
import { router } from "./app/router/index.mjs";
import api from "./api/index.mjs";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Seguridad.
/**
 * Permite insertar scripts dentro de la página debido a la politica de seguridad
 * configurada con helmet. Si se requiere insertar un script, se debe hacer de la siguiente manera:
 * <script nonce="<%= cspNonce%>
 *  Tú código acá...
 * </script>"
 */
app.use((_req, res, next) => {
  res.locals.cspNonce = randomBytes(16).toString("hex");
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
        "https://code.jquery.com",
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
  path: path.join(__dirname, ".log"), // directorio para los logs
});

// Configuración de morgan para usar rotating-file-stream
app.use(morgan("combined", { stream: accessLogStream }));

// Sessiones
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET));
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
passport_config(passport);
app.use(passport.initialize());
app.use(passport.session());

// Utlizando ejs como motor de vistas
app.set("view engine", "ejs");
app.set("views", "app/views");
app.use("/views", express.static(path.join(__dirname, "views")));

// para permitir usar un master page.
app.set("layout", "layouts/layout");
app.use(layout);

// Configuración de los archivos estáticos.
app.use("/public", express.static(path.join(__dirname, "public")));

//routes
app.use("/", router);

// API
app.use("/api", api);

// Páginas de errores
app.use((err, _req, res, _next) => {
  if (err === 401) {
    res
      .status(401)
      .sendFile(path.join(__dirname, "public", "pages", "401.html"));
    return;
  }
  console.log(err.stack);
  res.status(500).sendFile(path.join(__dirname, "public", "pages", "500.html"));
  return;
});

app.use((_req, res, _next) => {
  res.status(404).sendFile(path.join(__dirname, "public", "pages", "404.html"));
  return;
});

// Configuración de sockets
const server = http.createServer(app);
const io = socket_config(server);

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

server.listen(PORT, function () {
  console.log("Running into http://localhost:3000");
});
