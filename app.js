
const datos = {
  usuarios: {
    "c80306": { CLAVE: "bvsp1959", NOMBRE: "Sergio" },
    "juan23": { CLAVE: "1234", NOMBRE: "Juan Pérez" },
    "admin": { CLAVE: "admin123", NOMBRE: "Administrador" }
  }
};

let usuarioActual = null;
let calificaciones = [];

function iniciarSesion() {
  const usuario = document.getElementById("usuario").value.trim();
  const clave = document.getElementById("clave").value.trim();

  const user = datos.usuarios[usuario];
  if (user && user.CLAVE === clave) {
    usuarioActual = usuario;
    document.getElementById("login").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    document.getElementById("nombreUsuario").innerText = user.NOMBRE || usuario;

    if (usuario === "admin") {
      document.getElementById("adminPanel").classList.remove("hidden");
    }

    cargarCalificaciones();
  } else {
    alert("Usuario o clave incorrectos.");
  }
}

function cerrarSesion() {
  usuarioActual = null;
  document.getElementById("login").classList.remove("hidden");
  document.getElementById("app").classList.add("hidden");
  document.getElementById("adminPanel").classList.add("hidden");
  document.getElementById("tablaCalificaciones").innerHTML = "";
}

function cargarCalificaciones() {
  fetch("calificaciones.csv")
    .then(res => res.text())
    .then(data => {
      const rows = data.trim().split("\n").map(row => row.split(","));
      const headers = rows[0];
      calificaciones = rows.slice(1).map(row => {
        let obj = {};
        headers.forEach((h, i) => obj[h.trim()] = row[i]?.trim());
        return obj;
      });
      cambiarMes();
    })
    .catch(err => console.error("Error cargando CSV:", err));
}

function cambiarMes() {
  const mes = document.getElementById("selectorMes").value;
  renderCalificaciones(mes);
}

function renderCalificaciones(mesSeleccionado) {
  let datosFiltrados = calificaciones.filter(c => c.mes === mesSeleccionado || mesSeleccionado === "ANUAL");
  if (usuarioActual !== "admin") {
    datosFiltrados = datosFiltrados.filter(c => c.legajo === usuarioActual.toUpperCase());
  }

  let html = "<table><tr>";
  const columnas = ["legajo", "nombre", "mes", "Ded.Interna", "Roperia", "Asist.Diaria", "O.Interno", "Instruccion", "AAccidental", "Guardia", "P.Neg", "P.Esp", "TOTAL"];
  columnas.forEach(col => html += `<th>${col}</th>`);
  html += "</tr>";

  datosFiltrados.forEach(row => {
    html += "<tr>";
    columnas.forEach(col => html += `<td>${row[col] || ""}</td>`);
    html += "</tr>";
  });

  html += "</table>";
  document.getElementById("tablaCalificaciones").innerHTML = html;
}

function previsualizarCSV() {
  const input = document.getElementById("csvInput");
  const file = input.files[0];
  if (!file) return alert("Selecciona un archivo CSV.");

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    const rows = text.trim().split("\n").map(row => row.split(","));
    let html = "<table><tr>";
    rows[0].forEach(col => html += `<th>${col}</th>`);
    html += "</tr>";
    rows.slice(1).forEach(row => {
      html += "<tr>";
      row.forEach(cell => html += `<td>${cell}</td>`);
      html += "</tr>";
    });
    html += "</table>";
    document.getElementById("preview").innerHTML = html;
  };
  reader.readAsText(file);
}
