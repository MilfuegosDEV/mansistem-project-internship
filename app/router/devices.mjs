import {
  checkNotEmpty,
  checkMaxLength,
  checkForBlank,
  handleValidation,
} from "../middlewares/validation.mjs";

import e, { Router } from "express";
import DeviceClassModel from "../models/DeviceClassModel.mjs";
import DeviceClassController from "../controllers/DeviceClassController.mjs";

const router = Router();

router.post("/classes/add", async (req, res, next) => {
  const validations = [
    (req) => checkNotEmpty(req.body.name, "nombre"),
    (req) => checkMaxLength(req.body.name, 20, "nombre"),
    (req) => checkForBlank(req.body.name, "nombre"),
  ];
  const err = handleValidation(validations, req);
  if (err) return res.status(422).json({ errors: err });

  try {
    const foundDevice = await DeviceClassModel.findByName(req.body.name);
    if (foundDevice)
      return res.status(422).json({
        errors: [{ msg: "Esta clase de dispositivo ya fue registrado" }],
      });
    const result = await DeviceClassController.add(
      req.body.name.toUpperCase().trim(),
      req.user.id
    );
    if (result)
      return res.status(201).json({ result: "Clase registrada con éxito." });
    return res
      .status(422)
      .json({ errors: [{ msg: "No se ha podido registrar la clase" }] });
  } catch (err) {
    return res.status(500).json({
      errors: [{ msg: `Ha ocurrido un error interno del servidor: ${err}` }],
    });
  }
});

router.post("/classes/edit", async (req, res, _next) => {
  try {
    const result = await DeviceClassController.edit(
      parseInt(req.body.deviceClassId),
      parseInt(req.body.status),
      parseInt(req.user.id)
    );
    if (result)
      return res.status(201).json({ result: "Clase editada con éxito." });
    return res
      .status(422)
      .json({ errors: [{ msg: "No se ha podido editar la clase" }] });
  } catch (err) {
    return res.status(500).json({
      errors: [{ msg: `Ha ocurrido un error interno del servidor: ${err}` }],
    });
  }
});

export default router;
