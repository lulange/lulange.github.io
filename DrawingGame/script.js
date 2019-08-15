
// setup
document.body.style.height = screen.height + "px";
document.body.style.width = screen.width + "px";

var isMouseDown = false;
var drawWidth = 35;

var draw = function(x, y) {
  var divEl = document.createElement("div");
  var divElSty = divEl.style;
  divElSty.left = x-drawWidth/2 + "px";
  divElSty.top = y-drawWidth/2 + "px";
  divElSty.width = drawWidth + "px";
  divElSty.height = drawWidth + "px";
  divEl.classList.add("drawer-divs", "yellow");
  document.body.appendChild(divEl);
};

var mouseMoveFunction = function(e) {
  if (isMouseDown === true) {
    draw(e.clientX, e.clientY);
  }
};

var mouseDownFunction = function(e) {
  isMouseDown = true;
  draw(e.clientX, e.clientY);
};

var mouseUpFunction = function(e) {
  isMouseDown = false;
};

// mouse listeners
document.body.addEventListener("mousedown", mouseDownFunction);
document.body.addEventListener("mouseup", mouseUpFunction);
document.body.addEventListener("mousemove", mouseMoveFunction);
// touch listeners
document.body.addEventListener("touchstart", mouseDownFunction);
document.body.addEventListener("touchend", mouseUpFunction);
document.body.addEventListener("touchmove", mouseMoveFunction);
