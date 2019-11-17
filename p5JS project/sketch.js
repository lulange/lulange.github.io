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
  scale(0.4); // Scaled to make model fit into canvas
  normalMaterial(); // For effect
  model(house);
}
