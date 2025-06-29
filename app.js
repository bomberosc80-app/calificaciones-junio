const datos = {
  usuarios: {
    "c80306": { CLAVE: "bvsp1959", NOMBRE: "Sergio" },
    "juan23": { CLAVE: "1234", NOMBRE: "Juan Pérez" }
  }
};

let usuarioActual = null;
let calificaciones = [];

async function iniciarSesion() {
  const usuario = document.getElementById("usuario").value.trim();
  const clave = document.getElementById("clave").value.trim();
  const user = datos.usuarios[usuario];

  if (user && user.CLAVE === clave) {
    usuarioActual = usuario;
    document.getElementById("login").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    document.getElementById("nombreUsuario").innerText = user.NOMBRE || usuario;
    if (usuario === "c80306") document.getElementById("panelAdmin").classList.remove("hidden");
    await cargarCalificaciones();
    renderCalificaciones("ANUAL");
  } else {
    alert("Usuario o clave incorrectos.");
  }
}

function cerrarSesion() {
  location.reload();
}

function cambiarMes() {
  const mes = document.getElementById("selectorMes").value;
  renderCalificaciones(mes);
}

function renderCalificaciones(mesSeleccionado) {
  const tabla = document.getElementById("tablaCalificaciones");
  const userData = calificaciones.find(row => row.legajo === usuarioActual);
  if (!userData) return tabla.innerHTML = "<p>No hay datos disponibles.</p>";

  let html = "<table><tr>";
  if (mesSeleccionado === "ANUAL") {
    html += "<th>Mes</th><th>Total</th></tr>";
    const meses = ["ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"];
    let suma = 0, count = 0;
    meses.forEach(mes => {
      const rows = calificaciones.filter(r => r.legajo === usuarioActual && r.mes === mes);
      if (rows.length > 0) {
        const total = parseFloat(rows[0].TOTAL);
        html += `<tr><td>${mes}</td><td>${total}</td></tr>`;
        suma += total;
        count++;
      }
    });
    const promedio = count > 0 ? (suma / count).toFixed(2) : "-";
    html += `<tr><th>Promedio</th><th>${promedio}</th></tr>`;
  } else {
    html += `<th>${mesSeleccionado}</th></tr>`;
    const fila = calificaciones.find(r => r.legajo === usuarioActual && r.mes === mesSeleccionado);
    html += `<tr><td>${fila ? fila.TOTAL : "Sin dato"}</td></tr>`;
  }
  html += "</table>";
  tabla.innerHTML = html;
}

async function cargarCalificaciones() {
  try {
    const response = await fetch("calificaciones.csv");
    const texto = await response.text();
    const lineas = texto.trim().split("\n");
    const headers = lineas[0].split(",");
    calificaciones = lineas.slice(1).map(linea => {
      const datos = linea.split(",");
      const fila = {};
      headers.forEach((h, i) => fila[h.trim()] = datos[i]?.trim());
      return fila;
    });
  } catch (e) {
    console.error("Error al cargar CSV", e);
  }
}

function previsualizarCSV() {
  const input = document.getElementById("archivoCSV");
  const preview = document.getElementById("previewCSV");
  if (!input.files.length) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    const rows = text.trim().split("\n");
    let html = "<table><tr>";
    const headers = rows[0].split(",");
    headers.forEach(h => html += `<th>${h}</th>`);
    html += "</tr>";
    rows.slice(1).forEach(row => {
      html += "<tr>";
      row.split(",").forEach(cell => html += `<td>${cell}</td>`);
      html += "</tr>";
    });
    html += "</table>";
    preview.innerHTML = html;
  };
  reader.readAsText(input.files[0]);
}

function confirmarCarga() {
  const input = document.getElementById("archivoCSV");
  if (!input.files.length) return alert("Seleccione un archivo CSV");
  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    const lineas = text.trim().split("\n");
    const headers = lineas[0].split(",");
    calificaciones = lineas.slice(1).map(linea => {
      const datos = linea.split(",");
      const fila = {};
      headers.forEach((h, i) => fila[h.trim()] = datos[i]?.trim());
      return fila;
    });
    alert("Calificaciones cargadas correctamente.");
    renderCalificaciones(document.getElementById("selectorMes").value);
  };
  reader.readAsText(input.files[0]);
}