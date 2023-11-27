import DeviceTypeModel from "../app/models/DeviceTypeModel.mjs";
import db from "../db/index.mjs";
import { createLikeClauses, parseQueryParams } from "./helper/index.mjs";
import { Router } from "express";

const router = Router();

// Obtiene un listado de dispositivos mediante su clase de dispositivo
router.get("/getByClass", async (req, res, next) => {
  try {
    const results = await DeviceTypeModel.getEnabledByClass(
      req.query.deviceClass
    );
    return res.status(200).json(results);
  } catch (err) {
    next(err);
  }
});

// Utilizado para DataTables
router.get("/", async (req, res, _next) => {
  const columns = [
    { title: "DEVICE.id", data: "id" },
    { title: "DEVICE.model", data: "modelo" },
    { title: "DEVICE_TYPE.name", data: "tipo" },
    { title: "DEVICE_CLASS.name", data: "clase" },
    { title: "DEVICE_SUPPLIER.name", data: "proveedor" },
    { title: "STATUS.info", data: "estado" },
  ];

  // Extract query parameters using a destructuring assignment
  try {
    const {
      draw,
      start,
      length,
      searchValue,
      columnIndex,
      orderDirection,
      columnFilter,
    } = parseQueryParams(req.query);

    // Set default orderByColumn to "DEVICE.id"
    const orderByColumn = columns[columnIndex]?.title || "DEVICE.id";

    // Create LIKE clauses for search
    const likeClauses = createLikeClauses(searchValue, columns, columnFilter);

    // Base query for fetching devices with JOIN operations
    const baseQuery = `
        FROM DEVICE
        INNER JOIN DEVICE_TYPE ON DEVICE.device_type_id = DEVICE_TYPE.id
        INNER JOIN DEVICE_CLASS ON DEVICE.device_class_id = DEVICE_CLASS.id
        INNER JOIN DEVICE_SUPPLIER ON DEVICE.device_supplier_id = DEVICE_SUPPLIER.id
        INNER JOIN STATUS ON DEVICE.status_id = STATUS.id
        WHERE ${likeClauses}`;

    // SQL queries
    const totalQuery = "SELECT COUNT(*) AS total FROM DEVICE";
    const totalFilteredQuery = `SELECT COUNT(*) AS total ${baseQuery}`;
    const devicesQuery = `
        SELECT 
          DEVICE.id, 
          DEVICE.model AS model,
          DEVICE_TYPE.name AS type,
          DEVICE_CLASS.name AS className,
          DEVICE_SUPPLIER.name AS supplier,
          STATUS.info AS status
        ${baseQuery}
        ORDER BY ${orderByColumn} ${orderDirection}
        LIMIT ? OFFSET ?`;

    // Execute queries
    const [totalResult] = await db.query(totalQuery);
    const [totalFilteredResult] = await db.query(totalFilteredQuery);
    const [devices] = await db.query(devicesQuery, [length, start]);

    // Send JSON response to the devices
    res.json({
      draw,
      recordsTotal: totalResult[0].total,
      recordsFiltered: totalFilteredResult[0].total,
      data: devices,
    });
  } catch (err) {
    // Handle errors
    console.error("Error al recuperar los dispositivos:", err);
    res.status(500).send("Error del servidor al recuperar los dispositivos");
  }
});

// Clases de dispositivos
router.get("/classes", async (req, res, _next) => {
  const columns = [
    { title: "DEVICE_CLASS.id", data: "id" },
    { title: "DEVICE_CLASS.name", data: "clase" },
    { title: "STATUS.info", data: "estado" },
  ];

  // Extract query parameters using a destructuring assignment
  try {
    const {
      draw,
      start,
      length,
      searchValue,
      columnIndex,
      orderDirection,
      columnFilter,
    } = parseQueryParams(req.query);

    // Set default orderByColumn to "DEVICE_CLASS.id"
    const orderByColumn = columns[columnIndex]?.title || "DEVICE_CLASS.id";

    // Create LIKE clauses for search
    const likeClauses = createLikeClauses(searchValue, columns, columnFilter);

    // Base query for fetching clients with JOIN operations
    const baseQuery = `
        FROM DEVICE_CLASS
        INNER JOIN STATUS ON DEVICE_CLASS.status_id = STATUS.id
        WHERE ${likeClauses}`;

    // SQL queries
    const totalQuery = "SELECT COUNT(*) AS total FROM DEVICE_CLASS";
    const totalFilteredQuery = `SELECT COUNT(*) AS total ${baseQuery}`;
    const classesQuery = `
        SELECT 
          DEVICE_CLASS.id, 
          DEVICE_CLASS.name,
          STATUS.info AS status
        ${baseQuery}
        ORDER BY ${orderByColumn} ${orderDirection}
        LIMIT ? OFFSET ?`;

    // Execute queries
    const [totalResult] = await db.query(totalQuery);
    const [totalFilteredResult] = await db.query(totalFilteredQuery);
    const [classes] = await db.query(classesQuery, [length, start]);

    // Send JSON response to the device_class
    res.json({
      draw,
      recordsTotal: totalResult[0].total,
      recordsFiltered: totalFilteredResult[0].total,
      data: classes,
    });
  } catch (err) {
    // Handle errors
    console.error("Error al recuperar las clases de dispositivos:", err);
    res
      .status(500)
      .send("Error del servidor al recuperar la clase de dispositivos");
  }
});

