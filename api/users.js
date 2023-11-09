const util = require("util");
const { createLikeClauses, parseQueryParams } = require("./apiUtils");
const { Router } = require("express");
const router = Router();

const db = require("../config/db-config");

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

/**
 * Retorna la información del usuario para insertarla dentro de
 * DataTables, utiliza serverside proccess para optimizar.
 */
router.get("/users", async (req, res, _next) => {
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
        INNER JOIN STATUS ON USER.status_id = STATUS.id
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
          STATUS.info AS status
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
