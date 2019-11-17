let house;

function preload() {
  // Load model with normalise parameter set to true
  house = loadModel('house.obj', true);
}

function setup() {
  createCanvas(500, 500, WEBGL);
}

function draw() {
  background(200);
  scale(1); // Scaled to make model fit into canvas
  lights();
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  fill(20, 150, 200);
  ambientMaterial();
  model(house);
}
