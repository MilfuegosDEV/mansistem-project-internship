import db from "../db/index.mjs";
import { createLikeClauses, parseQueryParams } from "./helper/index.mjs";
import { Router } from "express";

const router = Router();

router.get("/clients", async (req, res, next) => {
  const columns = [
    { title: "CLIENT.id", data: "id" },
    { title: "CLIENT.name", data: "cliente" },
    { title: "CLIENT.address", data: "dirección" },
    { title: "CLIENT.phone", data: "teléfono" },
    { title: "CLIENT.email", data: "correo" },
    { title: "PROVINCE.name", data: "provincia" },
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

    // Set default orderByColumn to "CLIENT.id"
    const orderByColumn = columns[columnIndex]?.title || "CLIENT.id";

    // Create LIKE clauses for search
    const likeClauses = createLikeClauses(searchValue, columns, columnFilter);

    // Base query for fetching clients with JOIN operations
    const baseQuery = `
        FROM CLIENT
        INNER JOIN PROVINCE ON CLIENT.province_id = PROVINCE.id
        INNER JOIN STATUS ON CLIENT.status_id = STATUS.id
        WHERE ${likeClauses}`;

    // SQL queries
    const totalQuery = "SELECT COUNT(*) AS total FROM USER";
    const totalFilteredQuery = `SELECT COUNT(*) AS total ${baseQuery}`;
    const clientsQuery = `
        SELECT 
          CLIENT.id, 
          CLIENT.name, 
          CLIENT.address,
          CLIENT.phone, 
          CLIENT.email, 
          PROVINCE.name AS province_name,
          STATUS.info AS status
        ${baseQuery}
        ORDER BY ${orderByColumn} ${orderDirection}
        LIMIT ? OFFSET ?`;

    // Execute queries
    const [totalResult] = await db.query(totalQuery);
    const [totalFilteredResult] = await db.query(totalFilteredQuery);
    const [clients] = await db.query(clientsQuery, [length, start]);

    // Send JSON response to the client
    res.json({
      draw,
      recordsTotal: totalResult[0].total,
      recordsFiltered: totalFilteredResult[0].total,
      data: clients,
    });
  } catch (err) {
    // Handle errors
    console.error("Error fetching clients:", err);
    res.status(500).send("Server error occurred while fetching clients.");
  }
});

export default router;
