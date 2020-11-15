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

/*******************************
* GAMESTATE VARIABLE DECLARATION
*******************************/
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

	transitionTo(mode, direction) {
		if (direction === undefined || direction === null) {
			direction = "forward";
		}
		this.transitionQuad.x = direction === "forward" ? -1800 : 1800;
		this.transitionQuad.direction = direction;
		this.transitionQuad.onTransition = function() {
			game.runScene(mode);
		};
		this.transitionQuad.transitioning = true;
	},

	transitionQuad: {
		x: -1800,
		tranistioning: false,
		direction: "forward",
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

	colorScheme: {
		textColor: "#0099FF",
		textHighLightColor: "#0bda51",
	},
};
// listener that keeps track of the current mouse variables
canvas.addEventListener("mousemove", (event) => {
	gameState.mouse.x = event.offsetX;
	gameState.mouse.y = event.offsetY;
});

/***********************
* GAME CLASS DECLARATION
***********************/
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
			speed = 10;
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
		this.sceneInterval = window.setInterval(function() {
			scene.loopFunction(data);
			if (gameState.transitionQuad.transitioning) {
				if (gameState.transitionQuad.x === 0) {
					gameState.transitionQuad.onTransition();
				}
				if (gameState.transitionQuad.direction === "forward") {
					gameState.transitionQuad.x += 30;
					if (gameState.transitionQuad.x === 1800) {
						gameState.transitionQuad.transitioning = false;
					}
				} else if (gameState.transitionQuad.direction === "back") {
					gameState.transitionQuad.x -= 30;
					if (gameState.transitionQuad.x === -1800) {
						gameState.transitionQuad.transitioning = false;
					}
				}
				gameState.transitionQuad.draw();
			}
		}, speed);
	}

	deleteScene(key) {
		const isCorrectKey = (scene) => {return scene.key === key};
		const sceneIndex = this.scenes.findIndex(isCorrectKey);
		this.scenes.splice(sceneIndex, 1);
	}
}

/*************************
* OTHER CLASS DECLARATIONS
*************************/
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

/********************
* SCENES/MAIN PROGRAM
********************/
// the global instance of the game/scene manager
// the data object will keep any changes given at any point in either function through loops and between functions
const game = new Game();
// main menu scene
game.createScene("mainMenu", function(data) {
	gameState.text = [];
	gameState.text.push(new Text("Maze Game", canvas.width/2, 200, gameState.colorScheme.textColor, "100px"));
	gameState.text.push(new Text("1 Player", canvas.width/2, 300, gameState.colorScheme.textColor, "50px"));
	gameState.text.push(new Text("2 Player", canvas.width/2, 375, gameState.colorScheme.textColor, "50px"));
	gameState.text.push(new Text("Options", canvas.width/2, 450, gameState.colorScheme.textColor, "50px"));
	gameState.text.push(new Text("Stats", canvas.width/2, 525, gameState.colorScheme.textColor, "50px"));
}, function(data) {
	gameState.drawBackground("black");
	gameState.text.forEach(text => {
		if (text.isMouseOver() && text.msg !== gameState.text[0].msg) {
			text.color = gameState.colorScheme.textHighLightColor;
		} else {
			text.color = gameState.colorScheme.textColor;
		}
		text.draw();
	});
});

game.createScene("modeSelect", function(data) {
	gameState.text = [];
	gameState.text.push(new Text("Select A Mode", canvas.width/2, 200, gameState.colorScheme.textColor, "100px"));
	gameState.text.push(new Text("Free Play", canvas.width/2, 300, gameState.colorScheme.textColor, "50px"));
	gameState.text.push(new Text("Hot/Cold", canvas.width/2, 375, gameState.colorScheme.textColor, "50px"));
	gameState.text.push(new Text("Timed", canvas.width/2, 450, gameState.colorScheme.textColor, "50px"));
	gameState.text.push(new Text("Race", canvas.width/2, 525, gameState.colorScheme.textColor, "50px"));
	gameState.text.push(new Text("Back", 60, 60, gameState.colorScheme.textColor, "40px"));
}, function(data) {
	gameState.drawBackground("black");
	gameState.text.forEach(text => {
		if (text.isMouseOver() && text.msg !== gameState.text[0].msg) {
			text.color = gameState.colorScheme.textHighLightColor;
		} else {
			text.color = gameState.colorScheme.textColor;
		}
		text.draw();
	});
});

game.createScene("options", function(data) {
}, function(data) {
	gameState.drawBackground("blue");


});

/**********************
* THE MOUSE UP LISTENER
**********************/
canvas.addEventListener("mouseup", (e) => {
	if (gameState.transitionQuad.tranistioning === false) {
		if (game.currScene === "mainMenu") {
			gameState.text.forEach(text => {
				if (text.color === gameState.colorScheme.textHighLightColor) {
					if (text.msg === "1 Player") {
						gameState.transitionTo("modeSelect");
					} else if (text.msg === "2 Player") {
						// game.runScene("gameScene");
					} else if (text.msg === "Options") {
						gameState.transitionTo("options");
					} else if (text.msg === "Stats") {
						// game.runScene("stats");
					}
				}
			});
		} else if (game.currScene === "modeSelect") {
			gameState.text.forEach(text => {
				if (text.color === gameState.colorScheme.textHighLightColor) {
					if (text.msg === "Back") {
						gameState.transitionTo("mainMenu", "back");
					}
				}
			});
		}
	}
});

// kick off line
game.runScene("mainMenu");
