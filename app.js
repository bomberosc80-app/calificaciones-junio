
document.addEventListener("DOMContentLoaded", () => {
  const datos = {
    usuarios: {
      "c80306": {
        CLAVE: "bvsp1959",
        NOMBRE: "Sergio"
      },
      "admin": {
        CLAVE: "admin123",
        NOMBRE: "Administrador"
      }
    }
  };

  let usuarioActual = null;
  let calificaciones = [];

  async function cargarCSV() {
    try {
      const response = await fetch("calificaciones.csv");
      const text = await response.text();
      const lines = text.trim().split("\n");
      const headers = lines[0].split(",");
      calificaciones = lines.slice(1).map(line => {
        const values = line.split(",");
        const entry = {};
        headers.forEach((h, i) => entry[h] = values[i]);
        return entry;
      });
    } catch (error) {
      console.error("Error cargando CSV:", error);
    }
  }

  window.iniciarSesion = async function() {
    const usuario = document.getElementById("usuario").value.trim();
    const clave = document.getElementById("clave").value.trim();
    const user = datos.usuarios[usuario];
    if (user && user.CLAVE === clave) {
      usuarioActual = usuario;
      await cargarCSV();
      document.getElementById("login").classList.add("hidden");
      document.getElementById("app").classList.remove("hidden");
      document.getElementById("nombreUsuario").innerText = user.NOMBRE || usuario;
      if (usuario === "admin") {
        document.getElementById("adminPanel").classList.remove("hidden");
      }
      renderCalificaciones("ANUAL");
    } else {
      alert("Usuario o clave incorrectos.");
    }
  };

  window.cerrarSesion = function() {
    location.reload();
  };

  window.cambiarMes = function() {
    const mes = document.getElementById("selectorMes").value;
    renderCalificaciones(mes);
  };

  function renderCalificaciones(mesSeleccionado) {
    const userCalificaciones = calificaciones.filter(row => row.legajo === usuarioActual);
    if (mesSeleccionado === "ANUAL") {
      const meses = [
        "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
        "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
      ];
      let html = "<table><tr><th>Mes</th><th>Ded. Interna</th><th>Ropería</th><th>Asist. Diaria</th><th>O. Interno</th><th>Instrucción</th><th>Accidental</th><th>Guardia</th><th>P. Neg</th><th>P. Esp</th><th>Total</th></tr>";
      let sumaTotal = 0, count = 0;
      meses.forEach(mes => {
        const fila = userCalificaciones.find(row => row.mes === mes);
        if (fila) {
          html += `<tr><td>${mes}</td><td>${fila["Ded.Interna"]}</td><td>${fila["Roperia"]}</td><td>${fila["Asist.Diaria"]}</td><td>${fila["O.Interno"]}</td><td>${fila["Instruccion"]}</td><td>${fila["AAccidental"]}</td><td>${fila["Guardia"]}</td><td>${fila["P.Neg"]}</td><td>${fila["P.Esp"]}</td><td>${fila["TOTAL"]}</td></tr>`;
          sumaTotal += parseFloat(fila["TOTAL"]) || 0;
          count++;
        }
      });
      const promedio = count > 0 ? (sumaTotal / count).toFixed(2) : "-";
      html += `<tr><th colspan="10">Promedio</th><th>${promedio}</th></tr></table>`;
      document.getElementById("tablaCalificaciones").innerHTML = html;
    } else {
      const fila = userCalificaciones.find(row => row.mes === mesSeleccionado);
      if (fila) {
        const html = `<table><tr><th>Ded. Interna</th><th>Ropería</th><th>Asist. Diaria</th><th>O. Interno</th><th>Instrucción</th><th>Accidental</th><th>Guardia</th><th>P. Neg</th><th>P. Esp</th><th>Total</th></tr>
          <tr><td>${fila["Ded.Interna"]}</td><td>${fila["Roperia"]}</td><td>${fila["Asist.Diaria"]}</td><td>${fila["O.Interno"]}</td><td>${fila["Instruccion"]}</td><td>${fila["AAccidental"]}</td><td>${fila["Guardia"]}</td><td>${fila["P.Neg"]}</td><td>${fila["P.Esp"]}</td><td>${fila["TOTAL"]}</td></tr></table>`;
        document.getElementById("tablaCalificaciones").innerHTML = html;
      } else {
        document.getElementById("tablaCalificaciones").innerHTML = "<p>No hay datos para ese mes.</p>";
      }
    }
  }

  window.previsualizarCSV = function () {
    const input = document.getElementById("csvInput");
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      const lines = text.trim().split("\n");
      const headers = lines[0].split(",");
      const rows = lines.slice(1).map(line => line.split(","));

      let html = "<table><tr>";
      headers.forEach(h => html += `<th>${h}</th>`);
      html += "</tr>";
      rows.forEach(r => {
        html += "<tr>";
        r.forEach(val => html += `<td>${val}</td>`);
        html += "</tr>";
      });
      html += "</table>";
      document.getElementById("previewTable").innerHTML = html;
    };
    reader.readAsText(file);
  };
});
