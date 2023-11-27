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
import DeviceTypeModel from "../models/DeviceTypeModel.mjs";
import DeviceTypeController from "../controllers/DeviceTypeController.mjs";
import DeviceController from "../controllers/DeviceController.mjs";
import DeviceModel from "../models/DeviceModel.mjs";

const router = Router();

// Views

router.get("/", ensureAuthenticated, justForAdmins, async (req, res, _next) => {
  res.render("devices", {
    title: "Dispositivos",
    active: "devices",
    user: req.user,
    status: await status(),
    deviceClass: await DeviceClassModel.getEnabled(),
    deviceSupplier: await DeviceSupplierModel.getEnabled(),
  });
});

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
      deviceSupplier: await DeviceSupplierModel.getEnabled(),
    });
    return;
  }
);

// handlers

// devices
router.post("/add", async (req, res, _next) => {
  const validations = [
    (req) => checkMaxLength(req.body.name, 20, "modelo"),
    (req) => checkNotEmpty(req.body.name, "modelo"),
    (req) => checkNotEmpty(req.body.deviceClass, "clase"),
    (req) => checkNotEmpty(req.body.supplier, "proveedor"),
    (req) => checkNotEmpty(req.body.type, "tipo"),
  ];

  const err = handleValidation(validations, req);
  if (err) return res.status(422).json({ errors: err });

  try {
    const foundDevice = await DeviceModel.find(
      req.body.name,
      req.body.type,
      req.body.deviceClass,
      req.body.supplier
    );
    if (foundDevice)
      return res
        .status(422)
        .json({ errors: [{ msg: "El dispositivo ya fue agregado." }] });

    const result = await DeviceController.add(
      req.body.name.toUpperCase().trim(),
      parseInt(req.body.deviceClass),
      parseInt(req.body.supplier),
      parseInt(req.body.type),
      req.user.id
    );

    if (result)
      return res
        .status(201)
        .json({ result: "Se ha registrado el dispositivos" });
    return res
      .status(422)
      .json({ errros: [{ msg: "No se ha podido registrar el dispositivo." }] });
  } catch (e) {
    return res.status(500).json({
      errors: [{ msg: `Ha ocurrido un error interno del servidor: ${e}` }],
    });
  }
});

router.post("/edit", async (req, res) => {
  try {
    const result = await DeviceController.edit(
      req.user.id,
      req.body.class_name.toUpperCase().trim(),
      req.body.supplier_name.toUpperCase().trim(),
      req.body.type_name.toUpperCase().trim(),
      parseInt(req.body.status),
      parseInt(req.body.id)
    );
    if (result === 1)
      return res
        .status(201)
        .json({ result: "El tipo de dispositivo ha editado con éxito." });
    else if (null === result) {
      return res.status(422).json({
        errors: [
          {
            msg: `Para poder continuar, revisa que la clase del dispositivo, el tipo y el proveedor esten habilitados.`,
          },
        ],
      });
    }
    return res.status(422).json({
      errors: [{ msg: "No se ha podido editar el tipo de dispositivo" }],
    });
  } catch (err) {
    return res.status(500).json({
      errors: [{ msg: `Ha ocurrido un error interno del servidor: ${err}` }],
    });
  }
});

// device's class
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
      parseInt(req.body.id),
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

// device's supplier
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
      parseInt(req.body.id),
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

// device's type
router.post("/types/add", async (req, res, _next) => {
  const validations = [
    (req) => checkNotEmpty(req.body.name, "nombre"),
    (req) => checkMaxLength(req.body.name, 20, "nombre"),
  ];
  const err = handleValidation(validations, req);
  if (err) return res.status(422).json({ errors: err });

  try {
    const foundType = await DeviceTypeModel.findType(
      req.body.name,
      parseInt(req.body.deviceClass)
    );
    if (foundType)
      return res.status(422).json({
        errors: [{ msg: "El tipo de dispositivo ya fue registrado" }],
      });
    const result = await DeviceTypeController.add(
      req.body.name.toUpperCase().trim(),
      parseInt(req.body.deviceClass),
      req.user.id
    );
    if (result)
      return res
        .status(201)
        .json({ result: "Tipo de dispositivo registrado con éxito." });
    return res.status(422).json({
      errors: [{ msg: "No se ha podido registrar el tipo de dispositivo" }],
    });
  } catch (err) {
    return res.status(500).json({
      errors: [{ msg: `Ha ocurrido un error interno del servidor: ${err}` }],
    });
  }
});

router.post("/types/edit", async (req, res, _next) => {
  try {
    const result = await DeviceTypeController.edit(
      parseInt(req.body.id),
      req.body.className.toUpperCase().trim(),
      parseInt(req.body.status),
      parseInt(req.user.id)
    );
    if (result === 1)
      return res
        .status(201)
        .json({ result: "El tipo de dispositivo ha editado con éxito." });
    else if (null === result) {
      return res.status(422).json({
        errors: [
          {
            msg: `Para poder continuar, revisa que el proveedor y la clase estén dispositivo esten habilitados.`,
          },
        ],
      });
    }
    return res.status(422).json({
      errors: [{ msg: "No se ha podido editar el tipo de dispositivo" }],
    });
  } catch (err) {
    return res.status(500).json({
      errors: [{ msg: `Ha ocurrido un error interno del servidor: ${err}` }],
    });
  }
});

export default router;
