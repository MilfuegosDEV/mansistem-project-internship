const util = require("util");
const express = require("express");
const router = express.Router();

const db = require("../../config/db-config");

db.query = util.promisify(db.query);

router.get("/userRolesCount", async (req, res, next) => {
  try {
    const QUERY = `
      SELECT uR.name AS roleName, COUNT(user.id) AS userCount
      FROM users AS user
      INNER JOIN userRoles AS uR ON user.role_id = uR.id
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
      "user.id",
      "user.name",
      "user.lastname",
      "user.email",
      "user.username",
      "uR.name",
      "province.name",
    ];

    const orderByColumn = columns[columnIndex] || "user.id";

    const QUERY = `
      SELECT user.id, 
        user.name AS first_name, 
        user.lastname AS last_name, 
        user.email, 
        user.username,
        uR.name AS roleName, 
        province.name AS provinceName
      FROM users AS user
      INNER JOIN userRoles AS uR 
        ON user.role_id = uR.id
      INNER JOIN provinces AS province 
        ON user.province_id = province.id
      WHERE 
        user.name LIKE ? OR 
        user.lastname LIKE ? OR 
        user.email LIKE ? OR 
        user.username LIKE ? OR 
        uR.name LIKE ? OR 
        province.name LIKE ?
      ORDER BY ${orderByColumn} ${orderDirection}
      LIMIT ? OFFSET ?`;

    const totalQuery = "SELECT COUNT(*) AS total FROM users";
    const totalFilteredQuery = `
      SELECT COUNT(*) AS total 
      FROM users AS user
      INNER JOIN userRoles AS uR 
        ON user.role_id = uR.id
      INNER JOIN provinces AS province 
        ON user.province_id = province.id
      WHERE 
        user.name LIKE ? OR 
        user.lastname LIKE ? OR 
        user.email LIKE ? OR 
        user.username LIKE ? OR 
        uR.name LIKE ? OR 
        province.name LIKE ?`;

    const total = (await db.query(totalQuery))[0].total;
    const totalFiltered = (
      await db.query(totalFilteredQuery, [
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
