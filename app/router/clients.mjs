import ClientModel from "../models/ClientModel.mjs";
import ClientController from "../controllers/ClientController.mjs";
import { Router } from "express";
import {
  checkForBlank,
  checkMaxLength,
  checkMinLength,
  checkNotEmpty,
  checkPhoneNumber,
  handleValidation,
} from "../middlewares/validation.mjs";
import { provinces, status } from "../models/utils/index.mjs";
import { ensureAuthenticated, justForAdmins } from "../middlewares/auth.mjs";

const router = Router();

// Views

router.get(
  "/",
  justForAdmins,
  ensureAuthenticated,
  async (req, res, _next) => {
    res.render("clients", {
      title: "Clientes",
      active: "clients",
      user: req.user,
      status: await status(),
      provinces: await provinces(),
    });
    return;
  }
);

// Handlers

router.post("/add", async (req, res, _next) => {
  const validations = [
    (req) => checkNotEmpty(req.body.name, "nombre"),
    (req) => checkNotEmpty(req.body.phone, "teléfono"),
    (req) => checkNotEmpty(req.body.email, "correo"),
    (req) => checkNotEmpty(req.body.address, "dirección"),
    (req) => checkMaxLength(req.body.name, 20, "nombre"),
    (req) => checkMinLength(req.body.phone, 8, "teléfono"),
    (req) => checkMaxLength(req.body.phone, 8, "teléfono"),
    (req) => checkMaxLength(req.body.address, 255, "dirección"),
    (req) => checkForBlank(req.body.email, "correo"),
    (req) => checkForBlank(req.body.phone, "teléfono"),
    (req) => checkPhoneNumber(req.body.phone, "teléfono"),
  ];

  const error = handleValidation(validations, req);
  if (error) return res.status(422).json({ errors: error });
  try {
    // Validaciones extra.
    const foundClientByName = await ClientModel.findByName(req.body.name);
    const foundClientByEmail = await ClientModel.findByEmail(req.body.email);
    const foundClientByPhone = await ClientModel.findByPhoneNumber(
      req.body.phone
    );
    if (foundClientByName)
      return res
        .status(400)
        .json({ errors: [{ msg: "El cliente ya existe." }] });
    if (foundClientByEmail)
      return res.status(400).json({
        errors: [
          {
            msg: `Este email esta en uso por el cliente: ${foundClientByEmail.name}`,
          },
        ],
      });
    if (foundClientByPhone)
      return res.status(400).json({
        errors: [
          {
            msg: `Este número de teléfono está en uso por el cliente: ${foundClientByPhone.name}`,
          },
        ],
      });
    const result = await ClientController.add(
      req.body.name.toUpperCase().trim(),
      req.body.address.toUpperCase().trim(),
      req.body.phone.trim(),
      req.body.email.toLowerCase().trim(),
      parseInt(req.body.province),
      parseInt(req.user.id)
    );

    if (result)
      return res.status(200).json({ result: "Cliente registrado exito." });
    return res
      .status(422)
      .json({ errors: [{ msg: "No se ha podido registrar el cliente" }] });
  } catch (err) {
    return res.status(500).json({
      errors: [{ msg: `Ha ocurrido un error interno del servidor: ${err}` }],
    });
  }
});

router.post("/edit", async (req, res, _next) => {
  const validations = [
    (req) => checkNotEmpty(req.body.name, "nombre"),
    (req) => checkNotEmpty(req.body.phone, "teléfono"),
    (req) => checkNotEmpty(req.body.email, "correo"),
    (req) => checkNotEmpty(req.body.address, "dirección"),
    (req) => checkMaxLength(req.body.name, 20, "nombre"),
    (req) => checkMinLength(req.body.phone, 8, "teléfono"),
    (req) => checkMaxLength(req.body.phone, 8, "teléfono"),
    (req) => checkMaxLength(req.body.address, 255, "dirección"),
    (req) => checkForBlank(req.body.email, "correo"),
    (req) => checkForBlank(req.body.phone, "teléfono"),
    (req) => checkPhoneNumber(req.body.phone, "teléfono"),
  ];

  const error = handleValidation(validations, req);
  if (error) return res.status(422).json({ errors: error });
  try {
    // Validaciones extra.
    const foundClientByName = await ClientModel.findByName(req.body.name);
    const foundClientByEmail = await ClientModel.findByEmail(req.body.email);
    const foundClientByPhone = await ClientModel.findByPhoneNumber(
      req.body.phone
    );
    if (foundClientByName.id !== parseInt(req.body.id))
      return res
        .status(400)
        .json({ errors: [{ msg: "El nombre del cliente ya está en uso." }] });
    if (foundClientByEmail.id !== parseInt(req.body.id))
      return res.status(400).json({
        errors: [
          {
            msg: `Este email esta en uso por el cliente: ${foundClientByEmail.name}`,
          },
        ],
      });
    if (foundClientByPhone.id !== parseInt(req.body.id))
      return res.status(400).json({
        errors: [
          {
            msg: `Este número de teléfono está en uso por el cliente: ${foundClientByPhone.name}`,
          },
        ],
      });
    const result = await ClientController.edit(
      parseInt(req.body.id),
      req.body.name.toUpperCase().trim(),
      req.body.address.toUpperCase().trim(),
      req.body.phone.trim(),
      req.body.email.toLowerCase().trim(),
      parseInt(req.body.province),
      parseInt(req.body.status),
      parseInt(req.user.id)
    );
    if (result)
      return res.status(200).json({ result: "Cliente editado exito." });
    return res
      .status(422)
      .json({ errors: [{ msg: "No se ha podido editar el cliente" }] });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      errors: [{ msg: `Ha ocurrido un error interno del servidor: ${err}` }],
    });
  }
});

export default router;
