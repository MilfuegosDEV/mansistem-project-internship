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

router.get("/users", async (req, res, next) => {
  try {
    const draw = parseInt(req.query.draw) || 0;
    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const search = req.query.search.value || "";
    const order = req.query.order || [];
    const columnIndex = parseInt(order[0]?.column);
    const orderDirection = order[0]?.dir || "asc";

    const columns = [
      "USER.id",
      "USER.name",
      "USER.last_name",
      "USER.email",
      "USER.username",
      "USER_ROL.name",
      "PROVINCE.name",
      "USER.status",
    ];

    const orderByColumn = columns[columnIndex] || "USER.id";

    const QUERY = `
      SELECT 
        USER.id, 
        USER.name, 
        USER.last_name, 
        USER.email, 
        USER.username,
        USER_ROL.name AS rol_name, 
        PROVINCE.name AS province_name,
        USER.status
      FROM USER
      INNER JOIN USER_ROL
        ON USER.role_id = USER_ROL.id
      INNER JOIN PROVINCE
      ON USER.province_id = PROVINCE.id
      WHERE 
        USER.name LIKE ? OR 
        USER.last_name LIKE ? OR 
        USER.email LIKE ? OR 
        USER.username LIKE ? OR 
        USER_ROL.name LIKE ? OR 
        PROVINCE.name LIKE ? OR
        USER.status LIKE ?
      ORDER BY ${orderByColumn} ${orderDirection}
      LIMIT ? OFFSET ?`;

    const totalQuery = "SELECT COUNT(*) AS total FROM USER";
    const totalFilteredQuery = `
      SELECT COUNT(*) AS total 
      FROM USER
      INNER JOIN USER_ROL
        ON USER.role_id = USER_ROL.id
      INNER JOIN PROVINCE
        ON USER.province_id = PROVINCE.id
      WHERE 
        USER.name LIKE ? OR 
        USER.last_name LIKE ? OR 
        USER.email LIKE ? OR 
        USER.username LIKE ? OR 
        USER_ROL.name LIKE ? OR 
        PROVINCE.name LIKE ? OR
        USER.status LIKE ?`;

    const total = (await db.query(totalQuery))[0].total;
    const totalFiltered = (
      await db.query(totalFilteredQuery, [
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
      ])
    )[0].total;

    const users = await db.query(QUERY, [
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      length,
      start,
    ]);

    res.json({
      draw: draw,
      recordsTotal: total,
      recordsFiltered: totalFiltered,
      data: users,
    });
  } catch (err) {
    console.error("Error al obtener los usuarios:", err);
    next(err);
  }
});

module.exports = router;
