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

let angle = 0;

class Line {
	constructor(x1, y1, dist, slope, aPP) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x1;
		this.y2 = y1;
		this.dist = dist;
		this.slope = slope;
		this.anglePlusPlus = aPP;
	}

	setX2Y2() {
		if ((angle * this.anglePlusPlus) % 360 < 90) {
			let run = this.dist / Math.sqrt(this.slope**2 + 1);
			let rise = this.slope * run;
			this.x2 = this.x1 + run;
			this.y2 = this.y1 + rise;
		} else if ((angle * this.anglePlusPlus) % 360 > 270) {
			let run = this.dist / Math.sqrt(this.slope**2 + 1);
			let rise = this.slope * run;
			this.x2 = this.x1 + run;
			this.y2 = this.y1 + rise;
		} else if ((angle * this.anglePlusPlus) % 360 === 90) {
			let rise = this.dist;
			this.x2 = this.x1;
			this.y2 = this.y1 + rise;
			console.log(this.slope);
		}  else if ((angle * this.anglePlusPlus) % 360 === 270) {
			let rise = this.dist;
			this.x2 = this.x1;
			this.y2 = this.y1 - rise;
			console.log(this.slope);
		} else {
			let run = this.dist / Math.sqrt(this.slope**2 + 1);
			let rise = this.slope * run;
			this.x2 = this.x1 - run;
			this.y2 = this.y1 - rise;
		}
	}
}

let lines = [];
for (let i=0; i<35; i++) {
	if (i%2 === 0) {
		lines.push(new Line(400, 300, 100, 0, i+1));
	} else {
		lines.push(new Line(500, 300, -100, 0, i+1));
	}
}

let draw = () => {
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	let slopeOfLine = null;
	ctx.strokeStyle = "#FF00FF";
	for (let i=0; i<lines.length; i++) {
		if (slopeOfLine === null) {
			lines[i].slope = Math.tan(angle * Math.PI / 180);
		} else {
			lines[i].x1 = lines[i-1].x2;
			lines[i].y1 = lines[i-1].y2;
			if (Math.atan(slopeOfLine) + (angle * Math.PI / 180) === 90 || Math.atan(slopeOfLine) + (angle * Math.PI / 180) === 270) {
				if (i === 0) {
					console.log(Math.atan(slopeOfLine) + (angle * Math.PI / 180));
				}
				lines[i].slope = Math.tan(Math.atan(slopeOfLine) + (angle * Math.PI / 180) + 0.1);
			} else {
				lines[i].slope = Math.tan(Math.atan(slopeOfLine) + (angle * Math.PI / 180));
			}
		}
		slopeOfLine = lines[i].slope;
		lines[i].setX2Y2();
		ctx.beginPath();
		ctx.moveTo(lines[i].x1, lines[i].y1);
		ctx.lineTo(lines[i].x2, lines[i].y2);
		ctx.stroke();
	}

	angle += 0.01;
	if (angle === 360) {
		angle = 0;
	}
};

window.setInterval(draw, 10);
