/*!
 * Start Bootstrap - SB Admin v7.0.7 (https://startbootstrap.com/template/sb-admin)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
 */
//
// Scripts
//

window.addEventListener("DOMContentLoaded", (event) => {
  // Toggle the side navigation
  const sidebarToggle = document.body.querySelector("#sidebarToggle");
  if (sidebarToggle) {
    // Uncomment Below to persist sidebar toggle between refreshes
    if (localStorage.getItem("sb|sidebar-toggle") === "true") {
      document.body.classList.toggle("sb-sidenav-toggled");
    }
    sidebarToggle.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.toggle("sb-sidenav-toggled");
      localStorage.setItem(
        "sb|sidebar-toggle",
        document.body.classList.contains("sb-sidenav-toggled")
      );
    });
  }
});

function displayErrors(selector, errors) {
  selector.innerHTML = errors
    .map(
      (error) =>
        `<div class="alert alert-danger mb-1 py-1"><strong>¡Error!</strong> ${error.msg}</div>`
    )
    .join("");
}

function datatableConfig(selector, url, columnsConfig, columnDefs) {
  const table = $(selector).DataTable({
    responsive: true,
    columnDefs: columnDefs,
    select: {
      info: false,
      style: "single",
    },
    processing: true,
    serverSide: true,
    ajax: url, // Ruta de la API en tu servidor Express.js
    columns: columnsConfig,
    oLanguage: { sSearch: "" },
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
      searchPlaceholder: "Buscar...",
    },
  });
  return table;
}

document.getElementById("editToggleModal").addEventListener("click", function () {
  // Obtener la fila seleccionada
  const dataTable = document.getElementById('DataTable').DataTable();
  const selectedData = dataTable.row({ selected: true }).data();
  const editForm = document.getElementById("editForm");

  if (selectedData) {
    showEditModal(editForm, selectedData);
  } else {
    document.getElementById("rowErrorModal").modal("show");
  }
});

function showEditModal(editForm, selectedData) {
  const selectedRole = $("#editRoles option")
    .filter(function () {
      return $(this).text().trim() === selectedData.rol_name;
    })
    .val();

  const selectedProvince = $("#editProvinces option")
    .filter(function () {
      return $(this).text().trim() === selectedData.province_name;
    })
    .val();

  const selectedStatus = $("#editStatus option")
    .filter(function () {
      return $(this).text().trim() === selectedData.status;
    })
    .val();

  $("#id").val(selectedData.id);
  $("#editInputFirstName").val(selectedData.name);
  $("#editInputLastName").val(selectedData.last_name);
  $("#editInputEmail").val(selectedData.email);
  $("#editRoles").val(selectedRole);
  $("#editProvinces").val(selectedProvince);
  $("#editStatus").val(selectedStatus);
  $("#editarModal").modal("show");
}
