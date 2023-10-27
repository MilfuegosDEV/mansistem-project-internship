Chart.defaults.global.defaultFontFamily =
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#292b2c";

async function fetchRolesCount() {
  try {
    const response = await fetch("/api/userRolesCount");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching roles count:", error);
    return [];
  }
}
async function createRolesChart() {
  const rolesCount = await fetchRolesCount();
  const labels = rolesCount.map((role) => role.roleName);
  const data = rolesCount.map((role) => role.userCount);

  const backgroundColors = ["#007bff", "#dc3545", "#ffc107", "#28a745"]; // Colores de fondo

  const ctx = document.getElementById("usersRoleChart").getContext("2d");
  const myPieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColors.slice(0, data.length),
        },
      ],
    },
  });
}

createRolesChart();
