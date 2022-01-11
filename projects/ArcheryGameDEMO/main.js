import GameScene from "./scenes/gameScene.js";


const config = {
  parent: "canvas-wrapper",
  scale: {
    width: 900,
    height: 600,
    zoom: 1,
    resolution: 1.1,
  },
  scene: [GameScene],
  title: "ARCHERYGAMEDEMO",
  version: "1.1",
  backgroundColor: "0f9200",
  fps: {
    target: 60,
  },
  physics: {
    default: "matter",
    matter: {
      gravity: {
        y: 0,
        x: 0,
      },
      velocityIterations: 20,
      positionIterations: 20,
      timing: {
        timeScale: 1,
      },
    }
  }
};

const game = new Phaser.Game(config);
