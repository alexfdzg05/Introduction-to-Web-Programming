let base = "USD";
let currency = "EUR"
let amount = "1"
let start_date = "2005-12-09"
let end_date = "2005-12-12"
let accuracy = "day"


let PhysicalSymbolsUrl = "https://api.fxratesapi.com/currencies?format=json" 

const apiKey = '5425976f22de41e3b8906699bbaf7ba4';
let symbolsUrl = `https://api.currencyfreaks.com/v2.0/currency-symbols?apikey=${apiKey}`; 

const TimeSerieDataUrl = "https://api.fxratesapi.com/timeseries?start_date="+start_date+"&end_date="+end_date+"&accuracy="+accuracy+"&currencies="+currency+"&base="+base+"&format=JSON&places=3&amount="+amount


const fetchSymbols = async () => {
    const res = await fetch(symbolsUrl);
    const data = await res.json();
    return data.currencySymbols; 
}

const fetchPhysicalSymbols = async () => {
    const res = await fetch(PhysicalSymbolsUrl);
    const data = await res.json();
    return new Set(Object.keys(data)); // AI
}

const fetchDataTimeSerie = async () => {
    const res = await fetch(TimeSerieDataUrl);
    const data = await res.json();
    if (!data.success){
        return null;
    }
    return data.root;
}

