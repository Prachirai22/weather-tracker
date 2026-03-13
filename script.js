const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");
const historyList = document.getElementById("historyList");
const consoleOutput = document.getElementById("consoleOutput");

function log(message) {
    const div = document.createElement("div");
    div.className = "log-line";
    div.textContent = message;
    consoleOutput.appendChild(div);
}

window.onload = function () {
    loadHistory();
};

async function getWeather(city) {

    consoleOutput.innerHTML = "";
    log("Sync Start");
    log("ASYNC: Start fetching");

    if (!city) {
        alert("Enter a city name");
        return;
    }

    try {

        log("Before Fetch");

        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
        );

        const geoData = await geoResponse.json();

        if (!geoData.results) {
            throw new Error("City not found");
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );

        const weatherData = await weatherResponse.json();

        document.getElementById("cityName").textContent = name + " , " + country;
        document.getElementById("temp").textContent =
            weatherData.current_weather.temperature + " °C";

        document.getElementById("weatherCondition").textContent =
            "Clear"; 

        document.getElementById("humidity").textContent =
            "N/A";

        document.getElementById("wind").textContent =
            weatherData.current_weather.windspeed + " m/s";

        saveToHistory(name);

        log("ASYNC: Data received");

    } catch (error) {

        log("Error caught");

        document.getElementById("cityName").textContent = "-";
        document.getElementById("temp").textContent = "-";
        document.getElementById("weatherCondition").textContent = "-";
        document.getElementById("humidity").textContent = "-";
        document.getElementById("wind").textContent = "-";
    }

    log("Sync End");
}

function fetchWithThen(city) {
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)
        .then(res => res.json())
        .then(data => {
            console.log("Promise resolved");
        })
        .catch(err => {
            console.log("Promise rejected");
        });
}

function saveToHistory(city) {
    let history = JSON.parse(localStorage.getItem("cities")) || [];

    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem("cities", JSON.stringify(history));
    }

    loadHistory();
}

function loadHistory() {
    historyList.innerHTML = "";
    let history = JSON.parse(localStorage.getItem("cities")) || [];

    history.forEach(city => {
        const span = document.createElement("span");
        span.textContent = city;
        span.onclick = () => getWeather(city);
        historyList.appendChild(span);
    });
}

searchBtn.addEventListener("click", () => {
    getWeather(cityInput.value.trim());
});