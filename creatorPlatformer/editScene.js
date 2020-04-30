class EditScene extends Phaser.Scene {
  constructor() {
    super({key: 'EditScene'});
  }


  preload() {
    this.load.image('player', 'https://lulange.github.io/player.png');
    this.load.image('key', 'https://lulange.github.io/key.png');
    this.load.image('door', 'https://lulange.github.io/door.png');
    this.load.image('spike', 'https://lulange.github.io/spike.png');
    this.load.image('portal', 'https://lulange.github.io/portal.png');
    this.load.image('arrow', 'https://lulange.github.io/arrow.png');
  }

  create() {
    let selectionInputs = {
      block: {
        hitBox: this.add.rectangle(75, 16, 28, 28, "0x000000", 1).setDepth(2),
        select: 'b',
      },
    };

    for (let item in selectionInputs) {
      selectionInputs[item].hitBox.isStroked = true;
      selectionInputs[item].hitBox.strokeColor = 0;
      selectionInputs[item].hitBox.isFilled = false;
      selectionInputs[item].hitBox.lineWidth = 2;
      selectionInputs[item].hitBox.setInteractive();
      selectionInputs[item].hitBox.on('pointerup', function() {
        for (let i in selectionInputs) {
          selectionInputs[i].hitBox.isFilled = false;
        }
        selectionInputs[item].hitBox.isFilled = true;
      });
    }

    // create blockCoorTracker array
    {
      for (var i=0; i<30; i++) {
        gameState.blockCoorTracker[i] = [];
        for (var t=0; t<30; t++) {
          gameState.blockCoorTracker[i][t] = "blank";
        }
      }
    }

    gameState.player = this.add.sprite(gameState.playerXAndY.x*30+15, gameState.playerXAndY.y*30+18, 'player').setDepth(1);
    gameState.blockCoorTracker[gameState.playerXAndY.x][gameState.playerXAndY.y] = "filled";
    gameState.cursors = this.input.keyboard.createCursorKeys();
    gameState.editSelect = gameState.initializeEditSelect;

    // add static groups
    gameState.blocks = this.physics.add.staticGroup();
    gameState.lava = this.physics.add.staticGroup();
    gameState.doors = this.physics.add.staticGroup();
    gameState.keys = this.physics.add.staticGroup();
    gameState.spikes = this.physics.add.staticGroup();
    gameState.portals = this.physics.add.staticGroup();
    gameState.arrows = this.physics.add.staticGroup();

    gameState.createBlock = (xBlocks, yBlocks, alpha) => {
      if (alpha === undefined) {
        alpha = 1;
      }
      let rectX = xBlocks * 30 + 15;
      let rectY = yBlocks * 30 + 15;
      let blockHolder;
      // create rectangle
      blockHolder = this.add.rectangle(rectX, rectY, 30, 30, '0x008000', alpha);
      // add the rectangle to blocks group
      gameState.blocks.add(blockHolder);
      gameState.blockCoorTracker[xBlocks][yBlocks] = "filled";
    };

    gameState.createLava = (xBlocks, yBlocks, alpha) => {
      if (alpha === undefined) {
        alpha = 1;
      }
      let rectX = xBlocks * 30 + 15;
      let rectY = yBlocks * 30 + 15;
      let lavaHolder;
      // create rectangle
      lavaHolder = this.add.rectangle(rectX, rectY, 30, 30, '0xFF2222', alpha);
      // add the rectangle to blocks group
      gameState.lava.add(lavaHolder);
      gameState.blockCoorTracker[xBlocks][yBlocks] = "filled";
    };

    gameState.createDoor = (xBlocks, yBlocks, alpha) => {
      if (alpha === undefined) {
        alpha = 1;
      }
      let blockX = xBlocks * 30 + 15;
      let blockY = yBlocks * 30 + 15;
      gameState.doors.create(blockX, blockY, 'door').setAlpha(alpha);
      gameState.blockCoorTracker[xBlocks][yBlocks] = "filled";
    };

    gameState.createKey = (xBlocks, yBlocks, alpha) => {
      if (alpha === undefined) {
        alpha = 1;
      }
      let keyX = xBlocks * 30 + 15;
      let keyY = yBlocks * 30 + 15;
      gameState.keys.create(keyX, keyY, 'key').setAlpha(alpha);
      gameState.blockCoorTracker[xBlocks][yBlocks] = "filled";
    };

    gameState.createSpike = (xBlocks, yBlocks, angle, alpha) => {
      if (alpha === undefined) {
        alpha = 1;
      }
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
      gameState.spikes.create(spikeX, spikeY, 'spike').setAngle(angle).setAlpha(alpha);
      gameState.blockCoorTracker[xBlocks][yBlocks] = "spike";
    };

    gameState.createPortal = (xBlocks, yBlocks, alpha) => {
      if (alpha === undefined) {
        alpha = 1;
      }
      let portX = xBlocks * 30 + 15;
      let portY = yBlocks * 30 + 15;
      gameState.portals.create(portX, portY, 'portal').setAlpha(alpha);
      gameState.blockCoorTracker[xBlocks][yBlocks] = "filled";
    };

    gameState.createArrow = (xBlocks, yBlocks, angle, alpha) => {
      if (alpha === undefined) {
        alpha = 1;
      }
      let arrowX = xBlocks * 30 + 15;
      let arrowY = yBlocks * 30 + 15;
      gameState.arrows.create(arrowX, arrowY, 'arrow').setAngle(angle).setAlpha(alpha);
      gameState.blockCoorTracker[xBlocks][yBlocks] = "arrow";
    };


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

    gameState.scene = this;


    this.add.grid(450, 450, 900, 900, 30, 30).setOutlineStyle("0x999999", 1).setFillStyle("0x000000", 0).setDepth(-1);

    const itemKeysInOrder = ['b', 's', 'd', 'k', 'a', 'p', 'l'];
    const selectableItemsFullName = {
      'b': 'Blocks',
      's': 'Spikes',
      'a': 'Gravity Arrows',
      'p': 'Portals',
      'l': 'Lava',
      'd': 'Doors',
      'k': 'Keys',
      'l': 'lava'
    };


    let selectedText = this.add.text(35, 5, `Selected: ${selectableItemsFullName[gameState.editSelect]}`, { fontFamily: 'Arial', fontSize: 20, color: '#000000' });


    this.input.keyboard.on('keyup-LEFT', () => {
      let editSelectIndex = itemKeysInOrder.findIndex(itemKey => {
        return itemKey === gameState.editSelect;
      });
      let editSelectIndexMinusOne = (editSelectIndex - 1) < 0 ? editSelectIndex = itemKeysInOrder.length-1: editSelectIndex--;
      gameState.editSelect = itemKeysInOrder[editSelectIndex];
      gameState.initializeEditSelect = itemKeysInOrder[editSelectIndex];
      selectedText.destroy();
      selectedText = this.add.text(35, 5, `Selected: ${selectableItemsFullName[gameState.editSelect]}`, { fontFamily: 'Arial', fontSize: 20, color: '#000000' });
    });
    this.input.keyboard.on('keyup-RIGHT', () => {
      let editSelectIndex = itemKeysInOrder.findIndex(itemKey => {
        return itemKey === gameState.editSelect;
      });
      let editSelectIndexPlusOne = (editSelectIndex + 1) >= itemKeysInOrder.length ? editSelectIndex = 0: editSelectIndex++;
      gameState.editSelect = itemKeysInOrder[editSelectIndex];
      gameState.initializeEditSelect = itemKeysInOrder[editSelectIndex];
      selectedText.destroy();
      selectedText = this.add.text(35, 5, `Selected: ${selectableItemsFullName[gameState.editSelect]}`, { fontFamily: 'Arial', fontSize: 20, color: '#000000' });
    });
    this.input.keyboard.on('keyup-E', () => {
      this.scene.stop("EditScene");
      this.scene.start("GameScene");
    });
    this.input.keyboard.on('keyup-D', () => {
      let xBlocks = Math.floor(this.input.mousePointer.x/30);
      let yBlocks = Math.floor(this.input.mousePointer.y/30);
      let blockIndex = gameState.blocksCoor.findIndex(block => {
        return block.x === xBlocks && block.y === yBlocks;
      });
      if (blockIndex !== -1) {
        gameState.blocksCoor.splice(blockIndex, 1);
        gameState.scene.scene.restart();
      }

      let spikeIndex = gameState.spikesCoor.findIndex(spike => {
        return spike.x === xBlocks && spike.y === yBlocks;
      });
      if (spikeIndex !== -1) {
        gameState.spikesCoor.splice(spikeIndex, 1);
        gameState.scene.scene.restart();
      }

      let portIndex = gameState.portalsCoor.findIndex(port => {
        return port.x === xBlocks && port.y === yBlocks;
      });
      if (portIndex !== -1) {
        gameState.portalsCoor.splice(portIndex, 1);
        gameState.scene.scene.restart();
      }

      let keyIndex = gameState.keysCoor.findIndex(key => {
        return key.x === xBlocks && key.y === yBlocks;
      });
      if (keyIndex !== -1) {
        gameState.keysCoor.splice(keyIndex, 1);
        gameState.scene.scene.restart();
      }

      let doorIndex = gameState.doorsCoor.findIndex(door => {
        return door.x === xBlocks && door.y === yBlocks;
      });
      if (doorIndex !== -1) {
        gameState.doorsCoor.splice(doorIndex, 1);
        gameState.scene.scene.restart();
      }

      let arrowIndex = gameState.arrowsCoor.findIndex(arrow => {
        return arrow.x === xBlocks && arrow.y === yBlocks;
      });
      if (arrowIndex !== -1) {
        gameState.arrowsCoor.splice(arrowIndex, 1);
        gameState.scene.scene.restart();
      }

      let lavaIndex = gameState.lavaCoor.findIndex(lava => {
        return lava.x === xBlocks && lava.y === yBlocks;
      });
      if (lavaIndex !== -1) {
        gameState.lavaCoor.splice(lavaIndex, 1);
        gameState.scene.scene.restart();
      }
      gameState.blockCoorTracker[xBlocks][yBlocks] = "blank";
    });
    this.input.keyboard.on('keyup-T', () => {
      // console.log save stuff
      let saveLog = {
        blocks: "",
        lava: "",
        doors: "",
        keys: "",
        spikes: "",
        portals: "",
        arrows: "",
      };
      gameState.blocksCoor.forEach((block) => {
        let stringToAdd = `{x: ${block.x}, y: ${block.y}},`;
        saveLog.blocks = saveLog.blocks + stringToAdd;
      });

      gameState.lavaCoor.forEach((lava) => {
        let stringToAdd = `{x: ${lava.x}, y: ${lava.y}},`;
        saveLog.lava = saveLog.lava + stringToAdd;
      });

      gameState.doorsCoor.forEach((block) => {
        let stringToAdd = `{x: ${block.x}, y: ${block.y}},`;
        saveLog.doors = saveLog.doors + stringToAdd;
      });

      gameState.keysCoor.forEach((key) => {
        let stringToAdd = `{x: ${key.x}, y: ${key.y}},`;
        saveLog.keys = saveLog.keys + stringToAdd;
      });

      gameState.spikesCoor.forEach((spike) => {
        let stringToAdd = `{x: ${spike.x}, y: ${spike.y}, angle: ${spike.angle}},`;
        saveLog.spikes = saveLog.spikes + stringToAdd;;
      });

      gameState.portalsCoor.forEach((port) => {
        let stringToAdd = `{x: ${port.x}, y: ${port.y}},`;
        saveLog.portals = saveLog.portals + stringToAdd;
      });

      gameState.arrowsCoor.forEach((arrow) => {
        let stringToAdd = `{x: ${arrow.x}, y: ${arrow.y}, angle: ${arrow.angle}},`;
        saveLog.arrows = saveLog.arrows + stringToAdd;
      });

      // log all blocks
      console.log("blocks:");
      console.log(saveLog.blocks);
      console.log("lava:");
      console.log(saveLog.lava);
      console.log("doors:");
      console.log(saveLog.doors);
      console.log("keys:");
      console.log(saveLog.keys);
      console.log("spikes:");
      console.log(saveLog.spikes);
      console.log("portals:");
      console.log(saveLog.portals);
      console.log("arrows:");
      console.log(saveLog.arrows);
    });

    this.input.on('pointerup', function() {
      let xBlocks = Math.floor(this.x/30);
      let yBlocks = Math.floor(this.y/30);
      if (gameState.blockCoorTracker[xBlocks][yBlocks] === 'spike' || gameState.blockCoorTracker[xBlocks][yBlocks] === 'arrow') {
        gameState.editSelect = 'r'
      }
      if (gameState.blockCoorTracker[xBlocks][yBlocks] === "blank" || gameState.editSelect === 'r') {
        switch (gameState.editSelect) {
          case 'b':
          gameState.createBlock(xBlocks, yBlocks);
          gameState.blocksCoor.push({x: xBlocks, y: yBlocks});
          gameState.blockCoorTracker[xBlocks][yBlocks] = "filled";
          break;

          case 's':
          gameState.createSpike(xBlocks, yBlocks, 0);
          gameState.spikesCoor.push({x: xBlocks, y: yBlocks, angle: 0});
          gameState.blockCoorTracker[xBlocks][yBlocks] = "spike";
          break;

          case 'p':
          gameState.createPortal(xBlocks, yBlocks);
          gameState.portalsCoor.push({x: xBlocks, y: yBlocks});
          gameState.blockCoorTracker[xBlocks][yBlocks] = "filled";
          break;

          case 'k':
          gameState.createKey(xBlocks, yBlocks);
          gameState.keysCoor.push({x: xBlocks, y: yBlocks});
          gameState.blockCoorTracker[xBlocks][yBlocks] = "filled";
          break;

          case 'd':
          gameState.createDoor(xBlocks, yBlocks);
          gameState.doorsCoor.push({x: xBlocks, y: yBlocks});
          gameState.blockCoorTracker[xBlocks][yBlocks] = "filled";
          break;

          case 'a':
          gameState.createArrow(xBlocks, yBlocks, 0);
          gameState.arrowsCoor.push({x: xBlocks, y: yBlocks, angle: 0});
          gameState.blockCoorTracker[xBlocks][yBlocks] = "arrow";
          break;

          case 'l':
          gameState.createLava(xBlocks, yBlocks);
          gameState.lavaCoor.push({x: xBlocks, y: yBlocks});
          gameState.blockCoorTracker[xBlocks][yBlocks] = "filled";
          break;

          case 'r':
          let spikeIndexR = gameState.spikesCoor.findIndex(spike => {
            return spike.x === xBlocks && spike.y === yBlocks;
          });
          if (spikeIndexR !== -1) {
            if (gameState.spikesCoor[spikeIndexR].angle === 270) {
              gameState.spikesCoor[spikeIndexR].angle = 0;
            } else {
              gameState.spikesCoor[spikeIndexR].angle += 90;
            }
            gameState.scene.scene.restart();
          }

          let arrowIndexR = gameState.arrowsCoor.findIndex(arrow => {
            return arrow.x === xBlocks && arrow.y === yBlocks;
          });
          if (arrowIndexR !== -1) {
            if (gameState.arrowsCoor[arrowIndexR].angle === 270) {
              gameState.arrowsCoor[arrowIndexR].angle = 0;
            } else {
              gameState.arrowsCoor[arrowIndexR].angle += 90;
            }
            gameState.scene.scene.restart();
          }
          gameState.editSelect = gameState.intializeEditSelect;
          break;
        }
      }
    });
  }

  update() {

  }
}
