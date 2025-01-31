

let searchInput = document.getElementById("searchInput");
let suggestSearch = document.querySelector(".suggestSearch");
let data = document.getElementById("data");
let hoursData = document.getElementById("hoursData");
let closeBtn = document.getElementById("closeBtn");
let keyAPI = "a264d5db944f4218bb9200222241312";
let currentIndex = -1;
let currentIndexHour = 0;

let currentWeather =
  "https://api.weatherapi.com/v1/current.json?key=a264d5db944f4218bb9200222241312&q=London,United Kingdom";

let forecastWeather =
  "https://api.weatherapi.com/v1/forecast.json?key=a264d5db944f4218bb9200222241312&q=London&days=5";

let Search =
  "https://api.weatherapi.com/v1/search.json?key=a264d5db944f4218bb9200222241312&q=lond";

let conditions = "https://www.weatherapi.com/docs/weather_conditions.json";

selectCity("cairo", "Egypt");

// Search by characters
async function searchCities(letters) {
  try {
    let response = await (
      await fetch(
        `https://api.weatherapi.com/v1/search.json?key=${keyAPI}&q=${letters}`
      )
    ).json();

    displaySearch(response);
  } catch (error) {
    showAlert("Failed to fetch data from API. Please try again later.");
  }
}

// Select city
async function selectCity(name, country) {
  try {
    let response = await (
      await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${keyAPI}&q=${name},${country}&days=3`
      )
    ).json();
    suggestSearch.classList.add("hidden");
    hoursData.classList.remove("hidden");
    searchInput.value = "";
    displayData(response);
    displayHours(response);
  } catch (error) {
    showAlert("Failed to fetch data from API. Please try again later.");
  }
}

// Display search results
function displaySearch(response) {
  let container = "";
  for (let i = 0; i < response.length; i++) {
    container += `  
      <div class="searchResult m-1 p-1 font-bold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-black dark:text-white" onclick="selectCity('${response[i].name}', '${response[i].country}')">
        <div>${response[i].name}, <span>${response[i].country}</span></div>
        <div class="w-full mx-auto bg-white h-px mt-1 dark:bg-gray-600"></div>
      </div>
    `;
  }
  suggestSearch.innerHTML = container;

  if (response.length > 0) {
    suggestSearch.classList.remove("hidden");
  } else {
    suggestSearch.classList.add("hidden");
  }

  currentIndex = -1;
}


searchInput.addEventListener("input", function () {
  let inputData = searchInput.value;
  searchCities(inputData);
});

// Display weather data
function displayData(response) {
  let container = "";

  for (let i = 0; i < 3; i++) {
    let localtime = response.forecast.forecastday[i].date;
    let timezone = response.location.tz_id;
    let date = new Date(localtime);
    let dateString = String(date);

    let options = { weekday: "long", timeZone: timezone };

    let dayName = "";
    if (i == 0) {
      dayName = "Today";
    } else if (i == 1) {
      dayName = "Tomorrow";
    } else {
      dayName = new Intl.DateTimeFormat("en-US", options).format(date);
    }

    container += `  
      <div class="weather-card bg-white dark:bg-gray-800  p-6 rounded-lg shadow-md">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-semibold dark:text-white">${dayName}</h3>
          <div class="text-gray-600 dark:text-gray-200">${dateString.split(" ", 3).join(" ")}</div>
        </div>
        <div class="mt-2 text-gray-700 dark:text-gray-100">${response.location.name}, ${response.location.country}</div>
        <img src="https:${response.forecast.forecastday[i].day.condition.icon}" alt="Weather Icon" class="mx-auto my-4">
        <div class="text-center text-gray-700 dark:text-gray-100">${response.forecast.forecastday[i].day.condition.text}</div>
        <div class="text-center text-3xl font-bold my-4 dark:text-gray-100">${response.forecast.forecastday[i].day.avgtemp_c}°C</div>
        <div class="grid grid-cols-2 gap-4 mt-4">
          <div class="text-center">
            <span class="text-gray-600 dark:text-gray-100">Max Temp</span>
            <span class="block font-bold dark:text-gray-300">${response.forecast.forecastday[i].day.maxtemp_c}°C</span>
          </div>
          <div class="text-center">
            <span class="text-gray-600 dark:text-gray-100">Min Temp</span>
            <span class="block font-bold dark:text-gray-300">${response.forecast.forecastday[i].day.mintemp_c}°C</span>
          </div>
          <div class="text-center">
            <span class="text-gray-600 dark:text-gray-100">Avg Humidity</span>
            <span class="block font-bold dark:text-gray-300">${response.forecast.forecastday[i].day.avghumidity}%</span>
          </div>
          <div class="text-center">
            <span class="text-gray-600 dark:text-gray-100">Wind Speed</span>
            <span class="block font-bold dark:text-gray-300">${response.forecast.forecastday[i].day.maxwind_kph} km/h</span>
          </div>
        </div>
      </div>
    `;
  }
  data.innerHTML = container;
}

// Display hourly data
function displayHours(response) {
  let time = response.forecast.forecastday[0].hour[0].time.split(" ", 2)[1];
  let container = "";
  for (let i = 0; i < 9; i++) {
    let j = i % 12 || 12;
    let isDay = i < 12 ? "AM" : "PM";

    container += `
      <div class="hoursData ">
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
          <div class="font-bold dark:text-gray-200">${response.forecast.forecastday[0].hour[j].time.split(" ", 2)[1]} ${isDay}</div>
          <img src="https:${response.forecast.forecastday[0].hour[i].condition.icon}" alt="Weather Icon" class="w-16 mx-auto my-2">
          <div class="font-bold dark:text-gray-200">${response.forecast.forecastday[0].hour[i].temp_c}°C</div>
          <div class="text-sm dark:text-gray-200">${response.forecast.forecastday[0].hour[i].condition.text}</div>
          <img src="./src/img/navigation-1.png" alt="Wind Icon" class="w-8 mx-auto my-2">
          <div class="text-sm dark:text-gray-200">${response.forecast.forecastday[0].hour[i].wind_kph} km/h</div>
        </div>
      </div>
    `;
  }
  hoursData.innerHTML = container;
  currentIndexHour = 0;
}

// Theme toggle functionality
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  body.className = savedTheme;
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  localStorage.setItem("theme", body.className);
});

// Show alert
function showAlert(message) {
  const alertBox = document.getElementById("customAlert");
  const alertMessage = document.getElementById("alertMessage");

  alertMessage.textContent = message;
  alertBox.classList.remove("hidden");

  setTimeout(() => {
    closeAlert();
  }, 5000);
}

// Close alert
function closeAlert() {
  const alertBox = document.getElementById("customAlert");
  alertBox.classList.add("hidden");
}

closeBtn.addEventListener("click", closeAlert);