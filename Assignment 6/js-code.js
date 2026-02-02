let chart;
let selectedMunicipality = "SSS";

const jsonQuery = {
    "query": [
        {
            "code": "Vuosi",
            "selection": {
                "filter": "item",
                "values": [
                    "2000",
                    "2001",
                    "2002",
                    "2003",
                    "2004",
                    "2005",
                    "2006",
                    "2007",
                    "2008",
                    "2009",
                    "2010",
                    "2011",
                    "2012",
                    "2013",
                    "2014",
                    "2015",
                    "2016",
                    "2017",
                    "2018",
                    "2019",
                    "2020",
                    "2021"
                ]
            }
        },
        {
            "code": "Alue",
            "selection": {
                "filter": "item",
                "values": [
                    "SSS"
                ]
            }
        },
        {
            "code": "Tiedot",
            "selection": {
                "filter": "item",
                "values": [
                    "vaesto"
                ]
            }
        }
    ],
    "response": {
        "format": "json-stat2"
    }
}

const url = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";

async function getData() {
    const res = await fetch(url,{
        method: "POST",
        headers: {"content-type":"application/json"},
        body:JSON.stringify(jsonQuery)
    })
    const data = await res.json();
    return data;
}


const buildChart = async () => {
    
    const data = await getData();
    const years = Object.values(data.dimension.Vuosi.category.label);
    const values = data.value

    const res = []
    
    years.forEach((year, i) => {
        res[i] = {
            year: year,
            population: values[i]
        }
    })

    console.log(res)

    const chartData = {
        labels: years,
        datasets: [{
            name: "Population",
            values: values
        }
     ]
    }

    chart = new frappe.Chart("#chart" ,{
        title: "Municipality Growth",
        data: chartData,
        type: 'line',
        height: 450,
        colors: ['#eb5146']
    })

}

buildChart();

console.log("Chart created!")

//---------------------------------------------------------

const forum = document.getElementById("forum")

forum.addEventListener("submit", updateChart)

async function updateChart(event) {
    event.preventDefault();

    const municipality = document.getElementById("input-area");
    const selectedMunicipality = municipality.value.trim();

    // Get all municipality codes
    console.log("Aquí 1")
    jsonQuery.query.find(q => q.code === "Alue").selection = { filter: "all" };
    console.log("Aquí 2")
    const initialData = await getData(); //
    console.log("Aquí 3")

    const areas = Object.values(initialData.dimension.Alue.category.label);
    const codes = Object.keys(initialData.dimension.Alue.category.label);

    const i = areas.findIndex(
        area => area.toLowerCase() === selectedMunicipality.toLowerCase()
    );

    console.log(areas);
    console.log(codes);
    console.log(i);

    if (i !== -1) {
        const municipalitycode = codes[i];

        // Restore query to single municipality
        jsonQuery.query.find(q => q.code === "Alue").selection = {
            filter: "item",
            values: [municipalitycode]
        };

        console.log(jsonQuery)

        // Fetch new data
        const newData = await getData();
        const years = Object.values(newData.dimension.Vuosi.category.label);
        const values = newData.value;

        // Update chart
        chart.update({
            labels: years,
            datasets: [{ name: "Population", values }]
        });
    } else {
        console.log("Municipality not found!");
    }
}


