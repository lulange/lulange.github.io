class GameScene extends Phaser.Scene {
  constructor() {
    super({key: 'GameScene'});
  }

  preload() {

  }

  create() {
    let playerGraphics = this.add.graphics({x: 0, y: 0});
    playerGraphics.fillStyle(0x4666FF, 1.0);
    playerGraphics.fillRoundedRect(0, 0, 10, 10, 5);
    playerGraphics.generateTexture("player", 10, 10);
    playerGraphics.fillStyle(0x000000, 1.0);
    playerGraphics.fillRect(0, 0, this.sys.canvas.width, this.sys.canvas.height);
    gameState.player = this.physics.add.sprite(20, 300, "player");
    gameState.player.setVelocityX(300);
    gameState.player.setDrag(1200);

    gameState.stack = [];
    this.input.keyboard.on("keydown-RIGHT", (e) => {
      console.log(e);
      if (gameState.player.body.velocity.x !== 0) {
        if (gameState.stack.length === 0) {
          gameState.stack.push(1);
        }
      } else {
        gameState.player.setVelocityX(300);
      }
    });

    this.input.keyboard.on("keydown-LEFT", (e) => {
      console.log(e);
      if (gameState.player.body.velocity.x !== 0) {
        if (gameState.stack.length === 0) {
          gameState.stack.push(-1);
        }
      } else {
        gameState.player.setVelocityX(-300);
      }
    });
  }

  update() {
    if (gameState.player.body.velocity.x === 0 && gameState.stack.length > 0) {
      gameState.player.setVelocityX(300 * gameState.stack[0]);
      gameState.stack.pop();
    }

    if (gameState.player.x > this.sys.canvas.width+10) {
      gameState.player.x = -10;
    } else if (gameState.player.x < -10) {
      gameState.player.x = this.sys.canvas.width+10;
    }
  }
}
