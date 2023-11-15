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
    // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
    //     document.body.classList.toggle('sb-sidenav-toggled');
    // }
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

function datatableConfig(selector, url, columnsConfig) {
  const table = $(selector).DataTable({
    responsive: true,
    columnDefs: [
      {
        targets: "_all",
        className: "text-nowrap",
      },
    ],
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

    dom: '<"d-sm-flex justify-content-sm-between"lf><"my-1 d-flex justify-content-center" B>rt<"d-flex justify-content-center" i><"d-flex justify-content-center"p>',
    buttons: [
      {
        text: '<i class="fas fa-plus"></i> Crear',
        action: function (e, dt, node, config) {
          $("#crearModal").modal("show");
        },
        className: "btn btn-success btn-sm",
      },
      {
        text: '<i class="fas fa-pencil-alt"></i> Editar',
        action: function (e, dt, node, config) {
          // Obtener la fila seleccionada
          const data = table.row({ selected: true }).data();
          const editForm = $("#editForm");
          if (data) {
            showEditModal(editForm, data);
          } else {
            $("#rowErrorModal").modal("show");
          }
        },
        className: "btn btn-warning btn-sm",
      },
    ],
  });
  return table;
}

const socket = io();
