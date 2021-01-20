// IMPORTS
import {weatherData, apiKey} from "./app.js";

// FUNCTIONS
const changeBackground = () => {
  const sky = document.querySelector("main");
  const shapes = sky.querySelectorAll(".shape");
  let skyObject;
  if (isRaining() || isSnowing()) {
    if (weatherData.sky === "Drizzle")
      skyObject = sky.querySelector(".cloud");
    else
      skyObject = sky.querySelector(".darkCloud");
  } 
  else
    skyObject = sky.querySelector("." + weatherData.backgroundData.skyObject);
  sky.style.backgroundColor = weatherData.backgroundData.sky;
  skyObject.style.display = "block";
  let i;
  for (i = 0; i < shapes.length; i++) {
    shapes[i].style.backgroundColor = weatherData.backgroundData.shapes[i];
  }
  isRaining();
  isSnowing();
}
const isRaining = () => {
  switch (weatherData.sky) {
    case "Drizzle": fallAnimation(20, "rainDrop"); break;
    case "Rain": fallAnimation(50, "rainDrop"); break;
    case "Thunderstorm": fallAnimation(50, "rainDrop"); thunderboltAnimation(); break;
    default: return false;
  }
  return true;
}
const isSnowing = () => {
  if (weatherData.sky === "Snow") {
    fallAnimation(50, "snowFlake");
    weatherData.backgroundData.shapes = ["#f5f5f5", "#e7e7e7", "#f8f8f8"];
    return true;
  }
  else
    return false;
}
const fallAnimation = (numberOfObjects, typeOfObject) => {
  for (i = 1; i <= numberOfObjects; i++) {
    // SETTING RANDOM POSITION OF OBJECT
    let dropObjectPosition = Math.ceil(Math.random() * 100);
    // CREATING OBJECT
    let dropObject = document.createElement("div");
    // SETTING OBJECT PROPERTIES
    dropObject.className = `${typeOfObject}`;
    dropObject.style.right = `${dropObjectPosition}%`;
    dropObject.style.animationDelay = `${i/6}s`;
    // APPENDING OBJECT TO CONTAINER
    document.querySelector("main").appendChild(dropObject);
  }
}
const thunderboltAnimation = () => {
  // SELECTING A CONTAINER
  const sky = document.querySelector("main");
  // SAVING OLD BACKGROUND TO VARIABLE
  const defaultBackground = sky.style.backgroundColor;
  // THUNDERBOLT EFFECT EVERY 5 SECONDS
  setInterval(() => {
    sky.style.backgroundColor = "white";
    setTimeout(() => {
      sky.style.backgroundColor = defaultBackground;
    }, 100);
    setTimeout(() => {
      sky.style.backgroundColor = "white";
    }, 150);
    setTimeout(() => {
      sky.style.backgroundColor = defaultBackground;
    }, 250);
  }, 5000);
}
const fetchWith = (url) => {
  return fetch(url)
    // CHECKING CONNECTION
    .then(response => {
      if (response.ok && response.status === 200)
        return response.json();
      else
        throw new Error(`${response.status} ${response.statusText}`);
    })
    // RETURNING A VALUE
    .then(response => {
      return response;
    })
    // CATCHING AN ERROR
    .catch(error => {console.error(error)});
}
const connectWithDatabase = (weather) => {
  // VARIABLES
  const databaseUrl = "scripts/weather.json";
  // CONNECTING WITH DATABASE
  fetchWith(databaseUrl).then(response => {
    if (weatherData.time >= weatherData.sunrise && weatherData.time < weatherData.sunset)
      weatherData.backgroundData = response[weather];
    else
      weatherData.backgroundData = response["Night"];
    if (weatherData.sky === "Snow")
      weatherData.backgroundData.shapes = response["Snow"].shapes;
  });
}
const connectWeatherApi = (location) => {
  // VARIABLES
  let url;
  // CHECKING TYPE OF PARAMETER
  if (typeof(location[0]) === "string") {
    url = `http://api.openweathermap.org/data/2.5/weather?q=${location[0]}&appid=${apiKey}`;
  } else if (typeof(location[0] === "number")) {
    url = `http://api.openweathermap.org/data/2.5/weather?lat=${location[0]}&lon=${location[1]}&appid=${apiKey}`;
  } else {
    throw new Error("Error in connectWeatherApi(): parameter is not a string or array");
  }
  // CONNECTING WITH API
  fetchWith(url).then(response => {
    // ASSIGNING DATA TO CONTAINER
    console.log(response);
    weatherData.temperature = response.main.temp;
    weatherData.feelsLikeTemperature = response.main.feels_like;
    weatherData.sky = response.weather[0].main;
    weatherData.humidity = response.main.humidity;
    weatherData.pressure = response.main.pressure;
    weatherData.wind = response.wind.speed;
    weatherData.city = response.name;
    weatherData.sunrise = response.sys.sunrise;
    weatherData.sunset = response.sys.sunset;
    weatherData.time = response.dt;
  });
}
const locateUser = () => {
  // VARIABLES
  const userLocation = window.navigator.geolocation;
  const regExp = /[a-z]{2,}/i;
  const container = document.querySelector(".cityInput");
  // SUCCESS CALLBACK
  function success(position) {
    weatherData.location.push(position.coords.latitude);
    weatherData.location.push(position.coords.longitude);
  }
  // ERROR CALLBACK
  function error() {
    // MAKING INPUT VISIBLE
    container.style.display = "flex";
    // LISTENING FOR BUTTON EVENT
    container.querySelector(".submitButton").addEventListener("click", () => {
      // ASSIGNING A VARIABLE WITH INPUT VALUE
      let inputValue = container.querySelector("#city").value;
      // CHECKING IF CITY IS CORRECT
      if (regExp.test(inputValue)) {
        weatherData.location.push(inputValue);
        container.style.display = "none";
      } else if (!inputValue)
        container.querySelector(".info").textContent = "Input is empty!";
      else
        container.querySelector(".info").textContent = "City is incorrect!";
    });
  }
  if(userLocation)
    userLocation.getCurrentPosition(success, error);
  else
    error();
  setTimeout(() => { console.log(weatherData) }, 100);
  return weatherData;
}
const getCurrentDate = (time = undefined) => {
  let date;
  if (time != undefined)
    date = new Date(time);
  else
    date = new Date();
  const correction = (property) => {
    if (property < 10)
      return `0${property}`;
    else
      return property;
  }
  return {
    "day": correction(date.getDay()),
    "month": correction(date.getMonth()+1),
    "year": correction(date.getFullYear()),
    "hour": correction(date.getHours()),
    "minute": correction(date.getMinutes()),
    "second": correction(date.getSeconds())
  }
}
const setWeather = () => {
  const cells = document.querySelectorAll(".cell");
  // TEMPERATURE
  cells[0].querySelector(".data").textContent = Math.round(weatherData.temperature - 273.15) + " " + String.fromCharCode(176) + "C";
  // TIME
  cells[1].querySelector(".data").textContent = `${getCurrentDate(weatherData.time * 1000).hour}:${getCurrentDate(weatherData.time * 1000).minute}`;
  // LOCATION
  cells[2].querySelector(".data").textContent = weatherData.city;
  // FEELS LIKE
  cells[3].querySelector(".data").textContent = Math.round(weatherData.feelsLikeTemperature - 273.15) + " " + String.fromCharCode(176) + "C";
  // HUMIDITY
  cells[4].querySelector(".data").textContent = weatherData.humidity + "%";
  // PRESSURE
  cells[5].querySelector(".data").textContent = weatherData.pressure + " hPa";
}

// EXPORTS
export {changeBackground, connectWeatherApi, connectWithDatabase, locateUser, setWeather};