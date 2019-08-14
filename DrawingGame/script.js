// setup
document.body.style.height = screen.height + "px";

var isMouseDown = false;
var drawWidth = 35;



var draw = function(x, y) {
  var divEl = document.createElement("div");
  divEl.style.position = "absolute";
  divEl.style.backgroundColor = "rgb(255, 255, 0)";
  divEl.style.left = x-drawWidth/2 + "px";
  divEl.style.top = y-drawWidth/2 + "px";
  divEl.style.width = drawWidth + "px";
  divEl.style.height = drawWidth + "px";
  divEl.style.borderRadius = 50 + "%";
  document.body.appendChild(divEl);
};

var mouseMoveFunction = function(e) {
  if (isMouseDown === true) {
    draw(e.pageX, e.pageY);
  }
};

var mouseDownFunction = function(e) {
  isMouseDown = true;
  draw(e.pageX, e.pageY);
};

var mouseLeaveFunction = function(e) {
  isMouseDown = false;
};

var mouseUpFunction = function(e) {
  isMouseDown = false;
};

document.body.addEventListener("mousedown", mouseDownFunction);
document.body.addEventListener("mouseup", mouseUpFunction);
document.body.addEventListener("mousemove", mouseMoveFunction);
document.body.addEventListener("mouseleave", mouseLeaveFunction);
