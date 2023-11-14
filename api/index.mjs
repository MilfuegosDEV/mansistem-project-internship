import { Router } from "express";
import users from "./users.mjs";
const router = Router();

router.use("/", users);

export default router;
