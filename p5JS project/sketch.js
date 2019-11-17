let house;

function preload() {
  // Load model with normalise parameter set to true
  house = loadModel('house.stl', true);
}

function setup() {
  createCanvas(100, 100, WEBGL);
}

function draw() {
  background(200);
  scale(0.4); // Scaled to make model fit into canvas
  normalMaterial(); // For effect
  model(house);
}
