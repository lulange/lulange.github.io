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
// global utility variable used to hold values that must be present from scene to scene
const gameState = {
	drawBackground(color) {
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	},

	mouse: {
		x: null,
		y: null
	},

	transitionQuad: {
		x: -1800,
		tranistioning: false,
		onTransition: null,
		draw() {
			ctx.fillStyle = "white";
			ctx.beginPath();
			ctx.moveTo(this.x, 0);
			ctx.lineTo(this.x+(canvas.width*2), 0);
			ctx.lineTo(this.x+canvas.width, canvas.height);
			ctx.lineTo(this.x-(canvas.width), canvas.height);
			ctx.closePath();
			ctx.fill();
		},
	},
};
// listener that keeps track of the current mouse variables
canvas.addEventListener("mousemove", (event) => {
	gameState.mouse.x = event.offsetX;
	gameState.mouse.y = event.offsetY;
});

// global scene/game manager
class Game {
	constructor() {
		this.currScene = null;
		this.scenes = [];
		this.sceneInterval = null;
	}

	createScene(key, startupFunction, loopFunction) {
		this.scenes.push({key: key, startupFunction: startupFunction, loopFunction: loopFunction});
	}

	runScene(key, data, speed) {
		if (speed === undefined || speed === null) {
			speed = 30;
		}
		if (data === undefined || data === null) {
			data = {};
		}
		if (this.sceneInterval !== null) {
			window.clearInterval(this.sceneInterval);
			this.sceneInterval = null;
		}
		const isCorrectKey = (scene) => {return scene.key === key};
		const sceneIndex = this.scenes.findIndex(isCorrectKey);
		let scene = this.scenes[sceneIndex];
		this.currScene = scene.key;
		scene.startupFunction(data);
		window.setInterval(function() {scene.loopFunction(data);}, speed);
	}

	deleteScene(key) {
		const isCorrectKey = (scene) => {return scene.key === key};
		const sceneIndex = this.scenes.findIndex(isCorrectKey);
		this.scenes.splice(sceneIndex, 1);
	}
}

// global text class used to ease the of process of displaying text
class Text {
	constructor(msg, x, y, color, fontSize) {
		this.msg = msg;
		this.x = x;
		this.y = y;
		this.color = color || "black";
		this.fontSize = fontSize || "10px";
		ctx.font = this.fontSize + " comic sans MS";
		this.width = ctx.measureText(this.msg).width;
		this.height = parseInt(this.fontSize);
	}

	draw() {
		ctx.fillStyle = this.color;
		ctx.font = this.fontSize + " comic sans MS";
		ctx.fillText(this.msg, this.x, this.y);
	}

	isMouseOver() {
		if (gameState.mouse.x > this.x-(this.width/2) && gameState.mouse.x < this.x+(this.width/2) && gameState.mouse.y > this.y-this.height && gameState.mouse.y < this.y) {
			return true;
		} else {
			return false;
		}
	}
}

// the global instance of the game/scene manager
// the data object will keep any changes given at any point in either function through loops and between functions
const game = new Game();
game.createScene("mainMenu", function(data) {
	gameState.text = [];
	gameState.text.push(new Text("Maze Game", canvas.width/2, 200, "#0099FF", "100px"));
	gameState.text.push(new Text("1 Player", canvas.width/2, 300, "#0099FF", "50px"));
	gameState.text.push(new Text("2 Player", canvas.width/2, 375, "#0099FF", "50px"));
	gameState.text.push(new Text("Options", canvas.width/2, 450, "#0099FF", "50px"));
	gameState.text.push(new Text("Stats", canvas.width/2, 525, "#0099FF", "50px"));
}, function(data) {
	gameState.drawBackground("black");
	gameState.text.forEach(text => {
		if (text.isMouseOver() && text.msg !== gameState.text[0].msg) {
			text.color = "#0055FF";
		} else {
			text.color = "#0099FF";
		}
		text.draw();
	});

	if (gameState.transitionQuad.transitioning) {
		gameState.transitionQuad.x += 20;
		gameState.transitionQuad.draw();
		if (gameState.transitionQuad.x === 0) {
			gameState.transitionQuad.onTransition();
		}
	}
	console.log("still running mainmenu loop");
});

game.createScene("modeSelect", function(data) {
	gameState.text = [];
	gameState.text.push(new Text("Mode Selection", canvas.width/2, 200, "#0099FF", "100px"));
	gameState.text.push(new Text("Free play", canvas.width/2, 300, "#0099FF", "50px"));
	gameState.text.push(new Text("Hot/Cold", canvas.width/2, 375, "#0099FF", "50px"));
	gameState.text.push(new Text("Timed", canvas.width/2, 450, "#0099FF", "50px"));
	gameState.text.push(new Text("Race", canvas.width/2, 525, "#0099FF", "50px"));
}, function(data) {
	gameState.drawBackground("black");
	gameState.text.forEach(text => {
		if (text.isMouseOver() && text.msg !== gameState.text[0].msg) {
			text.color = "#0055FF";
		} else {
			text.color = "#0099FF";
		}
		text.draw();
	});
	console.log("still running oesel loop");
});
game.runScene("mainMenu");

canvas.addEventListener("mouseup", (e) => {
	if (gameState.transitionQuad.tranistioning === false) {
		if (game.currScene === "mainMenu") {
			gameState.text.forEach(text => {
				if (text.color === "#0055FF") {
					if (text.msg === "1 Player") {
						gameState.transitionQuad.onTransition = function() {
							game.runScene("modeSelect");
						};
						gameState.transitionQuad.transitioning = true;
					} else if (text.msg === "2 Player") {
						// game.runScene("gameScene");
					} else if (text.msg === "Options") {
						// game.runScene("options");
					} else if (text.msg === "Stats") {
						// game.runScene("stats");
					}
				}
			});
		}
	}
});
