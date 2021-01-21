export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (position => resolve([position.coords.latitude, position.coords.longitude])),
        (error => resolve(setLocationRemotely())));
    }
    else
      reject();
    });
}
export const connectWithApi = location => {

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
export const connectWithDatabase = weatherData => {
  return new Promise((resolve, reject) => {
    let weather = weatherData.weather[0].main;
    const databaseUrl = "scripts/weather.json";

    fetch(databaseUrl)
      .then(response => {
        if (response.ok && response.status === 200)
          return response.json();
        else
          reject(error);
      })
      .then(response => {
        if (isNight(weatherData)) {
          if (weather === "Clear")
            response[weather] = response["Night"];
          else if (weather != "Snow")
            response[weather].shapes = response["Night"].shapes;
          response[weather].sky = response["Night"].sky;
        }
        if (weatherData.main.temp <= 273.15)
          response[weather].shapes = response["Snow"].shapes;  
        resolve(response[weather]);
      });
  })
}
export const changeBackground = backgroundData => {
  const sky = document.querySelector("main");
  const shapes = sky.querySelectorAll(".shape");
  const skyObject = sky.querySelector(`.${backgroundData.skyObject}`);
  sky.style.backgroundColor = backgroundData.sky;
  skyObject.style.display = "block";
  for (let i = 0; i < shapes.length; i++)
    shapes[i].style.backgroundColor = backgroundData.shapes[i];
}
export const showWeatherData = weatherData => {
  const cells = document.querySelectorAll(".cell");
  let newDate = new Date();
  let currentTime = new Date(newDate.getTime() + weatherData.timezone * 1000);
  // TEMPERATURE
  cells[0].querySelector(".data").textContent = `${convertTemperature(weatherData.main.temp)} °C`;
  // TIME
  cells[1].querySelector(".data").textContent = `${correctSingularTimeUnit(currentTime.getHours()-1)}:${correctSingularTimeUnit(currentTime.getMinutes())}`;
  // LOCATION
  cells[2].querySelector(".data").textContent = `${weatherData.name}, ${weatherData.sys.country}`;
  // FEELS LIKE
  cells[3].querySelector(".data").textContent = `${convertTemperature(weatherData.main.feels_like)} °C`;
  // HUMIDITY
  cells[4].querySelector(".data").textContent = `${weatherData.main.humidity} %`;
  // PRESSURE
  cells[5].querySelector(".data").textContent = `${weatherData.main.pressure} hPa`;
}
export const isRaining = weatherData => {
  switch (weatherData.weather[0].main) {
    case "Drizzle": fallAnimation(10, "rainDrop"); break;
    case "Rain": fallAnimation(30, "rainDrop"); break;
    case "Thunderstorm": fallAnimation(50, "rainDrop"); thunderboltAnimation(); break;
    case "Snow": fallAnimation(40, "snowFlake"); break;
    default: return false;
  }
  return true;
}
export const refreshData = callback => {
  const refreshButton = document.querySelector("#refresh");
  refreshButton.addEventListener("click", () => {
    const container = document.querySelector("main");
    console.log(container.children);
    let i;
    for(i = 3; i < 7; i++) {
      container.children[i].style.display = "none";
    }
    if (container.children.length > 8) {
      const fallout = document.querySelectorAll(".snowFlake");
      for (let i = 0; i < fallout.length; i++) {
        fallout[i].remove();
      } 
    }
    callback();
  });
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
const convertTemperature = temperatureInKelvins => {
  return Math.round(temperatureInKelvins - 273.15)
}
const correctSingularTimeUnit = timeUnit => {
  if (timeUnit < 10)
    return `0${timeUnit}`;
  else
    return timeUnit;
}
const isNight = weatherData => {
  const currentTime = new Date();
  const sunriseTime = weatherData.sys.sunrise + (weatherData.timezone/3600);
  const sunsetTime = weatherData.sys.sunset + (weatherData.timezone/3600);
  if (currentTime.getTime() < sunriseTime * 1000 || currentTime.getTime() >= sunsetTime * 1000)
    return true;
  else
    return false
}
const fallAnimation = (numberOfObjects, typeOfObject) => {
  let i;
  for (i = 1; i <= numberOfObjects; i++) {
    let randomDropObjectPosition = Math.ceil(Math.random() * 100);
    let dropObject = document.createElement("div");
    dropObject.className = `${typeOfObject}`;
    dropObject.style.right = `${randomDropObjectPosition}%`;
    dropObject.style.animationDelay = `${i/6}s`;
    document.querySelector("main").appendChild(dropObject);
  }
}
const thunderboltAnimation = () => {
  const sky = document.querySelector("main");
  const defaultBackground = sky.style.backgroundColor;
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