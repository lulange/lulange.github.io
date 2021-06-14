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
let planets;


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
	gravitise(celestialBody) {
		let xDiff = celestialBody.x - this.x;
	 	let yDiff = celestialBody.y - this.y;
		let dist = Math.sqrt(xDiff**2 + yDiff**2);
		this.velocity.x += xDiff * (celestialBody.width/this.width) / dist / 10;
		this.velocity.y += yDiff * (celestialBody.width/this.width) / dist / 10;
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


let drawInterval = null;
let setup = () => {
	if (drawInterval !== null) {
		window.clearInterval(drawInterval);
		drawInterval = null;
	}
	planets = [];
	// add planets
	// width, x, y, vX, vY
	planets.push(new Planet(30, 200, 200, 0, 0));
	planets.push(new Planet(15, 600, 400, 0, 0));
	planets.push(new Planet(15, 700, 100, 0, 0));

	// looping function for updating and drawing
	draw = () => {
		// draw black background
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// update planets in two steps: first set all velocities based on other planets locations. then update and draw
		for (let q=0; q<planets.length; q++) {
			for (let k=0; k<planets.length; k++) {
				if (q !== k) {
					planets[q].gravitise(planets[k]);
				}
			}
		}

		for (let i=0; i<planets.length; i++) {
			planets[i].update();
			planets[i].draw();
		}

		//drawBetweenPlanets(); for testing

	};

	drawInterval = window.setInterval(draw, 10);
};


let restartButton = document.getElementById("restart-button");
restartButton.addEventListener("click", function() {
	setup();
});
