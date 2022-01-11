export default class GameScene extends Phaser.Scene {
  constructor(level) {
    super({key: "GameScene"});
  }

  init(data) {

  }

  preload() {
    this.load.image('player-sprite', "https://lulange.github.io/imageHosting/player.png");
  }

  create() {
    this.physics.add.sprite(100, 100, "player-sprite");
  }

  update() {

  }
}
