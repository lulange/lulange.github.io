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
ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, canvas.width, canvas.height);
// input SETUP (the inputs need to start with a preselcted value)
document.getElementById("increasing-velocity").checked = true;
document.getElementById("increasing-distance").checked = true;
document.getElementById("increasing-size").checked = true

let sun = {
	width: 50,
	x: 450,
	y: 300,
	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.width, 0, 2*Math.PI);
		ctx.fillStyle = "#FF0000";
		ctx.fill();
	},
};

class Planet {
	constructor(width, x, y, vX, vY) {
		this.width = width;
		this.x = x;
		this.y = y;
		this.velocity = {
			x: vX,
			y: vY,
		};
	}
	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.width, 0, 2*Math.PI);
		ctx.fillStyle = "#00FFFF";
		ctx.fill();
	}
	update() {
		this.x += this.velocity.x;
		this.y += this.velocity.y;
	}
	gravitise() {
	 	let xDiff = sun.x - this.x;
	 	let yDiff = sun.y - this.y;
		let dist = Math.sqrt(xDiff**2 + yDiff**2);
		this.velocity.x += xDiff * (this.width/sun.width) / dist;
		this.velocity.y += yDiff * (this.width/sun.width) / dist;
	}
};

let drawBetweenPlanets = () => {
	ctx.strokeStyle = "#00FF00";
	ctx.lineWidth = 2;
	for (let i=0; i<planets.length-1; i++) {
		ctx.beginPath();
		ctx.moveTo(planets[i].x, planets[i].y);
		ctx.lineTo(planets[i+1].x, planets[i+1].y);
		ctx.stroke();
	}
};

let planets, draw;
let drawInterval = null;
let setup = () => {
	if (drawInterval !== null) {
		window.clearInterval(drawInterval);
		drawInterval = null;
	}
	planets = [];
	// this section is a little messy since I didn't want to redo it all when I added options
	let initialVelocity = document.getElementById("initial-velocity").value / 20;
	let initialDistance = document.getElementById("initial-distance").value * 4;
	let initialWidth = document.getElementById("initial-size").value / 5;
	let velocityNegative = document.getElementById("increasing-velocity").checked ? 1 : -1;
	let distanceNegative = document.getElementById("increasing-distance").checked ? 1 : -1;
	let widthNegative = document.getElementById("increasing-size").checked ? 1 : -1;
	if (document.getElementById("no-velocity").checked) {
		velocityNegative = 0;
	}
	if (document.getElementById("no-distance").checked) {
		distanceNegative = 0;
	}
	if (document.getElementById("no-size").checked) {
		widthNegative = 0;
	}
	for (let i=0; i<100; i++) {
		// Planet(width, x, y, vX, vY)
		planets.push(new Planet(initialWidth + (i/100) * initialWidth * widthNegative, (initialDistance + canvas.width/2) + (i/100) * initialDistance * distanceNegative, 300, 0, initialVelocity + (i/100) * initialVelocity * velocityNegative));
		// perfect orbit:planets.push(new Planet(10, 350, 300, -0.1, 4.5));
	}

	draw = () => {
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		sun.draw();

		for (let i=0; i<planets.length; i++) {
			planets[i].draw();
			planets[i].gravitise();
			planets[i].update();
		}
		if (document.getElementById("connected-planets").checked) {
			drawBetweenPlanets();
		}
	};

	if (drawInterval !== undefined) {
		window.clearInterval(drawInterval);
	}
	drawInterval = window.setInterval(draw, 10);
};

let restartButton = document.getElementById("restart-button");
restartButton.addEventListener("click", function() {
	setup();
});
