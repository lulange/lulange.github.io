// some global variables for an animation
var h3El;
var divEl;
var imgEl;
var imgNum;
var newWidth;
var startDate;
var flipAnimation;
var isAnimationGoing;
// to be used as a url reference
var loadingImage = document.createElement("img");
loadingImage.src = "loading.jpg";


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

    if (imgEl.src !== loadingImage.src) {
      // set off the animation
      animateImage();
      isAnimationGoing = true;
    }
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




var imagesArr = [];
var createImagesForLoadCheck = function() {
  for (var i=0; i<8; i++) {
    imagesArr[i] = document.createElement("img");
    imagesArr[i].src = "image" + (i + 1) + "B.jpg";
    imagesArr[i].style.display = "none";
    document.body.appendChild(imagesArr[i]);
  }
};


var loadCheck = function() {
  var clearChecker = 0;
  for (var i=0; i<imagesArr.length; i++) {
    if (imagesArr[i].complete === true && document.getElementById("img" + (i + 1)).complete) {
      if (document.getElementById("img" + (i + 1)).src === loadingImage.src) {
        document.getElementById("img" + (i + 1)).src = "image" + (i + 1) + "A.jpg";
      }
      clearChecker++;
    }
  }
  if (clearChecker === imagesArr.length) {
    window.clearInterval(loadCheckInterval);
  }
};


createImagesForLoadCheck();
var loadCheckInterval = window.setInterval(loadCheck, 333);