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
		ctx.fillStyle = "#00FF00";
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

let planets = [];
for (let i=0; i<2; i++) {
	random: planets.push(new Planet(Math.random() * 8 + 2, Math.random()*300, 300, 0, Math.random()*4 + 2));
	// descending size:planets.push(new Planet(8 - (i/100) * 8, 250, 300, 0, 4));
	// descending velocity:planets.push(new Planet(8, 250, 300, 0, 5 - (i/100) * 5));
	// both of the two above:planets.push(new Planet(8 - (i/100) * 8, 250, 300, 0, 5 - (i/100) * 5));
	// descending size and low start velocity:planets.push(new Planet(8 - (i/100) * 8, 250, 300, 0, 0.2));
	// descending size and descending x coor with low start velocity:planets.push(new Planet(8 - (i/100) * 8, 300 - (i/100) * 200, 300, 0, 0.2));planets.push(new Planet(8, 300 - (i/100) * 200, 300, 0, 5));

}

let draw = () => {
	//ctx.fillStyle = "#000000";
	//ctx.fillRect(0, 0, canvas.width, canvas.height);
	sun.draw();

	for (let i=0; i<planets.length; i++) {
		planets[i].draw();
		planets[i].gravitise();
		planets[i].update();
	}
};

window.setInterval(draw, 10);
