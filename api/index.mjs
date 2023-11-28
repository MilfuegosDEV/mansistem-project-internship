import { Router } from "express";
import users from "./users.mjs";
import clients from "./clients.mjs";
import devices from "./devices.mjs";
import tickets from "./tickets.mjs";
const router = Router();

router.use("/", users);
router.use("/", clients);

router.use("/devices", devices);
router.use("/tickets", tickets);
export default router;
