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
	/*gravitise() {
	 	let xDiff = sun.x - this.x;
	 	let yDiff = sun.y - this.y;
		let dist = Math.sqrt(xDiff**2 + yDiff**2);
		this.velocity.x += xDiff * (this.width/sun.width) / dist;
		this.velocity.y += yDiff * (this.width/sun.width) / dist;
	}*/ //this is the function that I need to expand
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
	// width, x, y, vX, vY
	planets.push(new Planet());

	// looping function for updating and drawing
	draw = () => {
		// draw black background
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// update planets in two steps: first set all velocities based on other planets locations. then update and draw
		for (let i=0; i<planets.length; i++) {
			//planets[i].gravitise(); being worked on
		}

		for (let i=0; i<planets.length; i++) {
			planets[i].update();
			planets[i].draw();
		}

		//drawBetweenPlanets(); for testing

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
