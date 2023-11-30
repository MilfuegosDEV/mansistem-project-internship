import { ensureAuthenticated } from "../middlewares/auth.mjs";

import auth from "./auth/index.mjs";
import users from "./users.mjs";
import clients from "./clients.mjs";
import devices from "./devices.mjs";
import tickets from "./tickets.mjs";
import { Router } from "express";
const router = Router();

router.get("/", ensureAuthenticated, async (req, res, _next) => {
  res.render("index", {
    title: "Inicio",
    active: "home",
    user: req.user,
  });
});

router.use("/", auth);
router.use("/users", users);
router.use("/clients", clients);
router.use("/devices", devices);
router.use("/tickets", tickets);
export { router };
