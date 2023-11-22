import { ensureAuthenticated, justForAdmins } from "../middlewares/auth.mjs";
import { status, provinces, roles } from "../models/utils/index.mjs";
import auth from "./auth/index.mjs";
import userHandlers from "./users.mjs";
import clientHandlers from "./clients.mjs";
import { Router } from "express";

const router = Router();

router.get("/", ensureAuthenticated, async (req, res, _next) => {
  res.render("index", {
    title: "Inicio",
    active: "home",
    user: req.user,
  });
});

router.get(
  "/users",
  ensureAuthenticated,
  justForAdmins,
  async (req, res, _next) => {
    res.render("users", {
      title: "Usuarios",
      active: "users",
      user: req.user,
      userRoles: await roles(),
      status: await status(),
      provinces: await provinces(),
    });
    return;
  }
);

router.get(
  "/clients",
  justForAdmins,
  ensureAuthenticated,
  async (req, res, _next) => {
    res.render("clients", {
      title: "Clientes",
      active: "clients",
      user: req.user,
      status: await status(),
      provinces: await provinces(),
    });
    return;
  }
);

router.get("/devices/classes", ensureAuthenticated, justForAdmins, async (req, res, next) => {
  res.render("deviceClasses", {
    title: "Dispositivos",
    active: "deviceClasses",
    user: req.user,
    status: await status()
  });
  return;
});

router.use("/", auth);
router.use("/users", userHandlers);
router.use("/clients", clientHandlers);
export { router };
