import {
  setLocationRemotely,
  getUserLocation,
  connectWithApi,
  connectWithDatabase,
  changeBackground,
  convertTemperature,
  correctSingularTimeUnit,
  showWeatherData
} from "./functions.js";

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
const main = async () => {
  const location = await getUserLocation();
  const weatherData = await connectWithApi(location);
  const backgroundData = await connectWithDatabase(weatherData);
  console.log(weatherData);
  console.log(backgroundData);
  changeBackground(backgroundData);
  showWeatherData(weatherData);
}
main();