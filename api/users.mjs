import { Router } from "express";
import db from "../db/index.mjs";
import { parseQueryParams, createLikeClauses } from "./helper/index.mjs";
const router = Router();

router.get("/users", async (req, res, _next) => {
  try {
    // Define the columns with their respective data mappings
    const columns = [
      { title: "USER.id", data: "id" },
      { title: "USER.name", data: "nombre" },
      { title: "USER.last_name", data: "apellidos" },
      { title: "USER.email", data: "correo" },
      { title: "USER.username", data: "usuario" },
      { title: "USER_ROL.name", data: "rol" },
      { title: "PROVINCE.name", data: "provincia" },
      { title: "STATUS.info", data: "estado" },
    ];

    // Extract query parameters using a destructuring assignment
    const {
      draw,
      start,
      length,
      searchValue,
      columnIndex,
      orderDirection,
      columnFilter,
    } = parseQueryParams(req.query);

    // Set default orderByColumn to "USER.id"
    const orderByColumn = columns[columnIndex]?.title || "USER.id";

    // Create LIKE clauses for search
    const likeClauses = createLikeClauses(searchValue, columns, columnFilter);

    // Base query for fetching users with JOIN operations
    const baseQuery = `
      FROM USER
      INNER JOIN USER_ROL ON USER.role_id = USER_ROL.id
      INNER JOIN PROVINCE ON USER.province_id = PROVINCE.id
      INNER JOIN STATUS ON USER.status_id = STATUS.id
      WHERE ${likeClauses}`;

    // SQL queries
    const totalQuery = "SELECT COUNT(*) AS total FROM USER";
    const totalFilteredQuery = `SELECT COUNT(*) AS total ${baseQuery}`;
    const usersQuery = `
      SELECT 
        USER.id, 
        USER.name, 
        USER.last_name, 
        USER.email, 
        USER.username,
        USER_ROL.name AS rol_name, 
        PROVINCE.name AS province_name,
        STATUS.info AS status
      ${baseQuery}
      ORDER BY ${orderByColumn} ${orderDirection}
      LIMIT ? OFFSET ?`;

    // Execute queries
    const [totalResult] = await db.query(totalQuery);
    const [totalFilteredResult] = await db.query(totalFilteredQuery);
    const [users] = await db.query(usersQuery, [length, start]);

    // Send JSON response to the client
    res.json({
      draw,
      recordsTotal: totalResult[0].total,
      recordsFiltered: totalFilteredResult[0].total,
      data: users,
    });
  } catch (err) {
    // Handle errors
    console.error("Error fetching users:", err);
    res.status(500).send("Server error occurred while fetching users.");
  }
});

export default router;
