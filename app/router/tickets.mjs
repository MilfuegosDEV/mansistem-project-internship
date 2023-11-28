import { ensureAuthenticated } from "../middlewares/auth.mjs";
import { Router } from "express";
const router = Router();

// views
// Tickets page

router.get("/", ensureAuthenticated, (req, res, _next) => {
  if ([1, 2].includes(req.user.role_id)) {
    res.render("tickets", {
      title: "Casos",
      active: "tickets",
      user: req.user,
    });
  }
});

export default router;