const fetchDataConvert = async () => {
    const url = `https://api.fxratesapi.com/convert?from=${currency}&to=${base}&format=JSON&places=3&amount=${amount}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.result;
}

// --------------------Slider----------------------------

const options = ["1 day", "1 week", "1 month", "3 month", "6 month", "1 year", "5 years", "10 years", "20 years"];

const slider = document.getElementById("mySlider");
const output = document.getElementById("sliderValue");

output.textContent = options[slider.value];

slider.addEventListener("input", () => {
    output.textContent = options[slider.value];
});

//----------------------Init------------------------------
init();

async function init() {
    updateSymbols()
}

// ----- If simplified currencies, then update the symbols to choose ----

const checkbox = document.getElementById("simplified");
checkbox.addEventListener("change", updateSymbols);

async function updateSymbols() {
    const symbols = await fetchSymbols(); //CurrencyFreaks
    const physicalSymbols = await fetchPhysicalSymbols(); //FxRates

    const baseSelect = document.getElementById("base");
    const currencySelect = document.getElementById("currency");

    // Clear previous options
    baseSelect.innerHTML = '';
    currencySelect.innerHTML = '';

    const simplify = checkbox.checked;

    // Shared symbols → present in both APIs
    const sharedSymbols = Object.keys(symbols).filter(sym => physicalSymbols.has(sym)); // AI

    // Crypto-only symbols → present in crypto API but not in physical API
    const cryptoOnlySymbols = Object.keys(symbols).filter(sym => !physicalSymbols.has(sym)); // AI

    console.log("Shared symbols:", sharedSymbols);
    console.log("Crypto-only symbols:", cryptoOnlySymbols);

    // Helper to get the display name
    const getName = (obj) => (typeof obj === "object" ? obj.name : obj); // AI

    // Populate shared symbols
    for (const symbol of sharedSymbols) {
        const name = getName(symbols[symbol]);
        const displaySymbol = symbol

        const baseOption = document.createElement('option');
        baseOption.value = displaySymbol;
        baseOption.textContent = `${displaySymbol} - ${name}`;
        baseSelect.appendChild(baseOption);

        const currencyOption = document.createElement('option');
        currencyOption.value = displaySymbol;
        currencyOption.textContent = `${displaySymbol} - ${name}`;
        currencySelect.appendChild(currencyOption);
    }

    if(!simplify){
        // Populate crypto-only symbols; So both currencies will be used
        for (const symbol of cryptoOnlySymbols) {
            const name = getName(symbols[symbol]);
            const displaySymbol = symbol

            const baseOption = document.createElement('option');
            baseOption.value = displaySymbol;
            baseOption.textContent = `${displaySymbol} - ${name} (crypto)`;
            baseSelect.appendChild(baseOption);

            const currencyOption = document.createElement('option');
            currencyOption.value = displaySymbol;
            currencyOption.textContent = `${displaySymbol} - ${name} (crypto)`;
            currencySelect.appendChild(currencyOption);
        }
    }
}


// GetChart
const forum = document.getElementById('forum')

forum.addEventListener("submit", getChart)

async function getChart(event){
    event.preventDefault();
    start_date = document.getElementById("Initial-Date").value
    end_date = document.getElementById("End-Date").value
    base = document.getElementById("base").value
    currency = document.getElementById("currency").value

    let data1 = []
    let data2 = []

    let currentDate = new Date(start_date);
    let endDate = new Date(end_date);

    // Convert dates into format: YYYY-MM-DD
    const c = base;

    let n_days = 1;

    if(slider.value == 0){
        n_days = 1
    }else if(slider.value==1){
        n_days = 7
    }else if(slider.value==2){
        n_days = 30
    }else if(slider.value==3){
        n_days = 90
    }else if(slider.value==4){
        n_days = 120
    }else if(slider.value==5){
        n_days = 365
    }else if(slider.value==6){
        n_days = 365*5
    }else if(slider.value==7){
        n_days = 365*10
    }else if(slider.value==8){
        n_days = 365*20
    }

    while (currentDate <= endDate) {
        const formattedDate = formatDate(currentDate);

        // Fetch USD → EUR (o base → currency)
        const url1 = `https://api.fxratesapi.com/historical?currencies=${currency}&base=${base}&date=${formattedDate}&format=JSON&places=3&amount=${amount}`;
        const res1 = await fetch(url1);
        const json1 = await res1.json();
        if (json1 && json1.rates) {
            data1.push({
                date: formattedDate,
                rate: json1.rates[currency]
            });
        }

        // Fetch EUR → USD (o currency → base)
        const url2 = `https://api.fxratesapi.com/historical?currencies=${base}&base=${currency}&date=${formattedDate}&format=JSON&places=3&amount=${amount}`;
        const res2 = await fetch(url2);
        const json2 = await res2.json();
        if (json2 && json2.rates) {
            data2.push({
                date: formattedDate,
                rate: json2.rates[base]
            });
        }

        // Date increment
        currentDate.setDate(currentDate.getDate() + n_days);
    }

    if (data1.length > 0 && data2.length > 0) {
        // Get Dates and values
        const dates = data1.map(item => item.date);
        const valuesBaseToCurrency = data1.map(item => item.rate);
        const valuesCurrencyToBase = data2.map(item => item.rate);

        // build up chart
        const color1 = document.getElementById("Base-Color").value
        const color2 = document.getElementById("Currency-Color").value

        const chart = new frappe.Chart("#chart", {
            title: `${base} ↔ ${currency} Exchange Rates`,
            data: {
                labels: dates,
                datasets: [
                    {
                        name: `${base} → ${currency}`,
                        type: "line",
                        values: valuesBaseToCurrency,
                    },
                    {
                        name: `${currency} → ${base}`,
                        type: "line",
                        values: valuesCurrencyToBase,
                    }
                ],
            },
            type: "line",
            height: 600,
            colors: [color1, color2], 
            lineOptions: {regionFill: 1}
        });
        console.log(data1)
        console.log(data2)

    }else{
        const chart = document.getElementById("chart")
        if(chart){
            chart.innerHTML = "NO DATA AVAILABLE"
        }
    }
}

function formatDate(date) {
    return date.toISOString().split('T')[0]; //AI
}


// ----------------- CONVERSION CALCULATOR ---------------------------------------

async function fillPhysicalCurrencySelectors() {
    const firstSelect = document.getElementById("FirstCurrencyCalculator");
    const secondSelect = document.getElementById("SecondCurrencyCalculator");

    //Just in case
    firstSelect.innerHTML = "";
    secondSelect.innerHTML = "";

    const symbols = await fetchSymbols();             //CurrencyFreaks
    const physicalSymbols = await fetchPhysicalSymbols(); // FxRates

    const getName = (obj) => (typeof obj === "object" ? obj.name : obj); //AI

    // Filtrar solo monedas físicas
    const physicalOnlySymbols = Object.keys(symbols).filter(sym => physicalSymbols.has(sym)); //AI

    for (const symbol of physicalOnlySymbols) {
        const name = getName(symbols[symbol]);

        // Crear opción para el primer select
        const option1 = document.createElement("option");
        option1.value = symbol;
        option1.textContent = `${symbol} - ${name}`;
        firstSelect.appendChild(option1);

        // Crear opción para el segundo select
        const option2 = document.createElement("option");
        option2.value = symbol;
        option2.textContent = `${symbol} - ${name}`;
        secondSelect.appendChild(option2);
    }

    console.log("Loaded physical currencies:", physicalOnlySymbols.length);
}

