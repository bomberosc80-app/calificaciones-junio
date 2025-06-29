const datos = {
  usuarios: {
    "c80306": { CLAVE: "bvsp1959", NOMBRE: "Sergio", ES_ADMIN: true },
    "juan23": { CLAVE: "1234", NOMBRE: "Juan Pérez", ES_ADMIN: false }
  }
};

let usuarioActual = null;
let calificaciones = {};

async function iniciarSesion() {
  const id = document.getElementById("usuario").value.trim();
  const clave = document.getElementById("clave").value.trim();
  const user = datos.usuarios[id];

  if (user && user.CLAVE === clave) {
    usuarioActual = id;
    document.getElementById("login").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    document.getElementById("nombreUsuario").innerText = user.NOMBRE || id;
    if (user.ES_ADMIN) document.getElementById("panelAdmin").classList.remove("hidden");
    await cargarCalificaciones();
    renderCalificaciones("ANUAL");
  } else {
    alert("Usuario o clave incorrectos.");
  }
}

function cerrarSesion() {
  usuarioActual = null;
  document.getElementById("login").classList.remove("hidden");
  document.getElementById("app").classList.add("hidden");
  document.getElementById("panelAdmin").classList.add("hidden");
  document.getElementById("tablaCalificaciones").innerHTML = "";
  document.getElementById("usuario").value = "";
  document.getElementById("clave").value = "";
}

function cambiarMes() {
  const mes = document.getElementById("selectorMes").value;
  renderCalificaciones(mes);
}

function renderCalificaciones(mesSeleccionado) {
  const usuario = usuarioActual;
  const userData = calificaciones[usuario];
  if (!userData) return;

  const ordenMeses = [
    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
    "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
  ];

  let html = "<table><tr>";
  if (mesSeleccionado === "ANUAL") {
    html += "<th>Mes</th><th>Calificación</th></tr>";
    let suma = 0;
    let cantidad = 0;

    for (let mes of ordenMeses) {
      const valor = userData[mes];
      if (valor !== undefined && valor !== "") {
        html += `<tr><td>${mes}</td><td>${valor}</td></tr>`;
        suma += parseFloat(valor);
        cantidad++;
      }
    }

    const promedio = cantidad > 0 ? (suma / cantidad).toFixed(2) : "-";
    html += `<tr><th>Promedio</th><th>${promedio}</th></tr>`;
  } else {
    html += `<th>${mesSeleccionado}</th></tr>`;
    html += `<tr><td>${userData[mesSeleccionado] || "Sin dato"}</td></tr>`;
  }

  html += "</table>";
  document.getElementById("tablaCalificaciones").innerHTML = html;
}

async function cargarCalificaciones() {
  try {
    const response = await fetch("calificaciones.csv");
    const text = await response.text();
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",");

    calificaciones = {};

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(",");
      const id = row[0];
      calificaciones[id] = {};

      for (let j = 1; j < headers.length; j++) {
        calificaciones[id][headers[j].toUpperCase()] = row[j];
      }
    }
  } catch (err) {
    console.error("Error al cargar calificaciones.csv:", err);
    alert("No se pudo cargar el archivo de calificaciones.");
  }
}

function previsualizarCSV() {
  const fileInput = document.getElementById("archivoCSV");
  const previewDiv = document.getElementById("previewCSV");
  const file = fileInput.files[0];

  if (!file) return alert("Selecciona un archivo CSV.");

  const reader = new FileReader();
  reader.onload = function (e) {
    const lines = e.target.result.trim().split("\n");
    let html = "<table>";
    for (let line of lines) {
      const cols = line.split(",");
      html += "<tr>" + cols.map(col => `<td>${col}</td>`).join("") + "</tr>";
    }
    html += "</table>";
    previewDiv.innerHTML = html;
  };
  reader.readAsText(file);
}

function cargarCSV() {
  const fileInput = document.getElementById("archivoCSV");
  const file = fileInput.files[0];
  if (!file) return alert("Selecciona un archivo CSV.");

  const reader = new FileReader();
  reader.onload = function (e) {
    const lines = e.target.result.trim().split("\n");
    const headers = lines[0].split(",");
    calificaciones = {};

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(",");
      const id = row[0];
      calificaciones[id] = {};

      for (let j = 1; j < headers.length; j++) {
        calificaciones[id][headers[j].toUpperCase()] = row[j];
      }
    }

    alert("Calificaciones actualizadas desde CSV.");
    renderCalificaciones(document.getElementById("selectorMes").value);
  };
  reader.readAsText(file);
}
