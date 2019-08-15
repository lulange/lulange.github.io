
// setup
document.body.style.height = screen.height + "px";
document.body.style.width = screen.width + "px";

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
    draw(e.touches[touchCounter].clientX, e.touches[touchCounter].clientY);
    touchCounter++;
  }
};

var mouseDownFunction = function(e) {
  isMouseDown = true;
  draw(e.pageX, e.pageY);
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
