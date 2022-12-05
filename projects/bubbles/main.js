/****************
* GAME AREA SETUP
****************/
// global canvas variable
const canvas = document.createElement("CANVAS");
canvas.width = 900;
canvas.height = 600;
// global canvasParent variable
const canvasParent = document.getElementById("canvas-wrapper");
canvasParent.appendChild(canvas);
// global context variable
const ctx = canvas.getContext("2d");
ctx.textAlign = "center";

// Create a linear gradient
const gradient = ctx.createLinearGradient(0, 0, 900, 600);

gradient.addColorStop(0, "#11EEEE");
gradient.addColorStop(0.5, "#01A2A9");
gradient.addColorStop(1, "#004B66");

// Create a radial gradient
// The inner circle is at x=110, y=90, with radius=30
// The outer circle is at x=100, y=100, with radius=70
const radGrad = ctx.createRadialGradient(110, 90, 30, 100, 100, 70);

class Bubble {
	constructor(x, y, radius) {
		this.x = x;
		this.y = y;
		this.r = radius;
	}

	draw() {
		let radGrad = ctx.createRadialGradient(this.x - this.r/2, this.y - r/2, r/8, this.x, this.y, this.r);
	}
}

// Add three color stops
gradient.addColorStop(0, "pink");
gradient.addColorStop(0.9, "white");
gradient.addColorStop(1, "green");

let draw = () => {
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

};

window.setInterval(draw, 10);
