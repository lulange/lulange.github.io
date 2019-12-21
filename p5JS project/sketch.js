let house;

function preload() {
  // Load model with normalise parameter set to true
  house = loadModel('escapeRoom.obj', true);
}

function setup() {
  createCanvas(500, 500, WEBGL);
  cam = createCamera();
  cam.setPosition(30, 0, 50);
  cam.lookAt(0, 0, 0);
}

function draw() {
  background(200);
  scale(1); // Scaled to make model fit into canvas
  lights();
  rotateY(frameCount * 0.01);
  fill(20, 150, 200);
  noStroke();
  ambientMaterial(100, 100, 255);
  box(200);
}
