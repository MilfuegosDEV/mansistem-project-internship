import { Router } from "express";
import users from "./users.mjs";
import clients from "./clients.mjs";
import deviceClasses from "./deviceClasses.mjs";
import deviceSuppliers from "./deviceSupplier.mjs";
const router = Router();

router.use("/", users);
router.use("/", clients);

router.use("/devices", deviceClasses);
router.use("/devices", deviceSuppliers);
export default router;
