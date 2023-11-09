const { Router } = require("express");
const router = Router();
const clients = require("./clients");
const users = require("./users");

router.use("/", users);
router.use("/", clients);

module.exports = router;
