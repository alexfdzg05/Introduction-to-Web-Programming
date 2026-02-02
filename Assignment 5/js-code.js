const fetchData = async () => {
    const url = "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
    const res = await fetch(url);
    const data = await res.json();
    
    initMap(data);
} 

const initMap = (data) => {
    // minZoom se configura aquí
    let map = L.map('map', { minZoom: -3 });

    // Fondo OSM
    let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    // Capa GeoJSON
    let geoJson = L.geoJson(data, {
        style: getStyle,
        onEachFeature: getFeature
    }).addTo(map);

    // Ajusta la vista al GeoJSON
    map.fitBounds(geoJson.getBounds());
}

const getFeature = (feature, layer) => {
    if (!feature.properties.nimi) return;

    const name = feature.properties.nimi;

    console.log(name);

    layer.bindTooltip(name);

    // Buscar en el array por nombre
    const i = migrationValues.findIndex(m => m.name === name);
    if (i !== -1) {
        const data = migrationValues[i];
        layer.bindPopup(`<br>Positive: ${data.pos}<br>Negative: ${data.neg}`);
    }
}

const getStyle = (feature) => {

    const name = feature.properties.name;
    const i = migrationValues.findIndex(m => m.name === name);

    console.log(i)

    if (i === -1) return {color:`hsl(0, 0%, 80%)`, weight: 2}

    const pos = migrationValues[i].pos;
    const neg = migrationValues[i].neg;
    if (neg === 0) return {color:`hsl(120, 75%, 50%)`, weight: 2}

    
    let hue = Math.pow((pos / neg), 3) * 60;
    if (hue > 120) hue = 120;
    
    console.log(hue);

    return {color:`hsl(${hue}, 75%, 50%)`, weight: 2};
};


fetchData();


let migrationValues = []


//------------------------------------------------------------------------------------------------------

const migrationUrl = "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/muutl/statfin_muutl_pxt_11a2.px";

const fetchStatFinData = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(body)
  });
  return await response.json();
};


// ---------------------------------------------
const init = async () => {
    const migrationBody = await (await fetch("./migration_data_query.json")).json();
    const migrationData = await fetchStatFinData(migrationUrl, migrationBody);

    const labels = migrationData.dimension.Alue.category.label;
    const values = migrationData.value;
    let i = 0;
    for (let code in labels) {
        migrationValues.push({
            name: labels[code],
            pos: values[i],
            neg: values[i+1]
        });
        i += 2;
    }

    const url = "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
    const res = await fetch(url);
    const data = await res.json();
}

init();


