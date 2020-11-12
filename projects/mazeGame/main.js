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
// global utility variable used to hold values that must be present from scene to scene
const gameState = {

};

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
