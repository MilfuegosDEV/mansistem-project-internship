const util = require("util");
const express = require("express");
const router = express.Router();

const db = require("../../config/db-config");

db.query = util.promisify(db.query);

router.get("/userRolesCount", async (req, res, next) => {
  try {
    const QUERY = `
      SELECT uR.name AS roleName, COUNT(user.id) AS userCount
      FROM USER AS user
      INNER JOIN USER_ROL AS uR ON user.role_id = uR.id
      GROUP BY uR.name`;

    const rolesCount = await db.query(QUERY);
    res.json(rolesCount);
  } catch (err) {
    console.error("Error al obtener la cantidad de usuarios por rol:", err);
    next(err);
  }
});

// Helper function to parse query parameters
function parseQueryParams(query) {
  const draw = parseInt(query.draw, 10) || 0;
  const start = parseInt(query.start, 10) || 0;
  const length = parseInt(query.length, 10) || 10;
  let searchValue = query.search?.value || "";
  const order = query.order || [];
  const columnIndex = parseInt(order[0]?.column, 10);
  const orderDirection = order[0]?.dir || "asc";

  if (isNaN(draw) || isNaN(start) || isNaN(length) || isNaN(columnIndex)) {
    throw new Error("Invalid query parameters");
  }

  // Check if searchValue contains a specific column filter (e.g., "id:123")
  const columnSearchMatch = searchValue.match(/(\w+):(.+)/);
  let columnFilter = null;
  if (columnSearchMatch) {
    const columnName = columnSearchMatch[1].toLowerCase();
    searchValue = columnSearchMatch[2];
    columnFilter = columnName;
  }

  return {
    draw,
    start,
    length,
    searchValue,
    columnIndex,
    orderDirection,
    columnFilter,
  };
}

// Helper function to create SQL LIKE clauses with optional specific column filtering
function createLikeClauses(searchValue, columns, columnFilter) {
  if (columnFilter) {
    const column = columns.find(
      (col) => col.data.toLowerCase() === columnFilter
    );
    if (column) {
      return `${column.title} LIKE '${searchValue}%'`;
    }
    return "1=1"; // No filter applied if the column name is not found
  } else {
    return columns
      .map((col) => `${col.title} LIKE '%${searchValue}%'`)
      .join(" OR ");
  }
}

// Define the columns with their respective data mappings
const columns = [
  { title: "USER.id", data: "id" },
  { title: "USER.name", data: "nombre" },
  { title: "USER.last_name", data: "apellidos" },
  { title: "USER.email", data: "correo" },
  { title: "USER.username", data: "usuario" },
  { title: "USER_ROL.name", data: "rol" },
  { title: "PROVINCE.name", data: "provincia" },
  { title: "USER_STATUS.info", data: "estado" },
];

router.get("/users", async (req, res, next) => {
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

    const orderByColumn = columns[columnIndex]?.title || "USER.id";
    const likeClauses = createLikeClauses(searchValue, columns, columnFilter);

    const baseQuery = `
      FROM USER
      INNER JOIN USER_ROL ON USER.role_id = USER_ROL.id
      INNER JOIN PROVINCE ON USER.province_id = PROVINCE.id
      INNER JOIN USER_STATUS ON USER.user_status_id = USER_STATUS.id
      WHERE ${likeClauses}`;

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
        USER_STATUS.info AS status
      ${baseQuery}
      ORDER BY ${orderByColumn} ${orderDirection}
      LIMIT ? OFFSET ?`;

    const [totalResult] = await db.query(totalQuery);
    const [totalFilteredResult] = await db.query(totalFilteredQuery);
    const users = await db.query(usersQuery, [length, start]);

    res.json({
      draw,
      recordsTotal: totalResult.total,
      recordsFiltered: totalFilteredResult.total,
      data: users,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Server error occurred while fetching users.");
  }
});

module.exports = router;
