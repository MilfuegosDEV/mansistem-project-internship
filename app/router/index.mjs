import { ensureAuthenticated } from "../middlewares/auth.mjs";
import auth from "./auth/index.mjs";
import { Router } from "express";

const router = Router();

router.get("/", ensureAuthenticated, async (req, res, _next) => {
  res.render("index", {
    title: "Inicio",
    active: "home",
    user: req.user,
  });
});

router.get("/users", ensureAuthenticated, async (req, res, _next) => {
  res.render("users", {
    title: "Usuarios",
    active: "users",
    user: req.user,
    userRoles: await userRoles.getAll(),
    status: await statusModel.getAll(),
    province: await province.getAll(),
  });
  return;
});

router.use("/", auth);

export { router };
