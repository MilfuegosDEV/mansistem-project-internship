const util = require("util");
const { createLikeClauses, parseQueryParams } = require("./apiUtils");
const { Router } = require("express");

const router = Router();

const db = require("../config/db-config");

db.query = util.promisify(db.query);

router.get("/clients", async (req, res, _next) => {
  const columns = [
    { title: "CLIENT.id", data: "id" },
    { title: "CLIENT.name", data: "cliente" },
    { title: "CLIENT.address", data: "dirección" },
    { title: "CLIENT.phone", data: "teléfono" },
    { title: "CLIENT.email", data: "correo" },
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
      FROM CLIENT
      INNER JOIN PROVINCE ON CLIENT.province_id = PROVINCE.id
      INNER JOIN STATUS ON CLIENT.status_id = STATUS.id
      WHERE ${likeClauses}`;

    const totalQuery = "SELECT COUNT(*) AS total FROM CLIENT";
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

    const [totalResult] = await db.query(totalQuery);
    const [totalFilteredResult] = await db.query(totalFilteredQuery);
    const clients = await db.query(clientsQuery, [length, start]);

    res.json({
      draw,
      recordsTotal: totalResult.total,
      recordsFiltered: totalFilteredResult.total,
      data: clients,
    });
  } catch (err) {
    console.error("Error fetching clients:", err);
    res.status(500).send("Server error occurred while fetching users.");
  }
});

module.exports = router;
