
// setup
document.body.style.height = window.innerHeight + "px";
document.body.style.width = window.innerWidth + "px";

var drawingArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 70;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

drawingArea.start();

// global variables
var pastX;
var pastY;
var ctx = drawingArea.context;
var isMouseDown = false;
var drawColor = "yellow";
var selectors = document.getElementsByClassName("color-selector");
ctx.strokeStyle = drawColor;
ctx.lineWidth = document.getElementById("size-input").value;
ctx.lineJoin = 'round';



var draw = function(x, y) {
  ctx.lineTo(x, y);
  if (pastX !== undefined && pastY !== undefined) {
    ctx.lineTo(pastX, pastY);
    ctx.moveTo(x, y);
  }
  ctx.lineWidth = document.getElementById("size-input").value;
  ctx.fillStyle = drawColor;
  ctx.strokeStyle = drawColor;
  ctx.stroke();
  pastX = x;
  pastY = y;
};


var mouseMoveFunction = function(e) {
  if (isMouseDown === true) {
    draw(e.clientX, e.clientY);
  }
};

var mouseDownFunction = function(e) {
  // draw a circle where mouse goes down
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);
  ctx.arc(e.clientX, e.clientY, document.getElementById("size-input").value/2, 0*Math.PI, 2*Math.PI);
  ctx.fillStyle = drawColor;
  ctx.fill();
  // mouse down true
  isMouseDown = true;
  // start drawing the line
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);
};

var mouseUpFunction = function(e) {
  pastX = undefined;
  pastY = undefined;
  isMouseDown = false;
};


var touchMoveFunction = function(e) {
  if (isMouseDown === true) {
    draw(e.touches[0].clientX, e.touches[0].clientY);
  }
};

var touchStartFunction = function(e) {
  // draw a circle where mouse goes down
  ctx.beginPath();
  ctx.moveTo(e.touches[0].clientX, e.touches[0].clientY);
  ctx.arc(e.touches[0].clientX, e.touches[0].clientY, document.getElementById("size-input").value/2, 0*Math.PI, 2*Math.PI);
  ctx.fillStyle = drawColor;
  ctx.fill();
  // mouse down true
  isMouseDown = true;
  // start drawing the line
  ctx.beginPath();
  ctx.moveTo(e.touches[0].clientX, e.touches[0].clientY);
};

var touchEndFunction = function(e) {
  pastX = undefined;
  pastY = undefined;
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
drawingArea.canvas.addEventListener("mousedown", mouseDownFunction);
drawingArea.canvas.addEventListener("mouseup", mouseUpFunction);
drawingArea.canvas.addEventListener("mousemove", mouseMoveFunction);
// touch listeners
drawingArea.canvas.addEventListener("touchstart", touchStartFunction);
drawingArea.canvas.addEventListener("touchend", touchEndFunction);
drawingArea.canvas.addEventListener("touchmove", touchMoveFunction);

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