// proveedores de dispositivos
router.get("/suppliers", async (req, res, _next) => {
  const columns = [
    { title: "DEVICE_SUPPLIER.id", data: "id" },
    { title: "DEVICE_SUPPLIER.name", data: "proveedor" },
    { title: "STATUS.info", data: "estado" },
  ];

  // Extract query parameters using a destructuring assignment
  try {
    const {
      draw,
      start,
      length,
      searchValue,
      columnIndex,
      orderDirection,
      columnFilter,
    } = parseQueryParams(req.query);

    // Set default orderByColumn to "DEVICE_SUPPLIER.id"
    const orderByColumn = columns[columnIndex]?.title || "DEVICE_SUPPLIER.id";

    // Create LIKE clauses for search
    const likeClauses = createLikeClauses(searchValue, columns, columnFilter);

    // Base query for fetching clients with JOIN operations
    const baseQuery = `
          FROM DEVICE_SUPPLIER
          INNER JOIN STATUS ON DEVICE_SUPPLIER.status_id = STATUS.id
          WHERE ${likeClauses}`;

    // SQL queries
    const totalQuery = "SELECT COUNT(*) AS total FROM DEVICE_SUPPLIER";
    const totalFilteredQuery = `SELECT COUNT(*) AS total ${baseQuery}`;
    const supplierQuery = `
          SELECT 
            DEVICE_SUPPLIER.id, 
            DEVICE_SUPPLIER.name,
            STATUS.info AS status
          ${baseQuery}
          ORDER BY ${orderByColumn} ${orderDirection}
          LIMIT ? OFFSET ?`;

    // Execute queries
    const [totalResult] = await db.query(totalQuery);
    const [totalFilteredResult] = await db.query(totalFilteredQuery);
    const [suppliers] = await db.query(supplierQuery, [length, start]);

    // Send JSON response to the device_class
    res.json({
      draw,
      recordsTotal: totalResult[0].total,
      recordsFiltered: totalFilteredResult[0].total,
      data: suppliers,
    });
  } catch (err) {
    // Handle errors
    console.error("Error al recuperar las clases de dispositivos:", err);
    res
      .status(500)
      .send("Error del servidor al recuperar la clase de dispositivos");
  }
});

// tipos de dispositivos
router.get("/types", async (req, res, _next) => {
  const columns = [
    { title: "DEVICE_TYPE.id", data: "id" },
    { title: "DEVICE_TYPE.name", data: "tipo" },
    { title: "DEVICE_CLASS.name", data: "clase" },
    { title: "STATUS.info", data: "estado" },
  ];

  // Extract query parameters using a destructuring assignment
  try {
    const {
      draw,
      start,
      length,
      searchValue,
      columnIndex,
      orderDirection,
      columnFilter,
    } = parseQueryParams(req.query);

    // Set default orderByColumn to "DEVICE_SUPPLIER.id"
    const orderByColumn = columns[columnIndex]?.title || "DEVICE_TYPE.id";

    // Create LIKE clauses for search
    const likeClauses = createLikeClauses(searchValue, columns, columnFilter);

    // Base query for fetching clients with JOIN operations
    const baseQuery = `
          FROM DEVICE_TYPE
          INNER JOIN STATUS ON DEVICE_TYPE.status_id = STATUS.id
          INNER JOIN DEVICE_CLASS ON DEVICE_TYPE.device_class_id = DEVICE_CLASS.id
          WHERE ${likeClauses}`;

    // SQL queries
    const totalQuery = "SELECT COUNT(*) AS total FROM DEVICE_TYPE";
    const totalFilteredQuery = `SELECT COUNT(*) AS total ${baseQuery}`;
    const typeQuery = `
          SELECT 
            DEVICE_TYPE.id, 
            DEVICE_TYPE.name,
            DEVICE_CLASS.name AS class,
            STATUS.info AS status
          ${baseQuery}
          ORDER BY ${orderByColumn} ${orderDirection}
          LIMIT ? OFFSET ?`;

    // Execute queries
    const [totalResult] = await db.query(totalQuery);
    const [totalFilteredResult] = await db.query(totalFilteredQuery);
    const [types] = await db.query(typeQuery, [length, start]);

    // Send JSON response to the device_type
    res.json({
      draw,
      recordsTotal: totalResult[0].total,
      recordsFiltered: totalFilteredResult[0].total,
      data: types,
    });
  } catch (err) {
    // Handle errors
    console.error("Error al recuperar los tipos de dispositivos:", err);
    res
      .status(500)
      .send("Error del servidor al recuperar los tipos de dispositivos");
  }
});

export default router;
