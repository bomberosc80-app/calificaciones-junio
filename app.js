
let datos = {};
const usuarios = {
  "c80306": { CLAVE: "bvsp1959", NOMBRE: "Sergio" },
  "admin": { CLAVE: "admin123", NOMBRE: "Administrador" },
  "juan23": { CLAVE: "1234", NOMBRE: "Juan Pérez" }
};
let usuarioActual = null;

async function iniciarSesion() {
  const usuario = document.getElementById("usuario").value.trim();
  const clave = document.getElementById("clave").value.trim();
  const user = usuarios[usuario];

  if (user && user.CLAVE === clave) {
    usuarioActual = usuario;
    document.getElementById("login").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    document.getElementById("app").classList.add("fade-in");
    document.getElementById("nombreUsuario").innerText = user.NOMBRE || usuario;
    if (usuario === "admin") document.getElementById("panelAdmin").classList.remove("hidden");
    await cargarDatos();
    cambiarMes();
  } else {
    alert("Usuario o clave incorrectos.");
  }
}

function cerrarSesion() {
  usuarioActual = null;
  document.getElementById("login").classList.remove("hidden");
  document.getElementById("app").classList.add("hidden");
  document.getElementById("panelAdmin").classList.add("hidden");
  document.getElementById("usuario").value = "";
  document.getElementById("clave").value = "";
  document.getElementById("tablaCalificaciones").innerHTML = "";
}

function cambiarMes() {
  const mes = document.getElementById("selectorMes").value;
  renderCalificaciones(mes);
}

async function cargarDatos() {
  const url = "calificaciones.csv";
  const response = await fetch(url);
  const texto = await response.text();
  const lineas = texto.split("\n").filter(l => l.trim() !== "");
  const headers = lineas[0].split(",");
  datos = {};
  for (let i = 1; i < lineas.length; i++) {
    const fila = lineas[i].split(",");
    const legajo = fila[0];
    const nombre = fila[1];
    const mes = fila[2];
    if (!datos[legajo]) datos[legajo] = { nombre, calificaciones: {} };
    datos[legajo].calificaciones[mes] = {};
    for (let j = 3; j < headers.length - 1; j++) {
      datos[legajo].calificaciones[mes][headers[j]] = parseFloat(fila[j]) || 0;
    }
    datos[legajo].calificaciones[mes]["TOTAL"] = parseFloat(fila[headers.length - 1]) || 0;
  }
}

function renderCalificaciones(mesSeleccionado) {
  const calif = datos[usuarioActual]?.calificaciones || {};
  const categorias = ["Ded.Interna", "Roperia", "Asist.Diaria", "O.Interno", "Instruccion", "AAccidental", "Guardia", "P.Neg", "P.Esp", "TOTAL"];
  let html = "<table><tr><th>Mes</th>" + categorias.map(c => `<th>${c}</th>`).join("") + "</tr>";
  const ordenMeses = ["ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"];
  let totales = {};
  for (let c of categorias) totales[c] = 0;

  for (let mes of ordenMeses) {
    if (mesSeleccionado !== "ANUAL" && mes !== mesSeleccionado) continue;
    const fila = calif[mes];
    if (!fila) continue;
    html += `<tr><td>${mes}</td>`;
    for (let c of categorias) {
      const val = fila[c] || 0;
      html += `<td>${val}</td>`;
      totales[c] += val;
    }
    html += "</tr>";
  }

  if (mesSeleccionado === "ANUAL") {
    html += `<tr class="admin-total"><td><strong>TOTAL ANUAL</strong></td>`;
    for (let c of categorias) {
      html += `<td><strong>${totales[c].toFixed(2)}</strong></td>`;
    }
    html += "</tr>";
  }

  html += "</table>";
  const tabla = document.getElementById("tablaCalificaciones");
tabla.classList.remove("fade-refresh"); // reseteo por si ya estaba
void tabla.offsetWidth; // hack para forzar reflow
tabla.classList.add("fade-refresh");
  document.getElementById("tablaCalificaciones").innerHTML = html;
mostrarPorcentajeHT(usuarioActual);
}

function previsualizarCSV() {
  const archivo = document.getElementById("archivoCSV").files[0];
  if (!archivo) return alert("Selecciona un archivo CSV.");
  const lector = new FileReader();
  lector.onload = function(e) {
    const lineas = e.target.result.split("\n").filter(l => l.trim() !== "");
    let html = "<table>";
    for (let i = 0; i < lineas.length; i++) {
      const columnas = lineas[i].split(",");
      html += "<tr>" + columnas.map(col => `<td>${col}</td>`).join("") + "</tr>";
    }
    html += "</table>";
    document.getElementById("preview").innerHTML = html;
  };
  lector.readAsText(archivo);
}
function mostrarPorcentajeHT(usuarioId) {
  fetch('https://raw.githubusercontent.com/bomberosc80-app/calificaciones-c80/main/porcentajeht.csv')
    .then(res => res.text())
    .then(data => {
      const lineas = data.trim().split("\n").slice(1); // Omitir encabezado
      let porcentaje = null;

      for (let linea of lineas) {
        const [id, valor] = linea.split(",");
        if (id === usuarioId) {
          porcentaje = parseFloat(valor);
          break;
        }
      }

      const div = document.getElementById("porcentajeAsistencias");

      if (porcentaje !== null) {
        div.textContent = `Porcentaje de Asistencias a intervenciones: ${porcentaje.toFixed(1)}%`;
        div.classList.remove("hidden");
      } else {
        div.textContent = "";
        div.classList.add("hidden");
      }
    })
    .catch(err => {
      console.error("Error al cargar porcentajeht.csv:", err);
    });
}
