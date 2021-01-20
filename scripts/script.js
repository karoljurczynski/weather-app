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
const fallAnimation = (numberOfObjects, typeOfObject) => {
  let i = 1;
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
    sky.appendChild(dropObject);
  }
  let drops = sky.querySelectorAll(".rainDrop");
  i = 1;
  while(i > numberOfObjects)
  {
    setTimeout(() => {
      console.log(i);
      sky.removeChild(drops[i-1]);
      i++;
    }, 1000)
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
fallAnimation(50, "rainDrop");
thunderboltAnimation();
