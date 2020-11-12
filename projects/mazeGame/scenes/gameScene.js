class GameScene extends Phaser.Scene {
  constructor() {
    super({key: 'GameScene'});
  }

  preload() {
  }

  create() {
    let coinGraphic = this.add.graphics({x: 0, y: 0});
    coinGraphic.fillStyle(0xffd700, 1.0);
    coinGraphic.fillCircle(12, 12, 10);
    coinGraphic.fillStyle(0x000000, 1.0);
    coinGraphic.fillCircle(12, 12, 4);
    coinGraphic.lineStyle(2, 0xdaa520, 1.0);
    coinGraphic.strokeCircle(12, 12, 10);
    coinGraphic.generateTexture("coin", 24, 24);
    gameState.coin = this.add.sprite(100, 100, "coin");
    gameState.coin.setDepth(1);



    let playerGraphics = this.add.graphics({x: 0, y: 0});
    playerGraphics.fillStyle(0x23e000, 1.0);
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


    gameState.maze = new Maze(this.sys.canvas.getContext("2d"));
    console.log(gameState.maze);
    gameState.maze.display(0, 0, 20, 4, "#FF0000", "#0000FF");
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
