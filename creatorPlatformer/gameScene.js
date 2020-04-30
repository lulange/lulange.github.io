class GameScene extends Phaser.Scene {
  constructor() {
    super({key: 'GameScene'});
  }


  preload() {
    this.load.image('player', 'https://lulange.github.io/player.png');
    this.load.image('key', 'https://lulange.github.io/key.png');
    this.load.image('door', 'https://lulange.github.io/door.png');
    this.load.image('player-key', 'https://lulange.github.io/player-b.png');
    this.load.image('spike', 'https://lulange.github.io/spike.png');
    this.load.image('portal', 'https://lulange.github.io/portal.png');
    this.load.image('arrow', 'https://lulange.github.io/arrow.png');
    gameState.loadingCover = this.add.rectangle(gameState.playerXAndY.x*30+15, gameState.playerXAndY.y*30+18, 2000, 2000, "0x000000").setDepth(2);
    gameState.loading = true;
    this.physics.pause();
  }

  create() {
    // create blockCoorTracker array
    {
      for (var i=0; i<30; i++) {
        gameState.blockCoorTracker[i] = [];
        for (var t=0; t<30; t++) {
          gameState.blockCoorTracker[i][t] = "blank";
        }
      }
    }

    gameState.player = this.physics.add.sprite(gameState.playerXAndY.x*30+15, gameState.playerXAndY.y*30+18, 'player').setDepth(1);
    gameState.player.setCollideWorldBounds(true);
    gameState.cursors = this.input.keyboard.createCursorKeys();

    // create: static groups
    gameState.blocks = this.physics.add.staticGroup();
    gameState.lava = this.physics.add.staticGroup();
    gameState.doors = this.physics.add.staticGroup();
    gameState.keys = this.physics.add.staticGroup();
    gameState.spikes = this.physics.add.staticGroup();
    gameState.portals = this.physics.add.staticGroup();
    gameState.arrows = this.physics.add.staticGroup();

    // create: create functions
    gameState.createBlock = (xBlocks, yBlocks) => {
      let rectX = xBlocks * 30 + 15;
      let rectY = yBlocks * 30 + 15;
      let blockHolder;
      // create rectangle
      blockHolder = this.add.rectangle(rectX, rectY, 30, 30, '0x008000');
      // add the rectangle to blocks group
      gameState.blocks.add(blockHolder);
      gameState.blockCoorTracker[xBlocks][yBlocks] = blockHolder;
    };
    gameState.createLava = (xBlocks, yBlocks) => {
      let rectX = xBlocks * 30 + 15;
      let rectY = yBlocks * 30 + 15;
      let lavaHolder;
      // create rectangle
      lavaHolder = this.add.rectangle(rectX, rectY, 30, 30, '0xFF2222');
      // add the rectangle to blocks group
      gameState.lava.add(lavaHolder);
    };
    gameState.createDoor = (xBlocks, yBlocks) => {
      let blockX = xBlocks * 30 + 15;
      let blockY = yBlocks * 30 + 15;
      gameState.doors.create(blockX, blockY, 'door');
    };
    gameState.createKey = (xBlocks, yBlocks) => {
      let keyX = xBlocks * 30 + 15;
      let keyY = yBlocks * 30 + 15;
      gameState.keys.create(keyX, keyY, 'key');
    };
    gameState.createSpike = (xBlocks, yBlocks, angle) => {
      let spikeX;
      let spikeY;
      switch (angle) {
        case 90:
        spikeX = xBlocks * 30 + 7;
        spikeY = yBlocks * 30 + 15;
        break;

        case 180:
        spikeX = xBlocks * 30 + 15;
        spikeY = yBlocks * 30 + 7;
        break;

        case 270:
        spikeX = xBlocks * 30 + 23;
        spikeY = yBlocks * 30 + 15;
        break;

        case 0:
        spikeX = xBlocks * 30 + 15;
        spikeY = yBlocks * 30 + 23;
        break;

      }
      gameState.spikes.create(spikeX, spikeY, 'spike').setAngle(angle);
    };
    gameState.createPortal = (xBlocks, yBlocks) => {
      let portX = xBlocks * 30 + 15;
      let portY = yBlocks * 30 + 15;
      gameState.portals.create(portX, portY, 'portal').setSize(10, 10).setOffset(10, 10);
    };
    gameState.createArrow = (xBlocks, yBlocks, angle) => {
      let arrowX = xBlocks * 30 + 15;
      let arrowY = yBlocks * 30 + 15;
      gameState.arrows.create(arrowX, arrowY, 'arrow').setAngle(angle);
    };

    // create: the actual items
    gameState.blocksCoor.forEach((block) => {
      gameState.createBlock(block.x, block.y);
    });
    gameState.lavaCoor.forEach((lava) => {
      gameState.createLava(lava.x, lava.y);
    });
    gameState.doorsCoor.forEach((block) => {
      gameState.createDoor(block.x, block.y);
    });
    gameState.keysCoor.forEach((key) => {
      gameState.createKey(key.x, key.y);
    });
    gameState.spikesCoor.forEach((spike) => {
      gameState.createSpike(spike.x, spike.y, spike.angle);
    });
    gameState.portalsCoor.forEach((port) => {
      gameState.createPortal(port.x, port.y);
    });
    gameState.arrowsCoor.forEach((arrow) => {
      gameState.createArrow(arrow.x, arrow.y, arrow.angle);
    });

    gameState.doors.getChildren().forEach(door => {
      gameState.blockCoorTracker[Math.floor(door.x/30)][Math.floor(door.y/30)] = door;
    });

    // create: colliders
    gameState.doorCollider = this.physics.add.collider(gameState.player, gameState.doors);

    //  create: overlaps
    this.physics.add.overlap(gameState.player, gameState.trampolines, (player, trampoline) => {
      if (player.body.velocity.y > 0) {
        player.setVelocityY(-600);
      }
    });
    this.physics.add.overlap(gameState.player, gameState.lava, (player, lava) => {
      this.scene.restart();
    });
    this.physics.add.overlap(gameState.player, gameState.keys, (player, key) => {
      key.destroy();
      gameState.doorCollider.destroy();
      gameState.player.setTexture('player-key');
      gameState.doorsCoor.forEach((block) => {
        gameState.blockCoorTracker[block.x][block.y] = "blank";
      });
    });
    this.physics.add.overlap(gameState.player, gameState.spikes, (player, spike) => {
      this.scene.restart();
    });
    this.physics.add.overlap(gameState.player, gameState.portals, (player, port) => {
      this.physics.pause();
      let blackRect = this.add.rectangle(gameState.player.x+1, gameState.player.y+1, 2,  2, "0x000000").setDepth(2);
      this.tweens.add({
        targets: blackRect,
        x: blackRect.x,
        ease: 'Linear',
        duration: 10,
        repeat: 40,
        yoyo: false,
        onRepeat: () => {
          blackRect.displayWidth += 50;
          blackRect.displayHeight += 50;
        },
        onComplete: () => {
          this.scene.stop();
          this.scene.start("LevelSelect");
        },
      });
      if (parseInt(localStorage.getItem("unlockedLevels")) < 15 && gameState.currLevel === parseInt(localStorage.getItem("unlockedLevels"))) {
        localStorage.setItem("unlockedLevels", parseInt(localStorage.getItem("unlockedLevels"))+1);
      }
    });
    this.physics.add.overlap(gameState.player, gameState.arrows, (player, arrow) => {
      switch (arrow.angle) {
        case 90:
        this.physics.world.gravity.set(0, -1000);
        break;

        case -180:
        this.physics.world.gravity.set(1000, 0);
        break;

        case 0:
        this.physics.world.gravity.set(-1000, 0);
        break;

        default:
        this.physics.world.gravity.set(0, 1000);
        break;

      }
    });

    // create: key inputs
    this.input.keyboard.on('keyup-E', () => {
      this.scene.stop("GameScene");
      this.scene.start("EditScene");
    });

    gameState.player.checkBlockCollision = () => {
      let player = gameState.player;
      let placesToCheck = [{x: Math.floor((player.x+12)/30), y: Math.floor((player.y+12)/30)}, {x: Math.floor((player.x-12)/30), y: Math.floor((player.y+12)/30)}, {x: Math.floor((player.x+12)/30), y: Math.floor((player.y-12)/30)}, {x: Math.floor((player.x-12)/30), y: Math.floor((player.y-12)/30)}, {x: Math.floor((player.x+12)/30), y: Math.floor((player.y)/30)}, {x: Math.floor((player.x-12)/30), y: Math.floor((player.y)/30)}, {x: Math.floor((player.x)/30), y: Math.floor((player.y+12)/30)}, {x: Math.floor((player.x)/30), y: Math.floor((player.y-12)/30)}];
      // loop through to check all four corners and all four sides
      placesToCheck.forEach(spot => {
        if (gameState.blockCoorTracker[spot.x][spot.y] !== "blank") {
          this.physics.world.collide(gameState.player, gameState.blockCoorTracker[spot.x][spot.y]);
        }
      });
    };

    // destroy loadingCover
    this.tweens.add({
      targets: gameState.loadingCover,
      x: gameState.loadingCover.x,
      ease: 'Linear',
      duration: 10,
      repeat: 40,
      yoyo: false,
      onRepeat: () => {
        gameState.loadingCover.displayWidth -= 50;
        gameState.loadingCover.displayHeight -= 50;
      },
      onComplete: () => {
        gameState.loadingCover.destroy();
        gameState.loading = false;
        this.physics.resume();
      },
    });
  }

  update() {
    gameState.player.checkBlockCollision();
    if (!gameState.loading) {
      let gravity = this.physics.world.gravity;

      if (gravity.x === 0 && gravity.y === 1000) {
        if (gameState.cursors.left.isDown && gameState.blockCoorTracker[Math.floor((gameState.player.x - 14)/30)][Math.floor(gameState.player.y/30)] === "blank") {
          gameState.player.setVelocityX(-200);
        } else if (gameState.cursors.right.isDown && gameState.blockCoorTracker[Math.floor((gameState.player.x + 14)/30)][Math.floor(gameState.player.y/30)] === "blank") {
          gameState.player.setVelocityX(200);
        } else {
          if (gameState.player.body.velocity.x > 0) {
            gameState.player.setVelocityX(gameState.player.body.velocity.x * 0.6);
          } else if (gameState.player.body.velocity.x < 0) {
            gameState.player.setVelocityX(gameState.player.body.velocity.x * 0.6);
          }
        }

        if (gameState.player.body.velocity.y === 0 && gameState.cursors.up.isDown && gameState.player.body.touching.down) {
          gameState.player.setVelocityY(-400);
        }

        if (gameState.cursors.left.isDown && gameState.cursors.right.isDown) {
          gameState.player.setVelocityX(0);
        }
      } else if (gravity.x === 0 && gravity.y === -1000) {
        if (gameState.cursors.left.isDown && gameState.blockCoorTracker[Math.floor((gameState.player.x - 14)/30)][Math.floor(gameState.player.y/30)] === "blank") {
          gameState.player.setVelocityX(-200);
        } else if (gameState.cursors.right.isDown  && gameState.blockCoorTracker[Math.floor((gameState.player.x + 14)/30)][Math.floor(gameState.player.y/30)] === "blank") {
          gameState.player.setVelocityX(200);
        } else {
          if (gameState.player.body.velocity.x > 0) {
            gameState.player.setVelocityX(gameState.player.body.velocity.x * 0.6);
          } else if (gameState.player.body.velocity.x < 0) {
            gameState.player.setVelocityX(gameState.player.body.velocity.x * 0.6);
          }
        }

        if (gameState.player.body.velocity.y === 0 && gameState.cursors.down.isDown && gameState.player.body.touching.up) {
          gameState.player.setVelocityY(400);
        }

        if (gameState.cursors.left.isDown && gameState.cursors.right.isDown) {
          gameState.player.setVelocityX(0);
        }
      } else if (gravity.x === 1000 && gravity.y === 0) {
        if (gameState.cursors.up.isDown && gameState.blockCoorTracker[Math.floor(gameState.player.x/30)][Math.floor((gameState.player.y - 14)/30)] === "blank") {
          gameState.player.setVelocityY(-200);
        } else if (gameState.cursors.down.isDown && gameState.blockCoorTracker[Math.floor(gameState.player.x/30)][Math.floor((gameState.player.y + 14)/30)] === "blank") {
          gameState.player.setVelocityY(200);
        } else {
          if (gameState.player.body.velocity.y > 0) {
            gameState.player.setVelocityY(gameState.player.body.velocity.y * 0.6);
          } else if (gameState.player.body.velocity.y < 0) {
            gameState.player.setVelocityY(gameState.player.body.velocity.y * 0.6);
          }
        }

        if (gameState.player.body.velocity.x === 0 && gameState.cursors.left.isDown && gameState.player.body.touching.right) {
          gameState.player.setVelocityX(-400);
        }

        if (gameState.cursors.up.isDown && gameState.cursors.down.isDown) {
          gameState.player.setVelocityY(0);
        }
      } else if (gravity.x === -1000 && gravity.y === 0) {
        if (gameState.cursors.up.isDown && gameState.blockCoorTracker[Math.floor(gameState.player.x/30)][Math.floor((gameState.player.y - 14)/30)] === "blank") {
          gameState.player.setVelocityY(-200);
        } else if (gameState.cursors.down.isDown && gameState.blockCoorTracker[Math.floor(gameState.player.x/30)][Math.floor((gameState.player.y + 14)/30)] === "blank") {
          gameState.player.setVelocityY(200);
        } else {
          if (gameState.player.body.velocity.y > 0) {
            gameState.player.setVelocityY(gameState.player.body.velocity.y * 0.6);
          } else if (gameState.player.body.velocity.y < 0) {
            gameState.player.setVelocityY(gameState.player.body.velocity.y * 0.6);
          }
        }

        if (gameState.player.body.velocity.x === 0 && gameState.cursors.right.isDown && gameState.player.body.touching.left) {
          gameState.player.setVelocityX(400);
        }

        if (gameState.cursors.up.isDown && gameState.cursors.down.isDown) {
          gameState.player.setVelocityY(0);
        }
      }
    }

    gameState.portals.getChildren().forEach((port) => {
      port.angle += 5;
    });
  }
}
