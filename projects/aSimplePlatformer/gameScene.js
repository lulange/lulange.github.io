class GameScene extends Phaser.Scene {
  constructor() {
    super({key: 'GameScene'});
  }

  preload() {
    // load player images
    this.load.image('player', 'https://lulange.github.io/imageHosting/player.png');
    this.load.image('player-right', 'https://lulange.github.io/imageHosting/player-right.png');
    this.load.image('player-up', 'https://lulange.github.io/imageHosting/player-up.png');
    this.load.image('player-down', 'https://lulange.github.io/imageHosting/player-down.png');
    this.load.image('player-right-up', 'https://lulange.github.io/imageHosting/player-right-up.png');
    this.load.image('player-right-down', 'https://lulange.github.io/imageHosting/player-right-down.png');

    this.load.image("spike", "https:lulange.github.io/imageHosting/spike.png");
    this.load.image("tilemap", "https://lulange.github.io/imageHosting/CreateALevelTiles.png");
    this.load.image("arrow", "https://lulange.github.io/imageHosting/arrow30x30.png");
    this.load.image("key", "https://lulange.github.io/imageHosting/key30x30.png");
    this.load.image("key-green", "https://lulange.github.io/imageHosting/key-green.png");
    gameState.loadingCover = this.add.rectangle(gameState.playerXAndY.x*30+15, gameState.playerXAndY.y*30+18, 2000, 2000, "0x000000").setDepth(2);
    gameState.loading = true;
    this.physics.pause();
  }

  create() {
    // create any needed static groups
    gameState.spikes = this.physics.add.staticGroup();
    gameState.arrows = this.physics.add.staticGroup();
    gameState.keys = this.physics.add.staticGroup();

    // create index variables
    const portalIndex = 4;
    const groundIndex = 0;
    const spikeIndex = 1;
    const lavaIndex = 6;
    const doorIndex = 2;
    const arrowIndex = 5;
    const keyIndex = 3;

    // create the tilemap, add an image, and create the dynamic layer
    const map = this.add.tilemap(null, 30, 30, 7, 1, gameState.level);
    const tiles = map.addTilesetImage("tilemap", null, 30, 30, 0, 30);
    gameState.layer = map.createDynamicLayer(0, tiles, 0, 0);

    // set collision for ground and door tiles
    gameState.layer.setCollision([groundIndex, doorIndex]);

    // loop through the spikesTracker array and put the spikes in the game
    gameState.spikesTracker.forEach(spike => {
      gameState.layer.fill(spikeIndex, spike.x, spike.y, 1, 1);
      let spikeTile = gameState.layer.getTileAt(spike.x, spike.y);
      spikeTile.rotation = spike.rotation * Math.PI/180;

      let invisibleSpike;
      switch (spike.rotation) {
        case 0:
          invisibleSpike = this.add.sprite(spike.x*30+15, spike.y*30+23, "spike").setAlpha(0);
        break;

        case 90:
          invisibleSpike = this.add.sprite(spike.x*30+7, spike.y*30+15, "spike").setAlpha(0);
          invisibleSpike.rotation = spikeTile.rotation;
        break;

        case 180:
          invisibleSpike = this.add.sprite(spike.x*30+15, spike.y*30+7, "spike").setAlpha(0);
          invisibleSpike.rotation = spikeTile.rotation;
        break;

        case 270:
          invisibleSpike = this.add.sprite(spike.x*30+23, spike.y*30+15, "spike").setAlpha(0);
          invisibleSpike.rotation = spikeTile.rotation;
        break;
      }
      gameState.spikes.add(invisibleSpike);
    });

    gameState.arrowsTracker.forEach(arrow => {
      gameState.layer.fill(arrowIndex, arrow.x, arrow.y, 1, 1);
      let arrowTile = gameState.layer.getTileAt(arrow.x, arrow.y);
      arrowTile.rotation = arrow.rotation * Math.PI/180;

      let invisibleArrow = gameState.arrows.create(arrow.x*30+15, arrow.y*30+15, "arrow").setSize(20, 10).setOffset(5, 10);
      invisibleArrow.setAlpha(0);
      invisibleArrow.rotation = arrowTile.rotation;
    });

    // set different things based off of the index of the tile
    gameState.layer.forEachTile(tile => {
      if (tile.index === lavaIndex) {
        tile.setCollisionCallback(() => {
          this.scene.restart();
        });
      } else if (tile.index === keyIndex) {
        let invisibleKey = this.add.sprite(tile.x*30+15, tile.y*30+15, "key");
        invisibleKey.setAlpha(0);
        gameState.keys.add(invisibleKey);
      }
    });

    // remember the portal for update purposes
    gameState.portal = gameState.layer.findByIndex(portalIndex);
    gameState.portal.setCollisionCallback(() => {
      this.physics.pause();
      let blackRect = this.add.rectangle(gameState.player.x, gameState.player.y, 2,  2, "0x000000").setDepth(2);
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
          if (gameState.currLevel === 15 && levels[0].isEditable === false) {
            levels.forEach(level => {
              level.isEditable = true;
            });
            this.scene.start("WinScene");
          } else {
            this.scene.start("LevelSelect");
          }
        },
      });
      if (parseInt(localStorage.getItem("unlockedLevels")) < 15 && gameState.currLevel === parseInt(localStorage.getItem("unlockedLevels"))) {
        localStorage.setItem("unlockedLevels", parseInt(localStorage.getItem("unlockedLevels"))+1);
      }
    });

    gameState.player = this.physics.add.sprite(gameState.playerXAndY.x*30+15, gameState.playerXAndY.y*30+18, 'player').setDepth(1);
    gameState.player.setCollideWorldBounds(true);
    gameState.player.body.maxSpeed = 1000;

    this.physics.add.collider(gameState.player, gameState.layer);
    this.physics.add.overlap(gameState.player, gameState.spikes, (player, spike) => {
      this.scene.restart();
    });
    this.physics.add.overlap(gameState.player, gameState.arrows, (player, arrow) => {
      switch (arrow.angle) {
        case 90:
        this.physics.world.gravity.set(0, -1000);
        gameState.player.setAngle(180);
        break;

        case -180:
        this.physics.world.gravity.set(1000, 0);
        gameState.player.setAngle(270);
        break;

        case 0:
        this.physics.world.gravity.set(-1000, 0);
        gameState.player.setAngle(90);
        break;

        default:
        this.physics.world.gravity.set(0, 1000);
        gameState.player.setAngle(0);
        break;
      }
    });
    this.physics.add.overlap(gameState.player, gameState.keys, (player, key) => {
      gameState.layer.setCollision(doorIndex, false);
      gameState.layer.fill(-1, (key.x-15)/30, (key.y-15)/30, 1, 1);
      key.destroy();
      this.add.sprite(45, 19*30+15, "key-green");
    });
    gameState.cursors = this.input.keyboard.createCursorKeys();

    // create: key inputs
    this.input.keyboard.on('keyup-E', () => {
      if (gameState.isEditable === true) {
        this.scene.stop("GameScene");
        this.scene.start("EditScene");
      }
    });

    this.input.keyboard.on('keyup-P', () => {
      this.scene.pause("GameScene");
      gameState.cursors.left.isDown = false;
      gameState.cursors.right.isDown = false;
      gameState.cursors.up.isDown = false;
      gameState.cursors.down.isDown = false;
      this.scene.run("PauseScene");
    });

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
    gameState.portal.rotation += 0.1;
    if (gameState.portal.rotation === 360) {
      gameState.portal.rotation = 0;
    }
    if (!gameState.loading) {
      let gravity = this.physics.world.gravity;

      if (gravity.x === 0 && gravity.y === 1000) {
        if (gameState.cursors.left.isDown) {
          gameState.player.setVelocityX(-210);
        } else if (gameState.cursors.right.isDown) {
          gameState.player.setVelocityX(210);
        } else {
          if (gameState.player.body.velocity.x > 0) {
            gameState.player.setVelocityX(gameState.player.body.velocity.x * 0.6);
          } else if (gameState.player.body.velocity.x < 0) {
            gameState.player.setVelocityX(gameState.player.body.velocity.x * 0.6);
          }
          if (gameState.player.body.velocity.x < 1 && gameState.player.body.velocity.x > -1) {
            gameState.player.setVelocityX(0);
          }
        }

        if (gameState.player.body.velocity.y === 0 && gameState.cursors.up.isDown && gameState.player.body.blocked.down) {
          gameState.player.setVelocityY(-400);
        }

        if (gameState.cursors.left.isDown && gameState.cursors.right.isDown) {
          gameState.player.setVelocityX(0);
        }

        if (gameState.player.body.velocity.x  === 0) {
          if (gameState.player.body.velocity.y  === 0) {
            gameState.player.setTexture("player");
          } else if (gameState.player.body.velocity.y > 0) {
            gameState.player.setTexture("player-down");
          } else if (gameState.player.body.velocity.y < 0) {
            gameState.player.setTexture("player-up");
          }
        } else if (gameState.player.body.velocity.x !== 0) {
          if (gameState.player.body.velocity.y  === 0) {
            gameState.player.setTexture("player-right");
          } else if (gameState.player.body.velocity.y > 0) {
            gameState.player.setTexture("player-right-down");
          } else if (gameState.player.body.velocity.y < 0) {
            gameState.player.setTexture("player-right-up");
          }
        }

        if (gameState.player.body.velocity.x > 0) {
          gameState.player.flipX = false;
        } else {
          gameState.player.flipX = true;
        }

      } else if (gravity.x === 0 && gravity.y === -1000) {
        if (gameState.cursors.left.isDown) {
          gameState.player.setVelocityX(-210);
        } else if (gameState.cursors.right.isDown) {
          gameState.player.setVelocityX(210);
        } else {
          if (gameState.player.body.velocity.x > 0) {
            gameState.player.setVelocityX(gameState.player.body.velocity.x * 0.6);
          } else if (gameState.player.body.velocity.x < 0) {
            gameState.player.setVelocityX(gameState.player.body.velocity.x * 0.6);
          }

          if (gameState.player.body.velocity.x < 1 && gameState.player.body.velocity.x > -1) {
            gameState.player.setVelocityX(0);
          }
        }

        if (gameState.player.body.velocity.y === 0 && gameState.cursors.down.isDown && gameState.player.body.blocked.up) {
          gameState.player.setVelocityY(400);
        }

        if (gameState.cursors.left.isDown && gameState.cursors.right.isDown) {
          gameState.player.setVelocityX(0);
        }

        if (gameState.player.body.velocity.x  === 0) {
          if (gameState.player.body.velocity.y  === 0) {
            gameState.player.setTexture("player");
          } else if (gameState.player.body.velocity.y < 0) {
            gameState.player.setTexture("player-down");
          } else if (gameState.player.body.velocity.y > 0) {
            gameState.player.setTexture("player-up");
          }
        } else if (gameState.player.body.velocity.x !== 0) {
          if (gameState.player.body.velocity.y  === 0) {
            gameState.player.setTexture("player-right");
          } else if (gameState.player.body.velocity.y < 0) {
            gameState.player.setTexture("player-right-down");
          } else if (gameState.player.body.velocity.y > 0) {
            gameState.player.setTexture("player-right-up");
          }
        }

        if (gameState.player.body.velocity.x > 0) {
          gameState.player.flipX = true;
        } else {
          gameState.player.flipX = false;
        }

      } else if (gravity.x === 1000 && gravity.y === 0) {
        if (gameState.cursors.up.isDown) {
          gameState.player.setVelocityY(-210);
        } else if (gameState.cursors.down.isDown) {
          gameState.player.setVelocityY(210);
        } else {
          if (gameState.player.body.velocity.y > 0) {
            gameState.player.setVelocityY(gameState.player.body.velocity.y * 0.6);
          } else if (gameState.player.body.velocity.y < 0) {
            gameState.player.setVelocityY(gameState.player.body.velocity.y * 0.6);
          }

          if (gameState.player.body.velocity.y < 1 && gameState.player.body.velocity.y > -1) {
            gameState.player.setVelocityY(0);
          }
        }

        if (gameState.player.body.velocity.x === 0 && gameState.cursors.left.isDown && gameState.player.body.blocked.right) {
          gameState.player.setVelocityX(-400);
        }

        if (gameState.cursors.up.isDown && gameState.cursors.down.isDown) {
          gameState.player.setVelocityY(0);
        }

        if (gameState.player.body.velocity.y  === 0) {
          if (gameState.player.body.velocity.x === 0) {
            gameState.player.setTexture("player");
          } else if (gameState.player.body.velocity.x > 0) {
            gameState.player.setTexture("player-down");
          } else if (gameState.player.body.velocity.x < 0) {
            gameState.player.setTexture("player-up");
          }
        } else if (gameState.player.body.velocity.y !== 0) {
          if (gameState.player.body.velocity.x === 0) {
            gameState.player.setTexture("player-right");
          } else if (gameState.player.body.velocity.x > 0) {
            gameState.player.setTexture("player-right-down");
          } else if (gameState.player.body.velocity.x < 0) {
            gameState.player.setTexture("player-right-up");
          }
        }

        if (gameState.player.body.velocity.y > 0) {
          gameState.player.flipX = true;
        } else {
          gameState.player.flipX = false;
        }

      } else if (gravity.x === -1000 && gravity.y === 0) {
        if (gameState.cursors.up.isDown) {
          gameState.player.setVelocityY(-210);
        } else if (gameState.cursors.down.isDown) {
          gameState.player.setVelocityY(210);
        } else {
          if (gameState.player.body.velocity.y > 0) {
            gameState.player.setVelocityY(gameState.player.body.velocity.y * 0.6);
          } else if (gameState.player.body.velocity.y < 0) {
            gameState.player.setVelocityY(gameState.player.body.velocity.y * 0.6);
          }

          if (gameState.player.body.velocity.y < 1 && gameState.player.body.velocity.y > -1) {
            gameState.player.setVelocityY(0);
          }
        }

        if (gameState.player.body.velocity.x === 0 && gameState.cursors.right.isDown && gameState.player.body.blocked.left) {
          gameState.player.setVelocityX(400);
        }

        if (gameState.cursors.up.isDown && gameState.cursors.down.isDown) {
          gameState.player.setVelocityY(0);
        }

        if (gameState.player.body.velocity.y  === 0) {
          if (gameState.player.body.velocity.x  === 0) {
            gameState.player.setTexture("player");
          } else if (gameState.player.body.velocity.x < 0) {
            gameState.player.setTexture("player-down");
          } else if (gameState.player.body.velocity.x > 0) {
            gameState.player.setTexture("player-up");
          }
        } else if (gameState.player.body.velocity.y !== 0) {
          if (gameState.player.body.velocity.x  === 0) {
            gameState.player.setTexture("player-right");
          } else if (gameState.player.body.velocity.x < 0) {
            gameState.player.setTexture("player-right-down");
          } else if (gameState.player.body.velocity.x > 0) {
            gameState.player.setTexture("player-right-up");
          }
        }

        if (gameState.player.body.velocity.y > 0) {
          gameState.player.flipX = false;
        } else {
          gameState.player.flipX = true;
        }
      }
    }
  }
}
