// global variable setup
let gameScene = 0; // decider for rendering and listeners
let selectedMaterial = "metal";
let currentCreation;
let shapes = [];
// module aliases
let Engine = Matter.Engine,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

// create an engine
let engine = Engine.create();

// create runner
let runner = Runner.create();

// run the engine
Runner.run(runner, engine);

// just a quick space saver
let renderRect = function(rect) {
  quad(rect.vertices["0"].x, rect.vertices["0"].y, rect.vertices["1"].x, rect.vertices["1"].y, rect.vertices["2"].x, rect.vertices["2"].y, rect.vertices["3"].x, rect.vertices["3"].y);
};

// create two boxes and a ground
let boxA = Bodies.rectangle(400, 200, 80, 80);
let boxB = Bodies.rectangle(450, 50, 80, 80);
let ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

// add all of the bodies to the world
Composite.add(engine.world, [boxA, boxB, ground]);


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
			renderRect(boxA);
      renderRect(boxB);
      fill(100, 255, 100);
      renderRect(ground);
			break;
	}
}

// setup shape creation for beams
function mousePressed(e) {
  switch(gameScene) {
    case 0:
      currentCreation = {
        x: e.x,
        y: e.y,
        width: 24,
        height: 0
      };
      break;
  }
}

function mouseMoved(e) {
  switch(gameScene) {
    case 0:
      currentCreation = {
        x: e.x,
        y: e.y,
        width: 24,
        height: 0
      };
      break;
  }
}

function mouseReleased(e) {
  switch(gameScene) {
    case 0:
      currentCreation = {
        x: e.x,
        y: e.y,
        width: 24,
        height: 0
      };
      break;
  }
}
