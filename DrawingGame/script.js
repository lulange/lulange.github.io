
// setup
document.body.style.height = window.innerHeight + "px";
document.body.style.width = window.innerWidth + "px";

var isMouseDown = false;
var drawWidth = document.getElementById("size-input").value;
var drawColor = "yellow";
var selectors = document.getElementsByClassName("color-selector");

var draw = function(x, y) {
  var divEl = document.createElement("div");
  divEl.style.left = x-drawWidth/2 + "px";
  divEl.style.top = y-drawWidth/2 + "px";
  divEl.style.width = drawWidth + "px";
  divEl.style.height = drawWidth + "px";
  divEl.classList.add("drawer-divs", drawColor);
  document.body.appendChild(divEl);
};

var mouseMoveFunction = function(e) {
  if (isMouseDown === true && e.clientY < window.innerHeight - 70) {
    draw(e.clientX, e.clientY);
  }
};

var mouseDownFunction = function(e) {
  isMouseDown = true;
  if (e.clientY < window.innerHeight - 70) {
    draw(e.clientX, e.clientY);
  }
};

var mouseUpFunction = function(e) {
  isMouseDown = false;
};


var touchMoveFunction = function(e) {
  if (isMouseDown === true && e.clientY < window.innerHeight - 70) {
    draw(e.touches[0].clientX, e.touches[0].clientY);
  }
};

var touchStartFunction = function(e) {
  isMouseDown = true;
  if (e.clientY < window.innerHeight - 70) {
    draw(e.touches[0].clientX, e.touches[0].clientY);
  }
};

var touchEndFunction = function(e) {
  isMouseDown = false;
};

var changeColorSelectBorder = function(id) {
  for (var i=0; i<selectors.length; i++) {
    selectors[i].style.borderColor = "transparent";
  }
  document.getElementById(id).style.borderColor = "black";
};

var hoverStateInOut = function(el, InOrOut) {
  if (InOrOut === true) {
    el.style.width = "53px";
    el.style.height = "53px";
  } else {
    el.style.width = "50px";
    el.style.height = "50px";
  }
};


var resizeFunction = function() {
  document.body.style.height = window.innerHeight + "px";
  document.body.style.width = window.innerWidth + "px";
};

// mouse listeners
document.body.addEventListener("mousedown", mouseDownFunction);
document.body.addEventListener("mouseup", mouseUpFunction);
document.body.addEventListener("mousemove", mouseMoveFunction);
// touch listeners
document.body.addEventListener("touchstart", touchStartFunction);
document.body.addEventListener("touchend", touchEndFunction);
document.body.addEventListener("touchmove", touchMoveFunction);

// more mouse listeners for interface
document.getElementById("yellow-button").addEventListener("click", function() {drawColor = "yellow"; changeColorSelectBorder("yellow-button");});
document.getElementById("yellow-button").addEventListener("mouseover", function() {hoverStateInOut(this, true);});
document.getElementById("yellow-button").addEventListener("mouseout", function() {hoverStateInOut(this, false);});

document.getElementById("blue-button").addEventListener("click", function() {drawColor = "blue"; changeColorSelectBorder("blue-button");});
document.getElementById("blue-button").addEventListener("mouseover", function() {hoverStateInOut(this, true);});
document.getElementById("blue-button").addEventListener("mouseout", function() {hoverStateInOut(this, false);});

document.getElementById("orange-button").addEventListener("click", function() {drawColor = "orange"; changeColorSelectBorder("orange-button");});
document.getElementById("orange-button").addEventListener("mouseover", function() {hoverStateInOut(this, true);});
document.getElementById("orange-button").addEventListener("mouseout", function() {hoverStateInOut(this, false);});

document.getElementById("red-button").addEventListener("click", function() {drawColor = "red"; changeColorSelectBorder("red-button");});
document.getElementById("red-button").addEventListener("mouseover", function() {hoverStateInOut(this, true);});
document.getElementById("red-button").addEventListener("mouseout", function() {hoverStateInOut(this, false);});

// on input listener for size input
document.getElementById("size-input").addEventListener("input", function() {drawWidth = document.getElementById("size-input").value;})

window.addEventListener("resize", resizeFunction);
