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

module.exports = { parseQueryParams, createLikeClauses };
