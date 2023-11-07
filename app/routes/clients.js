const clientModel = require("../models/clientModel");
const clientController = require("../controllers/clientController");

const { Router } = require("express");
const router = Router();

const {
  handleValidation,
  checkNotEmpty,
  checkMaxLength,
  checkForBlank,
  checkMinLength,
  checkPhoneNumber,
} = require("../middlewares/validation"); // Middleware de validaciones.

router.post("/addClient", async (req, res, next) => {
  const foundUserByName = await clientModel.findByName(req.body.name);
  if (foundUserByName.length > 0) {
    res.status(400).json({
      error: `Este cliente ya esta registrado.`,
    });
    return; // Termina la ejecución si el usuario ya existe
  }
  const foundUserByEmail = await clientModel.findByEmail(req.body.email);
  if (foundUserByEmail.length > 0) {
    res.status(400).json({
      error: `El correo está en uso por el cliente: ${foundUserByEmail[0].name}`,
    });
    return; // Termina la ejecución si el usuario ya existe
  }

  const foundUserByPhoneNumber = await clientModel.findByPhoneNumber(
    req.body.phone
  );
  if (foundUserByPhoneNumber.length > 0) {
    res.status(400).json({
      error: `El número de teléfono está en uso por el cliente: ${foundUserByPhoneNumber[0].name}`,
    });
    return;
  }

  const validations = [
    (req) => checkNotEmpty(req.body.name, "nombre"),
    (req) => checkNotEmpty(req.body.email, "correo"),
    (req) => checkNotEmpty(req.body.phone, "télefono"),
    (req) => checkNotEmpty(req.body.address, "dirección"),
    (req) => checkForBlank(req.body.email, "correo"),
    (req) => checkMaxLength(req.body.name, 60, "nombre"),
    (req) => checkPhoneNumber(req.body.phone, "télefono"),
    (req) => checkMinLength(req.body.phone, 8, "télefono"),
    (req) => checkMaxLength(req.body.phone, 8, "télefono"),
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
  const foundUserByName = await clientModel.findByName(req.body.name);
  if (foundUserByName.length > 0) {
    if (foundUserByName[0].id != req.body.clientId) {
      res.status(400).json({
        error: `El nombre del cliente ${req.body.name} ya está uso.`,
      });
      return;
    }
  }
  const foundUserByEmail = await clientModel.findByEmail(req.body.email);
  if (foundUserByEmail.length > 0) {
    if (foundUserByEmail[0].id != req.body.clientId) {
      res.status(400).json({
        error: `El correo está en uso por el cliente: ${foundUserByEmail[0].name}`,
      });
      return;
    }
  }

  const foundUserByPhoneNumber = await clientModel.findByPhoneNumber(
    req.body.phone
  );
  if (foundUserByPhoneNumber.length > 0) {
    if (foundUserByPhoneNumber[0].id != req.body.clientId) {
      res.status(400).json({
        error: `El número de teléfono está en uso por el cliente: ${foundUserByPhoneNumber[0].name}`,
      });
      return;
    }
  }

  const validations = [
    (req) => checkNotEmpty(req.body.name, "nombre"),
    (req) => checkNotEmpty(req.body.email, "correo"),
    (req) => checkNotEmpty(req.body.phone, "télefono"),
    (req) => checkNotEmpty(req.body.address, "dirección"),
    (req) => checkForBlank(req.body.email, "correo"),
    (req) => checkMaxLength(req.body.name, 60, "nombre"),
    (req) => checkPhoneNumber(req.body.phone, "télefono"),
    (req) => checkMinLength(req.body.phone, 8, "télefono"),
    (req) => checkMaxLength(req.body.phone, 8, "télefono"),
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
