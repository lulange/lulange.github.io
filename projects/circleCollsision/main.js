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

const physicsWorld = {
	circles: [],
	addCircle(circle) {
		this.circles.push(circle);
	},
	collide(circle1, circle2) {
		if (Math.sqrt((circle1.x - circle2.x)**2 + (circle1.y - circle2.y)**2) < (circle1.width/2) + (circle2.width/2)) {

		}
	},
	step() {
		// total mini-loops to prevent tunneling
		for (let i=0; i<2; i++) {
			// step all of the circles
			for (let j=0; j<this.circles.length; j++) {
				let currCircle = this.circles[j];
				currCircle.x += currCircle.velocity.x;
				currCircle.y += currCircle.velocity.y;
			}

			// step all of the circles
			for (let j=0; j<this.circles.length; j++) {
				let currCircle = this.circles[j];
				if (currCircle.x - currCircle.width/2 < 0) {
					currCircle.x = currCircle.width/2;
					currCircle.velocity.x *= -1;
				} else if (currCircle.x + currCircle.width/2 > canvas.width) {
					currCircle.x = canvas.width - currCircle.width/2;
					currCircle.velocity.x *= -1;
				} else if (currCircle.y - currCircle.width/2 < 0) {
					currCircle.y = currCircle.width/2;
					currCircle.velocity.y *= -1;
				} else if (currCircle.y + currCircle.width/2 > canvas.height) {
					currCircle.y = canvas.height - currCircle.width/2;
					currCircle.velocity.y *= -1;
				}

				for (let g=0; g<this.circles.length; g++) {
					if (g !== j) {
						this.collide(currCircle, this.circles[g]);
					}
				}
			}
		}
	},
};

class Circle {
	constructor(x, y, width, vX, vY, color) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.velocity = {
			x: vX,
			y: vY,
		};
		this.color = color || "#FFFFFF";
	}

	draw() {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.width/2, 0, 2*Math.PI);
		ctx.fill();
	}
}

let testCircle = new Circle(100, 20, 50, 1, 0.75);
physicsWorld.addCircle(testCircle);
let secondCircle = new Circle(100, 600, 20, 1, 0.75);
physicsWorld.addCircle(secondCircle);

let draw = () => {
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	physicsWorld.step();
	testCircle.draw();
	secondCircle.draw();
};

window.setInterval(draw, 10);
