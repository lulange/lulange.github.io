// some global variables for an animation
var h3El;
var divEl;
var imgEl;
var imgNum;
var newWidth;
var startDate;
var flipAnimation;
var isAnimationGoing;


var animateImage = function() {
  var endDate = new Date();
  if (flipAnimation === true) {
    newWidth = (endDate - startDate) * 1.6;
  } else {
    newWidth = 600 - (endDate - startDate) * 1.6;
  }

  imgEl.width = newWidth; // the image width attribute changes here

  if (newWidth < 0) {
    flipAnimation = true;
    startDate = new Date();
    changeImage();
    imgEl.width = 0;
  }

  if (flipAnimation === true && imgEl.width >= 590) {
    imgEl.width = 600;
    isAnimationGoing = false;
    if (h3El.textContent === "??????????") {
      var selector = "#image-section" + imgNum + " p";
      console.log(selector);
      h3El.textContent = document.querySelector(selector).textContent;
      divEl.textContent = "hide";
    } else {
      h3El.textContent = "??????????";
      divEl.textContent = "show";
    }
  } else {
    window.requestAnimationFrame(animateImage);

  }
};

var showHide = function(answerId, buttonId, imageNum) {
  if (isAnimationGoing !== true) {
    // set the global variables for the animate image function to use
    h3El = document.getElementById(answerId);
    divEl = document.getElementById(buttonId); // A div element is used for the button
    imgEl = document.getElementById("img" + imageNum);
    imgNum = imageNum;
    flipAnimation = false;
    startDate = new Date();
    isAnimationGoing = true;
    // set off the animation
    animateImage();
  }
};

var changeImage = function() {
  console.log(imgEl.src);
  if (imgEl.src.slice(-5, -4) === "A") {
    imgEl.src = "image" + imgEl.src.slice(-6, -5) + "B.jpg";
  } else {
    imgEl.src = "image" + imgEl.src.slice(-6, -5) + "A.jpg";
  }
};
