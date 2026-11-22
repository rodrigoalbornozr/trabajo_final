 document.addEventListener("DOMContentLoaded", () => {

    // DATOS DE LOS RANKINGS

    const datos = {
        universidades: {
            total: 1504,
            origen: 186,
            destino: 133
        },

        escuelas: {
            total: 303,
            origen: 175,
            destino: 96
        }
    };

    // MOSTRAR NÚMEROS EN LOS PÁRRAFOS

    document.querySelectorAll("[data-dato]").forEach((el) => {
        const [grupo, campo] = el.dataset.dato.split(".");
        el.textContent = datos[grupo][campo];
    });

    // CUADRÍCULAS DE RANKING

    const ranking = (id, { total, origen, destino }) => {

        const min = Math.min(origen, destino);
        const max = Math.max(origen, destino);

        const celdas = Array.from({ length: total }, (_, i) => {

            const n = i + 1;

            const clase =
                n === destino ? "destino" :
                n === origen ? "origen" :
                n > min && n < max ? "entre" : "";

            return `<span class="${clase}">${n}</span>`;
        });

        document.getElementById(id).innerHTML = celdas.join("");
    };

    ranking("universidades", datos.universidades);
    ranking("escuelas", datos.escuelas);

    // GRÁFICOS DE RADAR

    const azul = "rgb(0, 0, 255)";
    const rojo = "rgb(255, 0, 0)";

    const radares = {

        comparaUniversidades: {
            labels: [
                ["Reputación", "académica"],
                ["Reputación", "empleadores"],
                ["Relación", "docente-estudiante"],
                ["Citas por", "docente"],
                ["Docentes", "internacionales"],
                ["Estudiantes", "internacionales"],
                ["Red de investigación", "internacional"],
                ["Resultados de", "empleabilidad"],
                "Sostenibilidad"
            ],
            origen:  { nombre: "Universidad de Chile",      datos: [92.0, 85.1, 9.9, 16.0, 10.6, 8.2, 76.8, 95.7, 66.4] },
            destino: { nombre: "Universidade de São Paulo", datos: [97.4, 71.3, 26.9, 34.4, 6.4, 3.7, 96.5, 96.8, 89.7] }
        },

        comparaEscuelas: {
            labels: [
                ["Reputación académica", "(peso 90%)"],
                ["Reputación empleadores", "(peso 10%)"],
                ["Citas por paper", "(peso 0%)"],
                ["H-index", "(peso 0%)"],
                ["Red de investigación", "internacional (peso 0%)"]
            ],
            origen:  { nombre: "Diseño, Universidad de Chile",   datos: [52.5, 78.5, null, null, null] },
            destino: { nombre: "FAU, Universidade de São Paulo", datos: [58.8, 73.2, null, null, null] }
        }
    };

    Chart.defaults.font.family = '"Bricolage Grotesque", Helvetica, Arial, sans-serif';
    Chart.defaults.color = "rgb(60, 60, 60)";

    const radar = (id, { labels, origen, destino }) => {

        if (!labels.length) return;

        const serie = ({ nombre, datos }, color, relleno) => ({
            label: nombre,
            data: datos.map((v) => v ?? 0),
            original: datos,
            borderColor: color,
            backgroundColor: relleno,
            borderWidth: 2,
            pointBackgroundColor: color,
            pointRadius: 3
        });

        return new Chart(document.getElementById(id), {
            type: "radar",

            data: {
                labels,
                datasets: [
                    serie(origen, azul, "rgba(0, 0, 255, 0.12)"),
                    serie(destino, rojo, "rgba(255, 0, 0, 0.12)")
                ]
            },

            options: {
                responsive: true,
                maintainAspectRatio: true,

                interaction: {
                    mode: "index",
                    intersect: true
                },

                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        ticks: {
                            stepSize: 20,
                            backdropColor: "transparent"
                        },
                        angleLines: { color: "rgba(0, 0, 0, 0.15)" },
                        grid: { color: "rgba(0, 0, 0, 0.15)" },
                        pointLabels: { font: { size: 11 } }
                    }
                },

                plugins: {
                    legend: { position: "bottom" },
                    tooltip: {
                        filter: (item) =>
                            item.dataset.original[item.dataIndex] !== null,
                        callbacks: {
                            label: (ctx) => {
                                const v = ctx.dataset.original[ctx.dataIndex];
                                return `${ctx.dataset.label}: ${v === null ? "no se pondera en Arte y Diseño" : v}`;
                            }
                        }
                    }
                }
            }
        });
    };

    Object.entries(radares).forEach(([id, config]) => radar(id, config));

    // MAPA DE SÃO PAULO

    const map = L.map("map").setView(
        [-23.5613991, -46.7307891],
        9
    );

    L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        {
            maxZoom: 16,
            attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
        }
    ).addTo(map);

    L.marker([-23.5613991, -46.7307891])
        .addTo(map)
        .bindPopup(
            "<b>Universidade de São Paulo</b><br>(USP)."
        )
        .openPopup();

});