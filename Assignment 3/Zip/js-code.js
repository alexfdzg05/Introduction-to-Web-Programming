const populationUrl = "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/vaerak/statfin_vaerak_pxt_11ra.px";

const employmentUrl = "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/tyokay/statfin_tyokay_pxt_115b.px";

const fetchStatFinData = async (url, body) => {
const response = await fetch(url, {
    method: "POST",
    headers: {
        "Content-type": "application/json"
    },
    body: JSON.stringify(body)

});
    return await response.json();
};

const setUpTable = (populationData,employmentData) => {
    const tbody = document.querySelector("#tbody");

    const municipalities = populationData.dimension.Alue.category.label;
    const popValues = populationData.value;
    const employValues = employmentData.value;


    Object.keys(municipalities).forEach((population, index) => {
    const pop = popValues[index];
    const empl = employValues[index];
    const row = document.createElement("tr");

    const municipality = document.createElement("td");
    municipality.textContent = municipalities[population];

    const populationCell = document.createElement("td");
    populationCell.textContent = pop;

    const employmentCell = document.createElement("td")
    employmentCell.textContent = empl;

    //5. conditional sytling 
    const percentEmploymentCell = document.createElement("td")
    var percentEmployment = ((empl/pop) * 100).toFixed(2);
    console.log(percentEmployment)
    percentEmploymentCell.textContent = percentEmployment + "%";

    row.appendChild(municipality);
    row.appendChild(populationCell);
    row.appendChild(employmentCell);
    row.appendChild(percentEmploymentCell);
    tbody.appendChild(row);

    const percentage = Math.round(percentEmployment);
    if(percentage > 45){
        //sets color from css file
        row.classList.add("higher");
        row.style.backgroundColor = "#abffbd";
    }
    else if(percentage < 25){
        row.classList.add("lower");
        row.style.backgroundColor = "#ff9e9e";
    }
  });

};


const initializeCode = async() => {
    const populationBody = await (await fetch("./population_query.json")).json();
    const employmentBody = await (await fetch("./employment_query.json")).json();
    const populationData = await fetchStatFinData(populationUrl,populationBody);
    const employmentData = await fetchStatFinData(employmentUrl,employmentBody);
    setUpTable(populationData,employmentData);
}

document.addEventListener("DOMContentLoaded", initializeCode);
