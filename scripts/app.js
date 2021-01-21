import {
  getUserLocation,
  connectWithApi,
  connectWithDatabase,
  changeBackground,
  showWeatherData,
  isRaining,
  refreshData
} from "./functions.js";

/*
    TO DO:
    - SETUP BUTTON (USER CAN CHOOSE WHICH DATA IS GOING TO SHOW ON SCREEN)
    - REFRESH BUTTON
*/

const main = async () => {
  const location = await getUserLocation();
  const weatherData = await connectWithApi(location);
  const backgroundData = await connectWithDatabase(weatherData);
  console.log(weatherData);
  console.log(backgroundData);
  showWeatherData(weatherData);
  changeBackground(backgroundData);
  isRaining(weatherData);
};
main();
refreshData(main);