// global variable setup
let gameScene = 0; // decider for rendering and listeners
// module aliases
let Engine = Matter.Engine,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

// create an engine
let engine = Engine.create();

// create two boxes and a ground
let boxA = Bodies.rectangle(400, 200, 80, 80);
let boxB = Bodies.rectangle(450, 50, 80, 80);
let ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

// add all of the bodies to the world
Composite.add(engine.world, [boxA, boxB, ground]);

// create runner
let runner = Runner.create();

// run the engine
Runner.run(runner, engine);


// setup p5.js stuff
function setup() {
	// setup canvas in the correct placement
	createCanvas(900, 600).parent("canvas-wrapper");
	// delete off the shell element p5.js makes for the canvas
	document.body.getElementsByTagName("main")[0].remove();
}


function draw() {
	switch(gameScene) {
		case 0:
			background(255, 255, 255);
			fill(0, 0, 0);
			quad(boxA.vertices["0"].x, boxA.vertices["0"].y, boxA.vertices["1"].x, boxA.vertices["1"].y, boxA.vertices["2"].x, boxA.vertices["2"].y, boxA.vertices["3"].x, boxA.vertices["3"].y);
			quad(boxB.vertices["0"].x, boxB.vertices["0"].y, boxB.vertices["1"].x, boxB.vertices["1"].y, boxB.vertices["2"].x, boxB.vertices["2"].y, boxB.vertices["3"].x, boxB.vertices["3"].y);

			break;
	}
}
