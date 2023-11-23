import { status } from "../models/utils/index.mjs";

import {
  checkNotEmpty,
  checkMaxLength,
  handleValidation,
} from "../middlewares/validation.mjs";

import { Router } from "express";
import DeviceClassModel from "../models/DeviceClassModel.mjs";
import DeviceClassController from "../controllers/DeviceClassController.mjs";
import DeviceSupplierModel from "../models/DeviceSupplierModel.mjs";
import DeviceSupplierController from "../controllers/DeviceSupplierController.mjs";
import { ensureAuthenticated, justForAdmins } from "../middlewares/auth.mjs";

const router = Router();

// Views

router.get(
  "/suppliers",
  ensureAuthenticated,
  justForAdmins,
  async (req, res, _next) => {
    res.render("deviceSupplier", {
      title: "Proveedores",
      active: "deviceSupplier",
      user: req.user,
      status: await status(),
    });
    return;
  }
);

router.get(
  "/classes",
  ensureAuthenticated,
  justForAdmins,
  async (req, res, _next) => {
    res.render("deviceClasses", {
      title: "Dispositivos",
      active: "deviceClasses",
      user: req.user,
      status: await status(),
    });
    return;
  }
);

router.get(
  "/types",
  ensureAuthenticated,
  justForAdmins,
  async (req, res, _next) => {
    res.render("deviceTypes", {
      title: "Tipos",
      active: "deviceTypes",
      user: req.user,
      status: await status(),
      deviceClass: await DeviceClassModel.getEnabled(),
      deviceSupplier: await DeviceSupplierModel.getEnabled()
    });
    return;
  }
);


// handlers

router.post("/classes/add", async (req, res, _next) => {
  const validations = [
    (req) => checkNotEmpty(req.body.name, "nombre"),
    (req) => checkMaxLength(req.body.name, 20, "nombre"),
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

router.post("/suppliers/add", async (req, res, _next) => {
  const validations = [
    (req) => checkNotEmpty(req.body.name, "nombre"),
    (req) => checkMaxLength(req.body.name, 20, "nombre"),
  ];
  const err = handleValidation(validations, req);
  if (err) return res.status(422).json({ errors: err });

  try {
    const foundSupplier = await DeviceSupplierModel.findByName(req.body.name);
    if (foundSupplier)
      return res.status(422).json({
        errors: [{ msg: "El proveedor ya fue registrado" }],
      });
    const result = await DeviceSupplierController.add(
      req.body.name.toUpperCase().trim(),
      req.user.id
    );
    if (result)
      return res
        .status(201)
        .json({ result: "Proveedor registrado con éxito." });
    return res
      .status(422)
      .json({ errors: [{ msg: "No se ha podido registrar el proveedor" }] });
  } catch (err) {
    return res.status(500).json({
      errors: [{ msg: `Ha ocurrido un error interno del servidor: ${err}` }],
    });
  }
});

router.post("/suppliers/edit", async (req, res, _next) => {
  try {
    const result = await DeviceSupplierController.edit(
      parseInt(req.body.deviceSupplierId),
      parseInt(req.body.status),
      parseInt(req.user.id)
    );
    if (result)
      return res.status(201).json({ result: "Proveedor editado con éxito." });
    return res
      .status(422)
      .json({ errors: [{ msg: "No se ha podido editar el proveedor" }] });
  } catch (err) {
    return res.status(500).json({
      errors: [{ msg: `Ha ocurrido un error interno del servidor: ${err}` }],
    });
  }
});

export default router;
