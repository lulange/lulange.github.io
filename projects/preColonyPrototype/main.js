/**********************
 * MY GLOBAL VARIABLES
**********************/

let gameScene = 0; // decider for rendering and listeners
let currentEntity = 0; // which vehicle you have selected to control and edit
let entities = [{ // variable to keep track of created vehicles and stuff
  name: "vehicle1",
  composite: null, // initialized after matter.js
  isEnabled: false,
}];

// for editscene (0) only
let selectedItem = "beam"; // to keep track of the current item being placed
let selectedMaterial = "metal";
let currentCreation = {height: 0};

let adjMouseX; // globally declared, but set in the draw loop
let adjMouseY;


/**********************
 * MATTER.JS SETUP
**********************/
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

entities[0].composite = Composite.create();
Composite.add(entities[0].composite, Bodies.rectangle(200, 200, 40, 40));
console.log(entities[0].composite);



/*********************
 * GLOBAL FUNCTIONS
*********************/
// just a quick space saver
let renderRect = function(rect) {
  quad(rect.vertices["0"].x, rect.vertices["0"].y, rect.vertices["1"].x, rect.vertices["1"].y, rect.vertices["2"].x, rect.vertices["2"].y, rect.vertices["3"].x, rect.vertices["3"].y);
};

/**************************
  * TEMPORARY GLOBAL STUFF
**************************/
// create ground for temporary use
let ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

// add all of the bodies to the world
Composite.add(engine.world, [ground, entities[0].composite]);

/****************
 * P5.JS SETUP
****************/
// setup p5.js stuff
function setup() {
	// setup canvas in the correct placement
	createCanvas(900, 600).parent("canvas-wrapper");
	// delete off the shell element p5.js makes for the canvas
	document.body.getElementsByTagName("main")[0].remove();
}

/**********************
 * MAIN ANIMATION LOOP
**********************/
function draw() {
  adjMouseX = mouseX - 10;
  adjMouseY = mouseY - 10;
	switch(gameScene) {
		case 0: // editing scene

      // white background
			background(255, 255, 255);

      fill(30, 30, 30);
      if (currentCreation.height > 5) {
        let currCreationXBoost = currentCreation.width*Math.cos(-Math.PI/2 + currentCreation.angle);
        let currCreationYBoost = currentCreation.width*Math.sin(-Math.PI/2 + currentCreation.angle);
        quad(currentCreation.x1 + currCreationXBoost/2, currentCreation.y1 + currCreationYBoost/2, currentCreation.x2 + currCreationXBoost/2, currentCreation.y2 + currCreationYBoost/2, currentCreation.x2 - currCreationXBoost/2, currentCreation.y2 - currCreationYBoost/2, currentCreation.x1 - currCreationXBoost/2, currentCreation.y1 - currCreationYBoost/2);
      }
      fill(100, 255, 100);
      renderRect(ground);
      for (var i=0; i<entities.length; i++) {
        for (var j=0; j<entities[i].composite.bodies.length; j++) {
          renderRect(entities[i].composite.bodies[j]);
        }
      }
			break;
	}
}


/***********************
 * EVENT LISTENERS
***********************/
function mousePressed(e) {
  switch(gameScene) {
    case 0:
      currentCreation = {
        x1: adjMouseX,
        y1: adjMouseY,
        width: 16,
        height: 0
      };
      break;
  }
}

function mouseDragged(e) {
  switch(gameScene) {
    case 0:
      currentCreation.angle = Math.atan((adjMouseY - currentCreation.y1) / (adjMouseX - currentCreation.x1));

      currentCreation.x2 = adjMouseX;
      currentCreation.y2 = adjMouseY;
      currentCreation.height = Math.sqrt((adjMouseY - currentCreation.y1)**2 + (adjMouseX - currentCreation.x1)**2);
      break;
  }
}

function mouseReleased(e) {
  switch(gameScene) {
    case 0:
      if (currentCreation.height > 5) {
        // from vertices: (x, y, vertexSets, [options])
        // variables stolen from rendering area...reused for calculations
        let currCreationXBoost = currentCreation.width*Math.cos(-Math.PI/2 + currentCreation.angle);
        let currCreationYBoost = currentCreation.width*Math.sin(-Math.PI/2 + currentCreation.angle);
        let createdMatterBody = Bodies.rectangle((currentCreation.x1 + currentCreation.x2)/2, (currentCreation.y1 + currentCreation.y2)/2, currentCreation.width, currentCreation.height);
        Matter.Body.rotate(createdMatterBody, currentCreation.angle + Math.PI/2);
        Composite.add(entities[currentEntity].composite, createdMatterBody);
      }
      break;
  }
}
