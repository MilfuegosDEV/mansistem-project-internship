import { ensureAuthenticated } from "../middlewares/auth.mjs";
import { Router } from "express";
import ClientModel from "../models/ClientModel.mjs";
import UserModel from "../models/UserModel.mjs";
import { ticket_areas } from "../models/utils/index.mjs";
const router = Router();

// views
// Tickets page

router.get("/", ensureAuthenticated, async (req, res, _next) => {
  if ([1, 2].includes(req.user.role_id)) {
    res.render("tickets", {
      title: "Casos",
      active: "tickets",
      user: req.user,
      clients: await ClientModel.getEnabled(),
      users: await UserModel.getEnabled(),
      ticket_areas: await ticket_areas(),
    });
  }
});

export default router;
