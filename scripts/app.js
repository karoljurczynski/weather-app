// IMPORTS
import {changeBackground, connectWeatherApi, connectWithDatabase, locateUser, setWeather} from "./functions.js";

// GLOBAL VARIABLES
const apiKey = "f6847af012c269a3d5a06690548ab097";
const weatherData = {
  "location": [],
  "city": "",
  "temperature": "",
  "humidity": "",
  "wind": "",
  "pressure": "",
  "feelsLikeTemperature": "",
  "sky": "",
  "sunrise": "",
  "sunset": "",
  "backgroundData": {},
  "time": ""
}
/*
    TO DO:
    - FALL ANIMATIONS WHICH DEPENDS OF PRECIPITATION DATA FROM API - DONE
    - TIME FROM API - DONE
    - CLOUD SKYOBJECT WHICH APPEARS WHEN IT'S DRIZZLE - DONE
    - DARKCLOUD SKYOBJECT WHICH APPEARS WHEN IT'S RAINING/SNOWING - DONE
    - SNOWY WEATHER SHAPES COLOR - DONE
    - SETUP BUTTON (USER CAN CHOOSE WHICH DATA IS GOING TO SHOW ON SCREEN)
    - REFRESH BUTTON
    - ASYNC/AWAIT FUNCTIONS !!!

*/

// MAIN FUNCTION
window.addEventListener("load", () => {
  // GETTING LOCATION
  setTimeout(() => {locateUser()}, 100);
  // GETTING WEATHER
  setTimeout(() => {connectWeatherApi(weatherData.location)}, 300);
  // GETTING BACKGROUND
  setTimeout(() => {connectWithDatabase(weatherData.sky)}, 500);
  // SETTING BACKGROUND
  setTimeout(() => {changeBackground()}, 600);
  // SETTING WEATHER
  setTimeout(() => {setWeather()}, 700);
});

// EXPORTS
export {weatherData, apiKey};