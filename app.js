
const datos = {
  usuarios: {
    "c80306": { CLAVE: "bvsp1959", NOMBRE: "Administrador" },
    "juan23": { CLAVE: "1234", NOMBRE: "Juan Pérez" }
  }
};

let usuarioActual = null;
let calificaciones = [];

function iniciarSesion() {
  const user = document.getElementById("usuario").value.trim();
  const pass = document.getElementById("clave").value.trim();
  if (datos.usuarios[user] && datos.usuarios[user].CLAVE === pass) {
    usuarioActual = user;
    document.getElementById("login").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    document.getElementById("nombreUsuario").textContent = datos.usuarios[user].NOMBRE;
    if (user === "c80306") {
      document.getElementById("adminPanel").classList.remove("hidden");
    }
    cargarCSV();
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

function cargarCSV() {
  fetch("calificaciones.csv")
    .then(response => response.text())
    .then(data => {
      const lines = data.split("\n").filter(line => line.trim() !== "");
      const headers = lines[0].split(",");
      calificaciones = lines.slice(1).map(line => {
        const obj = {};
        line.split(",").forEach((val, i) => {
          obj[headers[i]] = val;
        });
        return obj;
      });
      cambiarMes();
    });
}

function cambiarMes() {
  const mes = document.getElementById("selectorMes").value;
  const user = usuarioActual;
  const tabla = document.getElementById("tablaCalificaciones");
  let html = "<table><tr>";
  if (mes === "ANUAL") {
    html += "<th>Mes</th><th>Total</th></tr>";
    const meses = ["ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"];
    let suma = 0, count = 0;
    meses.forEach(m => {
      const row = calificaciones.find(r => r.legajo === user.toUpperCase() && r.mes === m);
      if (row) {
        html += `<tr><td>${m}</td><td>${row.TOTAL}</td></tr>`;
        suma += parseFloat(row.TOTAL);
        count++;
      }
    });
    const promedio = count ? (suma / count).toFixed(2) : "-";
    html += `<tr><th>Promedio</th><th>${promedio}</th></tr>`;
  } else {
    const row = calificaciones.find(r => r.legajo === user.toUpperCase() && r.mes === mes);
    if (row) {
      html += Object.keys(row).filter(k => k !== "__parsed_extra").map(k => `<th>${k}</th>`).join("");
      html += "</tr><tr>";
      html += Object.keys(row).filter(k => k !== "__parsed_extra").map(k => `<td>${row[k]}</td>`).join("");
    } else {
      html += "<td colspan='13'>Sin datos</td>";
    }
  }
  html += "</tr></table>";
  tabla.innerHTML = html;
}

function previsualizarCSV() {
  const input = document.getElementById("csvFileInput");
  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    const lines = text.split("\n").filter(line => line.trim() !== "");
    const headers = lines[0].split(",");
    const rows = lines.slice(1).map(line => line.split(","));

    let html = "<table><tr>" + headers.map(h => `<th>${h}</th>`).join("") + "</tr>";
    for (let r of rows) {
      html += "<tr>" + r.map(cell => `<td>${cell}</td>`).join("") + "</tr>";
    }
    html += "</table>";
    document.getElementById("preview").innerHTML = html;
  };
  if (input.files[0]) reader.readAsText(input.files[0]);
}
