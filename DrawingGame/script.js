
// setup
document.body.style.height = window.innerHeight + "px";
document.body.style.width = window.innerWidth + "px";

var touchCounter = 0;
var isMouseDown = false;
var drawWidth = 35;

var draw = function(x, y) {
  var divEl = document.createElement("div");
  divEl.style.left = x-drawWidth/2 + "px";
  divEl.style.top = y-drawWidth/2 + "px";
  divEl.style.width = drawWidth + "px";
  divEl.style.height = drawWidth + "px";
  divEl.classList.add("drawer-divs", "yellow");
  document.body.appendChild(divEl);
};

var mouseMoveFunction = function(e) {
  if (isMouseDown === true) {
    draw(e.clientX, e.clientY);
    touchCounter++;
  }
};

var mouseDownFunction = function(e) {
  isMouseDown = true;
  draw(e.clientX, e.clientY);
};

var mouseUpFunction = function(e) {
  isMouseDown = false;
};


var touchMoveFunction = function(e) {
  if (isMouseDown === true) {
    draw(e.touches[0].clientX, e.touches[0].clientY);
    //touchCounter++;
  }
};

var touchStartFunction = function(e) {
  isMouseDown = true;
  draw(e.touches[0].clientX, e.touches[0].clientY);
  //touchCounter++;
};

var touchEndFunction = function(e) {
  isMouseDown = false;
};

// mouse listeners
document.body.addEventListener("mousedown", mouseDownFunction);
document.body.addEventListener("mouseup", mouseUpFunction);
document.body.addEventListener("mousemove", mouseMoveFunction);
// touch listeners
document.body.addEventListener("touchstart", touchStartFunction);
document.body.addEventListener("touchend", touchEndFunction);
document.body.addEventListener("touchmove", touchMoveFunction);
