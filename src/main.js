//Global variables

const favList = document.getElementById("fav-list");
const searchEl = document.getElementById("search-btn");
const userInputEl = document.getElementById("user-input");
let cityGeo = {};
let cityWeather = {};
let userInput = "";

const weatherIcons = {
  "01d": "http://openweathermap.org/img/wn/01d.png",
  "02d": "http://openweathermap.org/img/wn/02d.png",
  "03d": "http://openweathermap.org/img/wn/02d.png",
  "04d": "http://openweathermap.org/img/wn/04d.png",
  "09d": "http://openweathermap.org/img/wn/09d.png",
  "10d": "http://openweathermap.org/img/wn/10d.png",
  "11d": "http://openweathermap.org/img/wn/11d.png",
  "13d": "http://openweathermap.org/img/wn/13d.png",
  "50d": "http://openweathermap.org/img/wn/50d.png",
};

async function getCityData() {
  //One Call API variables
  const apiRoot = "https://api.openweathermap.org/data/2.5/onecall";
  const apiQuery = `?lat=${cityGeo.coord.lat}&lon=${cityGeo.coord.lon}&exclude=minutely,hourly,alerts&units=imperial`;
  const apiKey = "&appid=0da948eb4dff4edc16d53212f5e1d944";

  let fetchForecast = await fetch(apiRoot + apiQuery + apiKey)
    .then((response) => response.json())
    .then((data) => {
      cityWeather = data;
      console.log(data);
    });
}

//City GEO location
async function getCityGeo(city) {
  const apiRoot = "https://api.openweathermap.org/data/2.5/forecast";
  const apiQuery = "?cnt=1&appid=0da948eb4dff4edc16d53212f5e1d944&q=";

  let fetchCityGeo = await fetch(apiRoot + apiQuery + city)
    .then((response) => {
      if (!response.ok) {
        alert("Bad request. Please try again.");
        // cityGeo = {};
      } else {
        return response.json();
      }
    })
    .then((data) => {
      cityGeo = data.city;
      getCityData();
    });
}

//Capture user input
async function getUserInput() {
  userInput = userInputEl.value;
  await getCityGeo(userInput);
  if (!userInput) {
    alert("Search query cannot be empty. \n Please try again");
  } else if (!getCityGeo(userInput)) {
    alert(`Unable to find ${userInput}. \n Please try again`);
  } else {
    console.log(cityGeo);
    addFavEl();
  }
}

function addFavEl() {
  const favEl = document.getElementById("fav-list");
  const buttonEl = document.createElement("button");
  buttonEl.classList.add(
    "mt-2",
    "d-flex-fluid",
    "btn",
    "btn-secondary",
    "fav-btn"
  );
  if (cityGeo) {
    buttonEl.textContent = cityGeo.name;
    favEl.appendChild(buttonEl);
    setTimeout(() => {
      addContent();
    }, 500);
  }
}

//Add forecast data
function addContent() {
  const favEl = document.getElementById("main-section");
  const currentCity = document.getElementById("current-city");
  const currentIcon = document.getElementById("current-icon");
  const currentTemp = document.getElementById("current-temp");
  const currentWind = document.getElementById("current-wind");
  const currentHumidity = document.getElementById("current-humidity");
  const currentUv = document.getElementById("current-uv-p");
  const cardEl = document.getElementById("cards").children;

  localStorage.setItem(cityGeo.name, cityGeo.name);
  currentCity.textContent = `${cityGeo.name} ${convertUnixTime(
    cityWeather.daily[0].dt
  )}`;
  currentIcon.setAttribute(
    "src",
    weatherIcons[cityWeather.daily[0].weather[0].icon]
  );
  currentTemp.innerHTML = "Temp: " + cityWeather.daily[0].temp.day + "&#8457";
  currentWind.textContent = "Wind: " + cityWeather.daily[0].wind_speed + " MPH";
  currentHumidity.textContent =
    "Humidity: " + cityWeather.daily[0].humidity + "%";
  currentUv.textContent = `UV Index:  `;
  favEl.classList.remove("invisible");
  setUvi();

  for (let i = 0; i < cardEl.length; i++) {
    // console.log(a[i].children)
    console.log(cardEl[i].children);
    cardEl[i].children[0].textContent = `${convertUnixTime(
      cityWeather.daily[i + 1].dt
    )}`;

    cardEl[i].children[1].setAttribute(
      "src",
      weatherIcons[cityWeather.daily[i + 1].weather[0].icon]
    );
    cardEl[i].children[2].innerHTML =
      "Temp: " + cityWeather.daily[i + 1].temp.day + "&#8457";
    cardEl[i].children[3].textContent =
      "Wind: " + cityWeather.daily[i + 1].wind_speed + " MPH";
    cardEl[i].children[4].textContent =
      "Humidity: " + cityWeather.daily[i + 1].humidity + "%";
  }
}

function convertUnixTime(timestamp) {
  const timeStamp = parseInt(timestamp) * 1000;
  const date = new Date(timeStamp);
  const dateFormat = date.toLocaleDateString();
  return dateFormat;
}

function setUvi() {
  const uviEl = document.getElementById("current-uv-span");
  const uviValue = parseInt(cityWeather.daily[0].uvi);
  if (uviValue <= 2) {
    uviEl.setAttribute("class", "uv-low");
    uviEl.textContent = uviValue;
  } else if (uviValue <= 5) {
    uviEl.setAttribute("class", "uv-moderate");
    uviEl.textContent = uviValue;
  } else if (uviValue <= 7) {
    uviEl.setAttribute("class", "uv-high");
    uviEl.textContent = uviValue;
  } else {
    uviEl.setAttribute("class", "uv-very-high");
    uviEl.textContent = uviValue;
  }
}

function renderStorageEl() {
  const favEl = document.getElementById("fav-list");
  // let buttonEl = document.createElement("button");

  cityEl = Object.keys(localStorage);
  if (cityEl.length > 0) {
    for (let i = 0; i < cityEl.length; i++) {
      const buttonEl = document.createElement("button");
      buttonEl.classList.add("mt-2", "d-flex-fluid", "btn", "btn-secondary");
      buttonEl.setAttribute("id", "fav-btn");
      buttonEl.textContent = cityEl[i];
      favEl.appendChild(buttonEl);
    }
    async function getUserClick() {
      const btnEl = document.querySelectorAll("#fav-btn");
      for (let i = 0; i < btnEl.length; i++) {
        btnEl[i].addEventListener("click", () => {
          getCityGeo(btnEl[i].textContent);
          console.log(cityGeo);
          setTimeout(() => {
            addContent();
          }, 500);
        });
      }
    }
    getUserClick();
  }
}

function initApp() {
  searchEl.addEventListener("click", getUserInput);
  renderStorageEl();
}

initApp();
