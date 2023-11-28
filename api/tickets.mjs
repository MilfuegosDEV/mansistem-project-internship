import db from "../db/index.mjs";
import { Router } from "express";
import { parseQueryParams, createLikeClauses } from "./helper/index.mjs";

const router = Router();

router.get("/", async (req, res, next) => {
  const columns = [
    { title: "TICKET.id", data: "id" },
    { title: "TICKET.id_ticket_client", data: "ms" },
    { title: "CLIENT.name", data: "negocio" },
    { title: "TICKET_AREA.name", data: "area" },
    { title: "TICKET.device_user", data: "usuario" },
    { title: "TICKET.info", data: "info" },
    {
      title: "CONCAT(ASSIGNED_TO.name , ' ' ,  ASSIGNED_TO.last_name)",
      data: "asignado_a",
    },
    { title: "TICKET.creation_date", data: "creado" },
    { title: "TICKET.close_date", data: "finalizado" },
    { title: "TICKET_STATUS.info", data: "estado" },
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
    const orderByColumn = columns[columnIndex]?.title || "TICKET.id";

    // Create LIKE clauses for search
    const likeClauses = createLikeClauses(searchValue, columns, columnFilter);

    // Base query for fetching clients with JOIN operations
    const baseQuery = `
      FROM TICKET
      INNER JOIN CLIENT ON client_id = CLIENT.id
      INNER JOIN TICKET_AREA ON TICKET.ticket_area_id = TICKET_AREA.id
      INNER JOIN TICKET_STATUS ON TICKET.ticket_status_id = TICKET_STATUS.id
      INNER JOIN USER AS ASSIGNED_TO ON TICKET.assigned_to_user_id = ASSIGNED_TO.id
      WHERE ${likeClauses}`;

    // SQL queries
    const totalQuery = "SELECT COUNT(*) AS total FROM TICKET";
    const totalFilteredQuery = `SELECT COUNT(*) AS total ${baseQuery}`;
    const clientsQuery = `
      SELECT 
        TICKET.id,
        TICKET.id_ticket_client,
        CLIENT.name as client, 
        TICKET_AREA.name as ticket_area,
        TICKET.device_user,
        TICKET.info,
        CONCAT(ASSIGNED_TO.name , ' ' ,  ASSIGNED_TO.last_name) AS assigned_to,
        TICKET.creation_date,
        TICKET.close_date,
        TICKET_STATUS.info as ticket_status
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
    console.error("Error al recuperar los clientes:", err);
    res.status(500).send("Error del servidor al recuperar los clientes");
  }
});

export default router;
