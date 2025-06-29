let datos = {
  usuarios: {
    "c80306": { CLAVE: "bvsp1959", NOMBRE: "Sergio" },
    "admin": { CLAVE: "admin123", NOMBRE: "Administrador" },
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
    document.getElementById("nombreUsuario").innerText = user.NOMBRE;

    if (usuario === "admin") {
      document.getElementById("adminPanel").classList.remove("hidden");
    }

    await cargarCSV();
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

async function cargarCSV() {
  const url = "calificaciones.csv";
  const response = await fetch(url);
  const data = await response.text();
  const rows = data.split("\n").filter(r => r.trim() !== "");
  const headers = rows[0].split(",").map(h => h.trim());
  calificaciones = rows.slice(1).map(row => {
    const cols = row.split(",");
    const obj = {};
    headers.forEach((h, i) => obj[h] = cols[i]);
    return obj;
  });
}

function renderCalificaciones(mes) {
  const tabla = document.getElementById("tablaCalificaciones");
  if (!calificaciones.length) {
    tabla.innerHTML = "<p>No hay datos cargados.</p>";
    return;
  }

  const filtradas = mes === "ANUAL" ? calificaciones : calificaciones.filter(f => f.mes === mes);
  let html = "<table><tr><th>Legajo</th><th>Nombre</th><th>Ded. Interna</th><th>Ropería</th><th>Asist. Diaria</th><th>O. Interno</th><th>Instrucción</th><th>AAccidental</th><th>Guardia</th><th>P.Neg</th><th>P.Esp</th><th>TOTAL</th></tr>";

  let suma = {
    ded: 0, rop: 0, asist: 0, oint: 0, instr: 0, aacc: 0, guard: 0, pneg: 0, pesp: 0, total: 0
  };

  filtradas.forEach(f => {
    html += `<tr>
      <td>${f.legajo}</td>
      <td>${f.nombre}</td>
      <td>${f["Ded.Interna"]}</td>
      <td>${f["Roperia"]}</td>
      <td>${f["Asist.Diaria"]}</td>
      <td>${f["O.Interno"]}</td>
      <td>${f["Instruccion"]}</td>
      <td>${f["AAccidental"]}</td>
      <td>${f["Guardia"]}</td>
      <td>${f["P.Neg"]}</td>
      <td>${f["P.Esp"]}</td>
      <td>${f["TOTAL"]}</td>
    </tr>`;
    suma.ded += parseFloat(f["Ded.Interna"] || 0);
    suma.rop += parseFloat(f["Roperia"] || 0);
    suma.asist += parseFloat(f["Asist.Diaria"] || 0);
    suma.oint += parseFloat(f["O.Interno"] || 0);
    suma.instr += parseFloat(f["Instruccion"] || 0);
    suma.aacc += parseFloat(f["AAccidental"] || 0);
    suma.guard += parseFloat(f["Guardia"] || 0);
    suma.pneg += parseFloat(f["P.Neg"] || 0);
    suma.pesp += parseFloat(f["P.Esp"] || 0);
    suma.total += parseFloat(f["TOTAL"] || 0);
  });

  html += `<tr style="font-weight:bold;background:#222;">
    <td colspan="2">Totales</td>
    <td>${suma.ded.toFixed(2)}</td>
    <td>${suma.rop.toFixed(2)}</td>
    <td>${suma.asist.toFixed(2)}</td>
    <td>${suma.oint.toFixed(2)}</td>
    <td>${suma.instr.toFixed(2)}</td>
    <td>${suma.aacc.toFixed(2)}</td>
    <td>${suma.guard.toFixed(2)}</td>
    <td>${suma.pneg.toFixed(2)}</td>
    <td>${suma.pesp.toFixed(2)}</td>
    <td>${suma.total.toFixed(2)}</td>
  </tr>`;

  html += "</table>";
  tabla.innerHTML = html;
}

function previsualizarCSV() {
  const input = document.getElementById("fileInput");
  const reader = new FileReader();
  reader.onload = function (e) {
    const preview = e.target.result.split("\n").slice(0, 5).join("\n");
    document.getElementById("previewContainer").innerText = preview;
  };
  if (input.files.length) {
    reader.readAsText(input.files[0]);
  }
}

function confirmarCarga() {
  alert("Carga confirmada. (Simulado, ya que el navegador no puede escribir archivos en el servidor)");
}