// Llamada a la función
fillPhysicalCurrencySelectors();


firstCurrency = document.getElementById("FirstCurrencyCalculator")
secondCurrency = document.getElementById("SecondCurrencyCalculator")
amountCurrrency = document.getElementById("amountCurrency")

firstCurrency.addEventListener("change",updateValue)
secondCurrency.addEventListener("change",updateValue)
amountCurrency.addEventListener("change",updateValue)

async function updateValue(){
    currencyValue = document.getElementById("currencyValue")
    base = firstCurrency.value
    currency = secondCurrency.value
    amount = Number(amountCurrency.value) //AI

    let value = await fetchDataConvert()
    console.log(value)
    currencyValue.innerHTML = "Value: "+value
}





// ---------------------- CRYPTO PREDICTOR ---------------------------------------

fillCryptoSelect()


async function fillCryptoSelect() {
    const cryptoSelect = document.getElementById("crypto");
    cryptoSelect.innerHTML = ""; // limpia el select

    const symbols = await fetchSymbols();       // Crypto API completa
    const physicalSymbols = await fetchPhysicalSymbols(); // Set de monedas físicas
    const simplify = checkbox.checked;

    // Helper para obtener el nombre correctamente
    const getName = (obj) => (typeof obj === "object" ? obj.name : obj);

    // Solo criptomonedas: están en symbols pero no en physicalSymbols
    const cryptoOnlySymbols = Object.keys(symbols).filter(sym => !physicalSymbols.has(sym));

    // Rellenamos el select con las criptos
    for (const symbol of cryptoOnlySymbols) {
        const name = getName(symbols[symbol]);
        const displaySymbol = symbol

        const option = document.createElement("option");
        option.value = displaySymbol;
        option.textContent = `${displaySymbol} - ${name} (crypto)`;
        cryptoSelect.appendChild(option);
    }

    console.log("Loaded cryptos:", cryptoOnlySymbols.length);
}

const crypto = document.getElementById("crypto");
crypto.addEventListener("change", predict); 

const cryptoAmount = document.getElementById("amountCrypto")
cryptoAmount.addEventListener("change", predict)

async function predict() {
    currency = crypto.value; 
    console.log("Currency:", currency);

    base = "USD";
    amount = cryptoAmount.value
    accuracy = "day";

    // The following code would have been used for predictions, as the only thing I needed was the data of the timeSeries for marking a prediction

    // Get Today's date
    const endDateObj = new Date(); // AI
    const end_date = endDateObj.toISOString().split("T")[0]; // AI

    // Date 30 days earlier
    const startDateObj = new Date();
    startDateObj.setDate(endDateObj.getDate() - 30);
    const start_date = startDateObj.toISOString().split("T")[0];

    console.log("Start date:", start_date, "End date:", end_date);

    /*
    If the API gave me permisson without paying, I would take the data from here to make predictions
    (Copy paste from the website to use their API on Time Serie Data)

    var requestOptions = {
    method: 'GET',
    redirect: 'follow'
    };

    let values = await fetch(`https://api.currencyfreaks.com/v2.0/timeseries?startDate=2022-06-01&endDate=2022-06-07&base=eur&symbols=pkr,usd,gbp,cad&apikey=${apiKey}`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

    Then, I would have searched for a mathematical formula to predict the next value of the data inside an array.
    */

    const requestOptions = { method: 'GET', redirect: 'follow' };

    const response = await fetch(`https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${apiKey}&symbols=${currency}`, requestOptions);
    const value = await response.json(); 
    const numberCryptoAmount = Number(cryptoAmount.value) || 1 // AI

    const text = document.getElementById("cryptoValue");

    text.innerHTML = "Value: " + (value.rates[currency] * numberCryptoAmount) + "$"; 

}
