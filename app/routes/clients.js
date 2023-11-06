const userModel = require("../models/userModel");
const clientController = require("../controllers/clientController");

const { Router } = require("express");
const router = Router();

const {
  handleValidation,
  checkNotEmpty,
  checkMaxLength,
  checkForBlank,
} = require("../middlewares/validation"); // Middleware de validaciones.

router.post("/addClient", async (req, res, next) => {
  const validations = [
    (req) => checkNotEmpty(req.body.name, "nombre"),
    (req) => checkNotEmpty(req.body.email, "correo"),
    (req) => checkNotEmpty(req.body.phone, "télefono"),
    (req) => checkNotEmpty(req.body.address, "dirección"),
    (req) => checkForBlank(req.body.email, "correo"),
    (req) => checkMaxLength(req.body.name, 60, "nombre"),
    (req) => checkMaxLength(req.body.phone, 70, "télefono"),
    (req) => checkMaxLength(req.body.email, 100, "correo"),
  ];

  // Manejar las validaciones
  const errors = handleValidation(validations, req, res);

  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  try {
    await clientController.addClient(
      req.body.name,
      req.body.address,
      req.body.phone,
      req.body.email,
      req.body.province
    );
    res.status(200).json({ success: "Cliente registrado." });
    return;
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/editClient", async (req, res, next) => {
  const validations = [
    (req) => checkNotEmpty(req.body.name, "nombre"),
    (req) => checkNotEmpty(req.body.email, "correo"),
    (req) => checkNotEmpty(req.body.phone, "télefono"),
    (req) => checkNotEmpty(req.body.address, "dirección"),
    (req) => checkForBlank(req.body.email, "correo"),
    (req) => checkMaxLength(req.body.name, 60, "nombre"),
    (req) => checkMaxLength(req.body.phone, 70, "télefono"),
    (req) => checkMaxLength(req.body.email, 100, "correo"),
  ];

  // Manejar las validaciones
  const errors = handleValidation(validations, req, res);

  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  try {
    await clientController.editClient(
      req.body.clientId,
      req.body.name,
      req.body.address,
      req.body.phone,
      req.body.email,
      req.body.province,
      req.body.status
    );
    res.status(200).json({ success: "Cliente editado." });
    return;
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
