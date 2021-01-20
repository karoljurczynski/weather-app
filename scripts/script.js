
const backgroundData = {
  "sky": "#061833",
  "shapes": ["#f5f5f5", "#e7e7e7", "#f8f8f8"],
  "skyObject": "moon"
};
const sky = document.querySelector("main");
const shapes = sky.querySelectorAll(".shape");
const skyObject = sky.querySelector("." + backgroundData.skyObject);
/*
sky.style.animationName = "boltStrike";
sky.style.animationDuration= "0.1s";
sky.style.animationIterationCount = "infinite";
sky.style.animationDelay = "5s";
*/
sky.style.backgroundColor = backgroundData.sky;
skyObject.style.display = "block";
let i;
for (i = 0; i < shapes.length; i++) {
  shapes[i].style.backgroundColor = backgroundData.shapes[i];
}
/*const getUserLocation = (callback) => {
  if (window.navigator.geolocation)
    window.navigator.geolocation.getCurrentPosition(
      (position => callback([position.coords.latitude, position.coords.longitude])),
      (error => {
        
      }));
}*/
