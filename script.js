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
    // DATOS DE EJEMPLO, PENDIENTES DE REEMPLAZAR

    const radar = (id) =>
        new Chart(document.getElementById(id), {
            type: "radar",

            data: {
                labels: [
                    "Enero",
                    "Febrero",
                    "Marzo",
                    "Abril",
                    "Mayo",
                    "Junio",
                    "Julio"
                ],

                datasets: [
                    {
                        label: "Origen",

                        data: [
                            65, 59, 80, 81, 56, 55, 40
                        ],

                        borderColor: "rgb(54, 162, 235)",

                        backgroundColor: "rgba(54, 162, 235, 0.2)"
                    },

                    {
                        label: "Destino",

                        data: [
                            28, 48, 40, 19, 96, 27, 100
                        ],

                        borderColor: "rgb(255, 99, 132)",

                        backgroundColor: "rgba(255, 99, 132, 0.2)"
                    }
                ]
            }
        });

    radar("comparaUniversidades");
    radar("comparaEscuelas");

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
