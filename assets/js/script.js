const apiKey = "dc0a8043429219e780441e7cc386652e";
const baseUrl = "https://api.openweathermap.org/data/2.5/forecast";

// Define DOM elements
var form = document.querySelector("#user-form");
var input = document.querySelector("#cityname");
var container = document.querySelector("#city-container");
var searchTitle = document.querySelector("#city-search-term");
var savedCities = document.querySelector(".savedCities");

// Retrieve saved cities from local storage
var cities = JSON.parse(localStorage.getItem("cities")) || [];

// Render saved cities on page load
renderSavedCities();

// Add event listener to form
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const cityName = input.value.trim();
  if (!cityName) return;
  getWeatherData(cityName);
  input.value = "";
});

// Define function to fetch weather data
async function getWeatherData(city) {
  try {
    const response = await fetch(
      `${baseUrl}?q=${city}&units=metric&appid=${apiKey}`
    );
    const data = await response.json();
    const weatherData = parseWeatherData(data);
    updateWeatherUI(weatherData);
    // Save searched city to local storage
    saveCity(city);
  } catch (error) {
    console.log(error);
  }
}

// Define function to parse weather data
function parseWeatherData(data) {
  const city = data.city.name;
  const weatherData = data.list.map((item) => ({
    date: dayjs(item.dt_txt).format("ddd, D MMM"),
    icon: `https://openweathermap.org/img/w/${item.weather[0].icon}.png`,
    temp: Math.round(item.main.temp),
    desc: item.weather[0].description,
  }));
  return { city, weatherData };
}

// Define function to update weather UI
function updateWeatherUI(data) {
  searchTitle.textContent = `for ${data.city}`;
  container.innerHTML = data.weatherData
    .map(
      (item) => `
      <div class="list-group-item">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-1">${item.date}</h5>
          <img src="${item.icon}" alt="${item.desc}" width="50" height="50">
          <span class="badge bg-primary rounded-pill">${item.temp}&deg;C</span>
        </div>
        <p class="mb-1">${item.desc}</p>
      </div>
    `
    )
    .join("");
}

// Define function to save searched city to local storage
function saveCity(city) {
  // Check if city is already in the array
  if (!cities.includes(city)) {
    // Add city to the array
    cities.push(city);
    // Save array to local storage
    localStorage.setItem("cities", JSON.stringify(cities));
    // Render saved cities on the page
    renderSavedCities();
  }
}

// Define function to render saved cities on the page
function renderSavedCities() {
  savedCities.innerHTML = `
    <h3 class="card-header text-uppercase">Saved Cities</h3>
    <ul class="list-group">
      ${cities
        .map((city) => `<li class="list-group-item">${city}</li>`)
        .join("")}
    </ul>
  `;
}
