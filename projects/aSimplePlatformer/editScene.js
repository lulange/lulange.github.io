class EditScene extends Phaser.Scene {
  constructor() {
    super({key: 'EditScene'});
  }

  preload() {
    this.load.image('player', 'https://lulange.github.io/projects/aSimplePlatformer/images/player.png');
    this.load.image("tilemap", "https://lulange.github.io/projects/aSimplePlatformer/images/CreateALevelTiles.png");
  }

  create() {
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

    gameState.spikesTracker.forEach(spike => {
      gameState.layer.fill(spikeIndex, spike.x, spike.y, 1, 1);
      let spikeTile = gameState.layer.getTileAt(spike.x, spike.y);
      spikeTile.rotation = spike.rotation * Math.PI/180;
    });

    gameState.arrowsTracker.forEach(arrow => {
      gameState.layer.fill(arrowIndex, arrow.x, arrow.y, 1, 1);
      let arrowTile = gameState.layer.getTileAt(arrow.x, arrow.y);
      arrowTile.rotation = arrow.rotation * Math.PI/180;
    });


    gameState.player = this.add.sprite(gameState.playerXAndY.x*30+15, gameState.playerXAndY.y*30+18, 'player').setDepth(1);
    gameState.cursors = this.input.keyboard.createCursorKeys();
    gameState.editSelect = gameState.initializeEditSelect;

    gameState.scene = this;

    this.add.grid(450, 450, 900, 900, 30, 30).setOutlineStyle("0x999999", 1).setFillStyle("0x000000", 0).setDepth(-1);

    const itemKeysInOrder = ['b', 's', 'd', 'k', 'a', 'p', 'l', 'pl'];
    const selectableItemsFullName = {
      'b': 'Blocks',
      's': 'Spikes',
      'a': 'Gravity Arrows',
      'p': 'Portals',
      'l': 'Lava',
      'd': 'Doors',
      'k': 'Keys',
      'pl': 'Player'
    };


    let selectedText = this.add.text(35, 5, `Selected: ${selectableItemsFullName[gameState.editSelect]}`, { fontFamily: 'Arial', fontSize: 20, color: '#000000' });
    this.add.text(335, 5, `Use Right and Left arrow keys to switch your selected item`, { fontFamily: 'Arial', fontSize: 20, color: '#000000' });
    this.add.text(35, 575, `Press "d" to delete or "c" to clear the whole level`, { fontFamily: 'Arial', fontSize: 20, color: '#000000' });
    this.add.text(515, 575, `Click arrows and spikes to rotate them`, { fontFamily: 'Arial', fontSize: 20, color: '#000000' });


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
      levels[gameState.currLevel-1].spikesTracker = [];
      levels[gameState.currLevel-1].arrowsTracker = [];
      gameState.layer.forEachTile(tile => {
        if (tile.index === spikeIndex) {
          levels[gameState.currLevel-1].spikesTracker.push({
            x: tile.x,
            y: tile.y,
            rotation: Math.round(tile.rotation / (Math.PI/180))
          });
        } else if (tile.index === arrowIndex) {
          levels[gameState.currLevel-1].arrowsTracker.push({
            x: tile.x,
            y: tile.y,
            rotation: Math.round(tile.rotation / (Math.PI/180))
          });
        }
      });
      gameState.spikesTracker = levels[gameState.currLevel-1].spikesTracker;
      gameState.arrowsTracker = levels[gameState.currLevel-1].arrowsTracker;
      this.scene.start("GameScene");
    });


    this.input.keyboard.on('keyup-D', () => {
      let xBlocks = Math.floor(this.input.mousePointer.x/30);
      let yBlocks = Math.floor(this.input.mousePointer.y/30);

      if (xBlocks !== 0 && xBlocks !== 29 && yBlocks !== 0 && yBlocks !== 19) {
        let tile = gameState.layer.getTileAt(xBlocks, yBlocks);
        if (tile !== null) {
          if (tile.index !== portalIndex) {
            gameState.layer.removeTileAt(xBlocks, yBlocks);
            gameState.level[yBlocks][xBlocks] = -1;
          }
        }
      }
    });

    this.input.keyboard.on('keyup-C', () => {
      gameState.layer.forEachTile(tile => {
        if (tile.index !== portalIndex && tile.x !== 0 && tile.x !== 29 && tile.y !== 0 && tile.y !== 19) {
          tile.index = -1;
          gameState.level[tile.y][tile.x] = -1;
        }
      });
    });


    this.input.keyboard.on('keyup-T', () => {
      let levelArray = [];
      for (let y=0; y<20; y++) {
        levelArray[y] = [];
        for (let x=0; x<30; x++) {
          levelArray[y][x] = -1;
        }
      }
      let spikesTracker = [];
      let arrowsTracker = [];

      gameState.layer.forEachTile(tile => {
        if (tile.index !== spikeIndex && tile.index !== arrowIndex) {
          levelArray[tile.y][tile.x] = tile.index;
        } else if (tile.index === spikeIndex) {
          spikesTracker.push({
            x: tile.x,
            y: tile.y,
            rotation: Math.round(tile.rotation / (Math.PI/180))
          });
        } else if (tile.index === arrowIndex) {
          arrowsTracker.push({
            x: tile.x,
            y: tile.y,
            rotation: Math.round(tile.rotation / (Math.PI/180))
          });
        }
      });

      let levelToLog = "[";
      levelArray.forEach(array => {
        levelToLog += "["
        array.forEach(index => {
          levelToLog += index + ",";
        });
        levelToLog += "],"
      });
      levelToLog += "]";
      console.log(levelToLog);

      let spikesToLog = "[";
      spikesTracker.forEach(spike => {
        spikesToLog += `{x: ${spike.x}, y: ${spike.y}, rotation: ${spike.rotation}},`;
      });
      spikesToLog += "]";
      console.log(spikesToLog);

      let arrowsToLog = "[";
      arrowsTracker.forEach(arrow => {
        arrowsToLog += `{x: ${arrow.x}, y: ${arrow.y}, rotation: ${arrow.rotation}},`;
      });
      arrowsToLog += "]";
      console.log(arrowsToLog);

      console.log(`{x: ${Math.floor(gameState.player.x/30)}, y: ${Math.floor(gameState.player.y/30)}}`);
    });

    this.input.keyboard.on('keyup-P', () => {
      this.scene.pause("EditScene");
      levels[gameState.currLevel-1].spikesTracker = [];
      levels[gameState.currLevel-1].arrowsTracker = [];
      gameState.layer.forEachTile(tile => {
        if (tile.index === spikeIndex) {
          levels[gameState.currLevel-1].spikesTracker.push({
            x: tile.x,
            y: tile.y,
            rotation: Math.round(tile.rotation / (Math.PI/180))
          });
        } else if (tile.index === arrowIndex) {
          levels[gameState.currLevel-1].arrowsTracker.push({
            x: tile.x,
            y: tile.y,
            rotation: Math.round(tile.rotation / (Math.PI/180))
          });
        }
      });
      gameState.spikesTracker = levels[gameState.currLevel-1].spikesTracker;
      gameState.arrowsTracker = levels[gameState.currLevel-1].arrowsTracker;
      this.scene.run("PauseScene");
    });

    this.input.on('pointerup', function() {
      let xBlocks = Math.floor(this.x/30);
      let yBlocks = Math.floor(this.y/30);

      let tile = gameState.layer.getTileAt(xBlocks, yBlocks);
      if (tile === null) {
        switch (gameState.editSelect) {
          case "b":
          gameState.layer.fill(groundIndex, xBlocks, yBlocks, 1, 1);
          gameState.level[yBlocks][xBlocks] = groundIndex;
          break;

          case "s":
          gameState.layer.fill(spikeIndex, xBlocks, yBlocks, 1, 1);
          break;

          case "d":
          gameState.layer.fill(doorIndex, xBlocks, yBlocks, 1, 1);
          gameState.level[yBlocks][xBlocks] = doorIndex;
          break;

          case "k":
          gameState.layer.fill(keyIndex, xBlocks, yBlocks, 1, 1);
          gameState.level[yBlocks][xBlocks] = keyIndex;
          break;

          case "a":
          gameState.layer.fill(arrowIndex, xBlocks, yBlocks, 1, 1);
          break;

          case "p":
          let portal = gameState.layer.findByIndex(portalIndex);
          gameState.layer.removeTileAt(portal.x, portal.y);
          gameState.layer.fill(portalIndex, xBlocks, yBlocks, 1, 1);
          gameState.level[portal.y][portal.x] = -1;
          gameState.level[yBlocks][xBlocks] = portalIndex;
          break;

          case "l":
          gameState.layer.fill(lavaIndex, xBlocks, yBlocks, 1, 1);
          gameState.level[yBlocks][xBlocks] = lavaIndex;
          break;

          case "pl":
          gameState.player.x = xBlocks*30+15;
          gameState.player.y = yBlocks*30+18;
          gameState.playerXAndY.x = xBlocks;
          gameState.playerXAndY.y = yBlocks;
          break;
        }
      } else if (tile.index === spikeIndex || tile.index === arrowIndex) {
        if (tile.rotation === 270 * Math.PI/180) {
          tile.rotation = 0;
        } else {
          tile.rotation += 90 * Math.PI/180;
        }
      }
    });
  }
}
