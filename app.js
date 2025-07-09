let datos = {};
const usuarios = {
  "80306": { CLAVE: "1234", NOMBRE: "Sergio" },
  "admin": { CLAVE: "admin123", NOMBRE: "Administrador" },
  "80306": { CLAVE: "1234", NOMBRE: "Sergio" },
  "80218": { CLAVE: "MONO218", NOMBRE: "Marcos" },
  "80211": { CLAVE: "U598983", NOMBRE: "Roman" },
  "80191": { CLAVE: "C80191", NOMBRE: "Luis" },
  "80190": { CLAVE: "C80190", NOMBRE: "Andrea" },
  "80225": { CLAVE: "C80225", NOMBRE: "Juan" },
  "80217": { CLAVE: "VN217", NOMBRE: "Vanesa" },
  "80224": { CLAVE: "C80224", NOMBRE: "Angel" },
  "80216": { CLAVE: "coky80216", NOMBRE: "Oscar" },
  "80248": { CLAVE: "DONI2025", NOMBRE: "Jonathan" },
  "80263": { CLAVE: "luis123", NOMBRE: "Luis" },
  "80229": { CLAVE: "C80229", NOMBRE: "Roberto" },
  "80235": { CLAVE: "C80235", NOMBRE: "Alejandro" },
  "80226": { CLAVE: "juli226", NOMBRE: "Juliana" },
  "80227": { CLAVE: "C80227", NOMBRE: "Alejandro" },
  "80228": { CLAVE: "MV2122", NOMBRE: "Vanesa" },
  "80252": { CLAVE: "C80252", NOMBRE: "Nicolas" },
  "80272": { CLAVE: "Depalma2152", NOMBRE: "Cristian" },
  "80273": { CLAVE: "Santi273", NOMBRE: "Santiago" },
  "80274": { CLAVE: "C80274", NOMBRE: "Nestor" },
  "80275": { CLAVE: "Hugo", NOMBRE: "Hugo" },
  "80277": { CLAVE: "C80277", NOMBRE: "Natalia" },
  "80299": { CLAVE: "C80299", NOMBRE: "Alejo" },
  "80161": { CLAVE: "RMM16180", NOMBRE: "Rodolfo" },
  "80232": { CLAVE: "CATA8032", NOMBRE: "Jose" },
  "80258": { CLAVE: "DAM10", NOMBRE: "Ivan" },
  "80260": { CLAVE: "1601BVSP", NOMBRE: "Gonzalo" },
  "80172": { CLAVE: "MA172", NOMBRE: "Mario" },
  "80271": { CLAVE: "C80271", NOMBRE: "Gabriel" },
  "80280": { CLAVE: "MAIDANA280", NOMBRE: "Lucas" },
  "80285": { CLAVE: "C80285", NOMBRE: "Alexis" },
  "80286": { CLAVE: "091120F", NOMBRE: "Carla" },
  "80297": { CLAVE: "1a2b3c4d5e", NOMBRE: "Angel" },
  "80300": { CLAVE: "C80300", NOMBRE: "Maximiliano" },
  "80301": { CLAVE: "LUANA147", NOMBRE: "Luana" },
  "80307": { CLAVE: "J2311", NOMBRE: "Jonathan" },
  "80308": { CLAVE: "Luki308", NOMBRE: "Lucas" },
  "80309": { CLAVE: "LOLA309", NOMBRE: "Natasha" },
  "80311": { CLAVE: "NAHU311", NOMBRE: "Nahuel" },
  "80312": { CLAVE: "NERINA312", NOMBRE: "Nerina" },
  "80316": { CLAVE: "Chachi15", NOMBRE: "Georgina" },
  "80317": { CLAVE: "CLAU1984", NOMBRE: "Claudio" },
  "80318": { CLAVE: "cele534593Be", NOMBRE: "Celeste" },
  "80319": { CLAVE: "Giovanna2016", NOMBRE: "Ivan" },
  "80321": { CLAVE: "Felipe14", NOMBRE: "Mauro" },
  "80322": { CLAVE: "Ernesto322", NOMBRE: "Ernesto" },
  "80326": { CLAVE: "Flor2025", NOMBRE: "Florencia" },
  "80327": { CLAVE: "nico.327", NOMBRE: "Nicolas" },
  "80328": { CLAVE: "NOS18285", NOMBRE: "Nicolas" },
  "80329": { CLAVE: "EMMA2018", NOMBRE: "Matias" },
  "80330": { CLAVE: "G1745", NOMBRE: "Gisela" },
  "80331": { CLAVE: "37106585N", NOMBRE: "Geronimo" },
  "80332": { CLAVE: "EMMABENJA332", NOMBRE: "Lucas" },
  "80334": { CLAVE: "THAIS11", NOMBRE: "Milagros" },
  "80335": { CLAVE: "xiorenaz", NOMBRE: "Ivana" },
  "80336": { CLAVE: "C80336", NOMBRE: "Walter" },
  "80338": { CLAVE: "MELLIS02", NOMBRE: "Ricardi Carlos" },
  "80220": { CLAVE: "80220", NOMBRE: "Marcos" },
  "80207": { CLAVE: "80207", NOMBRE: "Omar" },
  "80182": { CLAVE: "80182", NOMBRE: "Jorge" },
  "80221": { CLAVE: "80221", NOMBRE: "Marisa" },
  "80236": { CLAVE: "80236", NOMBRE: "Damian" },
  "80219": { CLAVE: "80219", NOMBRE: "Nicolas" },
  "80238": { CLAVE: "80238", NOMBRE: "David" },
  "80241": { CLAVE: "80241", NOMBRE: "Analia" },
  "80269": { CLAVE: "80269", NOMBRE: "Maria" },
  "80292": { CLAVE: "80292", NOMBRE: "Silvina" },
  "80302": { CLAVE: "80302", NOMBRE: "Nicolas" },
  "80310": { CLAVE: "80310", NOMBRE: "Juan Cruz" },
  "80313": { CLAVE: "80313", NOMBRE: "Dana" },
  "80315": { CLAVE: "80315", NOMBRE: "Macarena" },
  "80320": { CLAVE: "80320", NOMBRE: "Elizabeth" },
  "80333": { CLAVE: "80333", NOMBRE: "Irina" }
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
  const categorias = ["Ded.Interna", "Roperia", "Asist.Diaria", "O.Interno", "Instruccion", "Asis. Oblig", "AAccidental", "Guardia", "P.Neg", "P.Esp", "TOTAL"];
  const ordenMeses = ["ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"];
  let totales = {};
  for (let c of categorias) totales[c] = 0;

  let html = `
    <table>
      <thead>
        <tr><th>Mes</th>${categorias.map(c => `<th>${c}</th>`).join("")}</tr>
      </thead>
      <tbody>
  `;

  for (let mes of ordenMeses) {
    if (mesSeleccionado !== "ANUAL" && mes !== mesSeleccionado) continue;
    const fila = calif[mes];
    if (!fila) continue;

    html += `<tr><td>${mes}</td>`;
    for (let c of categorias) {
      const val = parseFloat(fila[c]) || 0;
      html += `<td>${val.toFixed(2)}</td>`;
      totales[c] += val;
    }
    html += `</tr>`;
  }

  if (mesSeleccionado === "ANUAL") {
    html += `<tr class="admin-total"><td><strong>TOTAL ANUAL</strong></td>`;
    for (let c of categorias) {
      html += `<td><strong>${totales[c].toFixed(2)}</strong></td>`;
    }
    html += `</tr>`;
  }

  html += `
    </tbody>
  </table>
  <div class="firma-digital-horizontal fade-in">
    <hr class="linea-firma">
    <span class="icono-firma">🖊️</span>
    Firmado digitalmente por:
    <br>
    <img src="https://bomberosc80-app.github.io/calificaciones-junio/firma.png" alt="Firma Jefe" class="imagen-firma" draggable="false">
  </div>

  `;

  const tabla = document.getElementById("tablaCalificaciones");
  tabla.innerHTML = html;
  tabla.classList.remove("fade-refresh");
  void tabla.offsetWidth;
  tabla.classList.add("fade-refresh");

  mostrarPorcentajeHT(usuarioActual);
  document.getElementById("footer-app").classList.remove("oculto");

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
  fetch('https://raw.githubusercontent.com/bomberosc80-app/calificaciones-junio/main/porcentajeht.csv')
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

// Protección para imágenes: impedir arrastre y selección
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('img').forEach(img => {
    img.setAttribute('draggable', 'false');
    img.style.pointerEvents = 'none';
  });
});
