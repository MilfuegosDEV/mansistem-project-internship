import { Router } from "express";
import users from "./users.mjs";
import clients from "./clients.mjs";
import devices from "./devices.mjs";
const router = Router();

router.use("/", users);
router.use("/", clients);

router.use("/devices", devices);
export default router;
