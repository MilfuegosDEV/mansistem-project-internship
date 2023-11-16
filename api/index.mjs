import { Router } from "express";
import users from "./users.mjs";
import clients from "./clients.mjs";
const router = Router();

router.use("/", users);
router.use("/", clients);

export default router;
