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
const setLocationRemotely = () => {
  return new Promise((resolve, reject) => {
    const inputContainer = document.querySelector(".cityInput");
    const regExp = /[a-z]{2,}/i;
    inputContainer.style.display = "flex";
    inputContainer.querySelector(".submitButton").addEventListener("click", () => {
      let cityName = inputContainer.querySelector("#city").value;
      if (regExp.test(cityName)) {
        inputContainer.style.display = "none";
        resolve(cityName);
      }
      else if (!cityName)
        inputContainer.querySelector(".info").textContent = "Input is empty!";
      else
        inputContainer.querySelector(".info").textContent = "City is incorrect!";
    })
  })
}
const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (position => resolve([position.coords.latitude, position.coords.longitude])),
        (error => resolve(setLocationRemotely())));
    } 
    else {
      reject();
    }});
}
const connectWithApi = location => {

  return new Promise((resolve, reject) => {

    let url;
    const apiKey = "f6847af012c269a3d5a06690548ab097";

    if (typeof(location[0]) === "string") {
      url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
    } 
    else if (typeof(location[0] === "number")) {
      url = `http://api.openweathermap.org/data/2.5/weather?lat=${location[0]}&lon=${location[1]}&appid=${apiKey}`;
    } 
    else {
      reject("Error in connectWithApi(): parameter is not a string or array");
    }
    fetch(url)
      .then(response => {
        if (response.ok && response.status === 200)
          return response.json();
        else
          reject();
      })
      .then(response => {resolve(response)});
  });
}
const connectWithDatabase = weatherData => {
  return new Promise((resolve, reject) => {
    const weather = weatherData.weather[0].main;
    const databaseUrl = "scripts/weather.json";
    fetch(databaseUrl)
      .then(response => {
        if (response.ok && response.status === 200)
          return response.json();
        else
          reject(error);
      })
      .then(response => resolve(response[weather]));
  })
}
const changeBackground = backgroundData => {
  const sky = document.querySelector("main");
  const shapes = sky.querySelectorAll(".shape");
  const skyObject = sky.querySelector(`.${backgroundData.skyObject}`);
  sky.style.backgroundColor = backgroundData.sky;
  skyObject.style.display = "block";
  for (let i = 0; i < shapes.length; i++) {
    shapes[i].style.backgroundColor = backgroundData.shapes[i];
  }
}
const convertTemperature = temperatureInKelvins => {
  return Math.round(temperatureInKelvins - 273.15)
}
const correctSingularTimeUnit = timeUnit => {
  if (timeUnit < 10)
    return `0${timeUnit}`;
  else
    return timeUnit;
}
const showWeatherData = weatherData => {
  const cells = document.querySelectorAll(".cell");
  const refreshTime = new Date(weatherData.dt * 1000);
  // TEMPERATURE
  cells[0].querySelector(".data").textContent = `${convertTemperature(weatherData.main.temp)} °C`;
  // TIME
  cells[1].querySelector(".data").textContent = `${correctSingularTimeUnit(refreshTime.getHours())}:${correctSingularTimeUnit(refreshTime.getMinutes())}`;
  // LOCATION
  cells[2].querySelector(".data").textContent = `${weatherData.name}, ${weatherData.sys.country}`;
  // FEELS LIKE
  cells[3].querySelector(".data").textContent = `${convertTemperature(weatherData.main.feels_like)} °C`;
  // HUMIDITY
  cells[4].querySelector(".data").textContent = `${weatherData.main.humidity} %`;
  // PRESSURE
  cells[5].querySelector(".data").textContent = `${weatherData.main.pressure} hPa`;
}

export {
  setLocationRemotely,
  getUserLocation,
  connectWithApi,
  connectWithDatabase,
  changeBackground,
  convertTemperature,
  correctSingularTimeUnit,
  showWeatherData
};