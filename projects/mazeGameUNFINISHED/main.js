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
	player: {
		// this refers to whether or not the player is controlling the player
		isActive: false,
		trailSpaces: [{x: 1, y: 1}],
		// this is red
		color: "#FF0000",
		draw() {
			ctx.fillStyle = this.color;
			ctx.beginPath();
			let startCoor = gameState.maze.getPixelCoor(gameState.maze.x, gameState.maze.y, 24, 4, this.trailSpaces[0].x, this.trailSpaces[0].y);
			ctx.arc(startCoor.x + 12, startCoor.y + 12, 9, 0, 2*Math.PI);
			ctx.fill();

			if (this.trailSpaces.length !== 0) {
				ctx.lineWidth = 15;
				ctx.lineJoin = "round";
				ctx.lineCap = "round";
				ctx.strokeStyle = this.color;
				ctx.beginPath();
				ctx.moveTo(startCoor.x + 12, startCoor.y + 12);
				for (let i=0; i<this.trailSpaces.length; i++) {
					let coor = gameState.maze.getPixelCoor(gameState.maze.x, gameState.maze.y, 24, 4, this.trailSpaces[i].x, this.trailSpaces[i].y)
					ctx.lineTo(coor.x + 12, coor.y + 12);
				}
				ctx.stroke();
			}
		},
		update() {
			if (this.isActive === true) {

			}
		},
	},

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
		this.transitionQuad.direction = direction;
		this.transitionQuad.x = direction === "forward" ? -1800 : 1800;
		this.transitionQuad.onTransition = function() {
			game.runScene(mode);
		};
		this.transitionQuad.transitioning = true;
	},

	transitionQuad: {
		x: -1800,
		transitioning: false,
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
	if (game.currScene === "gameScene") {
		let mazeSpace = gameState.maze.getMazeCoor(gameState.maze.x, gameState.maze.y, 24, 4, gameState.mouse.x, gameState.mouse.y);
		gameState.mouse.mazeCoor = {
			x: mazeSpace.x,
			y: mazeSpace.y
		};
		if (gameState.player.isActive === true) {
			let endTrailSpace = gameState.player.trailSpaces[gameState.player.trailSpaces.length - 1];
			if (((gameState.mouse.mazeCoor.x === endTrailSpace.x + 2 || gameState.mouse.mazeCoor.x === endTrailSpace.x - 2) && gameState.mouse.mazeCoor.y === endTrailSpace.y) || ((gameState.mouse.mazeCoor.y === endTrailSpace.y + 2 || gameState.mouse.mazeCoor.y === endTrailSpace.y - 2) && gameState.mouse.mazeCoor.x === endTrailSpace.x)) {
				let verificationFunction = (s) => {return gameState.mouse.mazeCoor.x === s.x && gameState.mouse.mazeCoor.y === s.y};
				let indexOfTrailSpace = gameState.player.trailSpaces.findIndex(verificationFunction);
				if (indexOfTrailSpace !== -1) {
					gameState.player.trailSpaces.splice(indexOfTrailSpace + 1, gameState.player.trailSpaces.length - indexOfTrailSpace + 1);
				} else if (gameState.mouse.mazeCoor.x > -1 && gameState.mouse.mazeCoor.y > -1) {
					gameState.player.trailSpaces.push({x: gameState.mouse.mazeCoor.x, y: gameState.mouse.mazeCoor.y});
				}
			}
		}
	}
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
			speed = 18;
		}
		if (data === undefined || data === null) {
			data = {};
		}
		if (this.sceneInterval !== null) {
			window.clearInterval(this.sceneInterval);
			this.sceneInterval = null;
		}
		// a sorting function to find the correct scene
		const isCorrectKey = (scene) => {return scene.key === key};
		// The function that finds the correct index using the sorting function above
		const sceneIndex = this.scenes.findIndex(isCorrectKey);
		// the scene found
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
					gameState.transitionQuad.x += 40;
					if (gameState.transitionQuad.x === 1800) {
						gameState.transitionQuad.transitioning = false;
					}
				} else if (gameState.transitionQuad.direction === "back") {
					gameState.transitionQuad.x -= 40;
					if (gameState.transitionQuad.x === -1800) {
						gameState.transitionQuad.transitioning = false;
					}
				}
				gameState.transitionQuad.draw();
			}
		}, speed);
	}

	deleteScene(key) {
		if (this.currScene === key) {
			console.log("Cannot delete the current scene!");
		} else {
			const isCorrectKey = (scene) => {return scene.key === key};
			const sceneIndex = this.scenes.findIndex(isCorrectKey);
			this.scenes.splice(sceneIndex, 1);
		}
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

game.createScene("gameScene", function(data) {
	gameState.maze = new Maze(ctx, 25, 21);
	gameState.maze.x = Math.round(canvas.width - gameState.maze.getWidth(24, 4) - Math.round((canvas.height - gameState.maze.getHeight(24, 4)) / 2));
	gameState.maze.y = Math.round((canvas.height - gameState.maze.getHeight(24, 4)) / 2);

	gameState.text = [];
	gameState.text.push(new Text("Change Mode", Math.round(gameState.maze.x/2), 60, gameState.colorScheme.textColor, "20px"));
	gameState.text.push(new Text("Main Menu", Math.round(gameState.maze.x/2), 100, gameState.colorScheme.textColor, "20px"));
}, function(data) {
	gameState.drawBackground("black");
	gameState.maze.display(gameState.maze.x, gameState.maze.y, 24, 4, gameState.colorScheme.textColor, "#000000");
	gameState.text.forEach(text => {
		if (text.isMouseOver()) {
			text.color = gameState.colorScheme.textHighLightColor;
		} else {
			text.color = gameState.colorScheme.textColor;
		}
		text.draw();
		gameState.player.draw();
		gameState.player.update();
	});
});

/**********************
* THE MOUSE UP LISTENER
**********************/
canvas.addEventListener("mouseup", (e) => {
	gameState.player.isActive = false;
	if (gameState.transitionQuad.transitioning === false) {
		// THE MAIN MENU
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
					} else if (text.msg === "Free Play") {
						gameState.transitionTo("gameScene");
					}
				}
			});
		}  else if (game.currScene === "gameScene") {
			gameState.text.forEach(text => {
				if (text.color === gameState.colorScheme.textHighLightColor) {
					if (text.msg === "Change Mode") {
						gameState.transitionTo("modeSelect", "back");
					} else if (text.msg === "Main Menu") {
						gameState.transitionTo("mainMenu", "back");
					}
				}
			});
		}
	}
});

/**********************
* THE MOUSE DOWN LISTENER
**********************/
canvas.addEventListener("mousedown", (e) => {
	if (game.currScene === "gameScene") {
		let verificationFunction = (s) => {return gameState.mouse.mazeCoor.x === s.x && gameState.mouse.mazeCoor.y === s.y};
		let indexOfTrailSpace = gameState.player.trailSpaces.findIndex(verificationFunction);
		if (indexOfTrailSpace !== -1) {
			gameState.player.trailSpaces.splice(indexOfTrailSpace + 1, gameState.player.trailSpaces.length - indexOfTrailSpace + 1);
			gameState.player.isActive = true;
		}
	}
});

// THE KICK OFF LINE
game.runScene("mainMenu");
