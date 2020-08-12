export default class EditScene extends Phaser.Scene {
  constructor(level) {
    super({key: "EditScene"});
  }

  init(data) {
    this.levelNum = data.level;
    this.levelBanner = `My Level: ${this.levelNum}`;
    this.level = JSON.parse(localStorage.getItem("ul" + this.levelNum));
    this.hitsLeft = this.level.hits;
    this.userLevel = true;

    // powerSensitivity variable (1 is normal)
    this.powerSensitivity = 1;
  }

  preload() {
    // create rectangle for transition
    this.blackRect = this.add.rectangle(450, 300, 900, 600, "0x000000", 1);
    this.blackRect.setDepth(10);


    // tilemap
    this.load.image("tileset", "https://cdn.glitch.com/1737f775-4be5-40d3-b5b1-2ba50647b921%2Ftileset.png?v=1596372878925");
    this.load.tilemapTiledJSON("map", "https://lulange.github.io/projects/miniGolf/minigolfMap.json");

    // ball sprite
    this.load.image("ball", "https://cdn.glitch.com/1737f775-4be5-40d3-b5b1-2ba50647b921%2Fball.png?v=1594590260477");

    // tilesetSprite textures
    this.load.image("turf", "https://cdn.glitch.com/1737f775-4be5-40d3-b5b1-2ba50647b921%2FturfLayer.png?v=1597150136226");
    this.load.image("wall", "https://cdn.glitch.com/1737f775-4be5-40d3-b5b1-2ba50647b921%2FwallLayer.png?v=1597150139332");
  }

  create() {

    /********
    * create map
    *********/
    const map = this.make.tilemap({ key: "map" });

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tileset = map.addTilesetImage("tileset", "tileset");

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    this.turfLayer = map.createDynamicLayer(0, tileset, 0, 0);
    this.wallLayer = map.createDynamicLayer(1, tileset, 0, 0);

    // remake map to level
    let ballX, ballY;
    for (let i=0; i<this.level.items.length; i++) {
      for (let j=0; j<this.level.items[i].length; j++) {
        if (this.level.items[i][j] !== 20) {
          this.wallLayer.fill(this.level.items[i][j], j+2, i+2, 1, 1);
        } else {
          this.wallLayer.fill(-1, j+2, i+2, 1, 1);
          ballX = (j+2) * 20 + 10;
          ballY = (i+2) * 20 + 10;
        }
      }
    }

    for (let i=0; i<this.level.turf.length; i++) {
      for (let j=0; j<this.level.turf[i].length; j++) {
        this.turfLayer.fill(this.level.turf[i][j], j+2, i+2, 1, 1);
      }
    }

    this.hole = this.wallLayer.findByIndex(7);

    /********
    * create buttons and text headline
    *********/
    let levelText = this.add.text(50, 7, this.levelBanner, {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "24px",
    });

    let hitsLeftText = this.add.text(230, 9, `Hits left:    ${this.hitsLeft}`, {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "22px",
    });


    // create right hitslefttext adjust button
    let rightArrowButton = this.add.text(hitsLeftText.getTopRight().x, 9, ` >`, {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "22px",
    });

    // and set it interactive
    rightArrowButton.setInteractive();
    rightArrowButton.on("pointerover", function() {
      this.setFontSize(23);
      this.x -= 1;
      this.y -= 1;
    });

    rightArrowButton.on("pointerout", function() {
      this.setFontSize(22);
      this.x += 1;
      this.y += 1;
    });

    rightArrowButton.on("pointerup", function() {
      if (this.scene.level.hits < 99) {
        this.scene.level.hits++;
        this.scene.hitsLeft++;
        hitsLeftText.text = `Hits left:    ${this.scene.hitsLeft}`;
        rightArrowButton.x = hitsLeftText.getTopRight().x;
        localStorage.setItem("ul" + this.scene.levelNum, JSON.stringify(this.scene.level));
      }
    });


     // create left hitslefttext adjust button
    let leftArrowButton = this.add.text(338, 9, `<`, {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "22px",
    });

    // and set it interactive
    leftArrowButton.setInteractive();
    leftArrowButton.on("pointerover", function() {
      this.setFontSize(23);
      this.x -= 1;
      this.y -= 1;
    });

    leftArrowButton.on("pointerout", function() {
      this.setFontSize(22);
      this.x += 1;
      this.y += 1;
    });

    leftArrowButton.on("pointerup", function() {
      if (this.scene.level.hits > 1) {
        this.scene.level.hits--;
        this.scene.hitsLeft--;
        hitsLeftText.text = `Hits left:    ${this.scene.hitsLeft}`;
        rightArrowButton.x = hitsLeftText.getTopRight().x;
        localStorage.setItem("ul" + this.scene.levelNum, JSON.stringify(this.scene.level));
      }
    });


    this.ball = this.add.sprite(ballX, ballY, "ball");
    this.ball.setDepth(6);


    // create pause button
    let pauseButton = this.add.text(825, 1, `ll`, {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "30px",
      fontStyle: "bold",
    });

    // and set it interactive
    pauseButton.setInteractive();
    pauseButton.on("pointerover", function() {
      this.setFontSize(31);
    });

    pauseButton.on("pointerout", function() {
      this.setFontSize(30);
    });

    pauseButton.on("pointerup", function() {
      this.setFontSize(30);
      this.scene.scene.pause("EditScene");
      this.scene.scene.run("PauseScene", {myLevel: true, editScene: true, levelNum: this.scene.levelNum});
    });


    let grid = this.add.grid(450, 300, 820, 520, 20, 20, "0x000000", 0, "0x000000", 1);

    // create show grid button
    let showGridButton = this.add.text(700, 567, `hide grid`, {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "22px",
    });
    showGridButton.setPadding(0, 0, 0, 5);

    // and set it interactive
    showGridButton.setInteractive();
    showGridButton.on("pointerover", function() {
      this.setFontSize(23);
      this.x -= 2;
      this.y -= 1;
    });

    showGridButton.on("pointerout", function() {
      this.setFontSize(22);
      this.x += 2;
      this.y += 1;
    });

    showGridButton.on("pointerup", function() {
      if (grid.visible) {
        grid.visible = false;
        showGridButton.text = "show grid";
      } else {
        grid.visible = true;
        showGridButton.text = "hide grid";
      }
    });


    // setup for selecting item to place

    // this handles all the pictures except grass and ball since they are not in the tileset
    let tilesetSprite = this.add.sprite(260, 580, "wall").setDepth(6);

    // 1 = block; 2 = circle; 3, 4, 5, and 6 = slope a, b, c, and d; 7 = hole; 8 = water; 9 = sand; 10 = ice; -1 = grass
    let wallLayerItems = [1, 2, 3, 4, 5, 6, 7, 20, -1];
    let turfLayerItems = [-1, 8, 9, 10];
    let selectedItem = 1;
    let rectInputs = [];
    for (let i=0; i<wallLayerItems.length; i++) {
      let rectangleInput = this.add.rectangle(tilesetSprite.x - 120 + (i * 40), tilesetSprite.y, 30, 30, "0xFFFFFF");
      rectangleInput.setDepth(5);
      rectangleInput.setStrokeStyle(2, "0x000000", 0);
      rectangleInput.setData("key", wallLayerItems[i]);

      // and set it interactive
      rectangleInput.setInteractive();
      rectangleInput.on("pointerover", function() {
        this.setAlpha(0.8);
      });

      rectangleInput.on("pointerout", function() {
        this.setAlpha(1);
      });

      rectangleInput.on("pointerup", function() {
        for (let j=0; j<rectInputs.length; j++) {
          rectInputs[j].setStrokeStyle(2, "0x000000", 0);
        }
        selectedItem = this.getData("key");
        this.setStrokeStyle(2, "0x000000", 1);
      });

      if (i === 0) {
        rectangleInput.setStrokeStyle(2, "0x000000", 1);
      }

      rectInputs.push(rectangleInput);
    }

    // grass picture
    let grassRect = this.add.rectangle(tilesetSprite.x - 120, tilesetSprite.y, 20, 20, "0x0f9200").setDepth(7);
    grassRect.setAlpha(0);

    // ball outline
    let ballOutline = this.add.circle(tilesetSprite.x + 160, tilesetSprite.y, 8, "0xFFFFFF", 1).setDepth(6).setStrokeStyle(1, "0x000000", 1);

    let itemsText = this.add.text(42, 567, `items:`, {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "22px",
    }).setDepth(7);

    let currLayer = "wall";
    // create edit layer button
    let editLayerButton = this.add.text(550, 8, `edit turf layer`, {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "22px",
    });

    // and set it interactive
    editLayerButton.setInteractive();
    editLayerButton.on("pointerover", function() {
      this.setFontSize(23);
      this.x -= 2;
      this.y -= 1;
    });

    editLayerButton.on("pointerout", function() {
      this.setFontSize(22);
      this.x += 2;
      this.y += 1;
    });

    editLayerButton.on("pointerup", () => {
      if (this.wallLayer.alpha === 1) {
        this.wallLayer.alpha = 0.5;
        currLayer = "turf";
        selectedItem = -1;
        editLayerButton.text = "edit wall layer";
        tilesetSprite.setTexture("turf");
        tilesetSprite.x -= 40;
        grassRect.setAlpha(1);
        ballOutline.setAlpha(0);
        this.ball.setAlpha(0.5);

        // destroy rect inputs
        rectInputs.forEach(rect => {
          rect.destroy();
        });

        // remake rect inputs
        for (let i=0; i<turfLayerItems.length; i++) {
          let rectangleInput = this.add.rectangle(tilesetSprite.x - 80 + (i * 40), tilesetSprite.y, 30, 30, "0xFFFFFF");
          rectangleInput.setDepth(5);
          rectangleInput.setStrokeStyle(2, "0x000000", 0);
          rectangleInput.setData("key", turfLayerItems[i]);

          // and set it interactive
          rectangleInput.setInteractive();
          rectangleInput.on("pointerover", function() {
            this.setAlpha(0.8);
          });

          rectangleInput.on("pointerout", function() {
            this.setAlpha(1);
          });

          rectangleInput.on("pointerup", function() {
            for (let j=0; j<rectInputs.length; j++) {
              rectInputs[j].setStrokeStyle(2, "0x000000", 0);
            }
            selectedItem = this.getData("key");
            this.setStrokeStyle(2, "0x000000", 1);
          });

          if (i === 0) {
            rectangleInput.setStrokeStyle(2, "0x000000", 1);
          }

          rectInputs.push(rectangleInput);
        }
      } else {
        this.wallLayer.alpha = 1;
        currLayer = "wall";
        selectedItem = 1;
        editLayerButton.text = "edit turf layer";
        tilesetSprite.setTexture("wall");
        tilesetSprite.x += 40;
        grassRect.setAlpha(0);
        ballOutline.setAlpha(1);
        this.ball.setAlpha(1);

        // destroy rect inputs
        rectInputs.forEach(rect => {
          rect.destroy();
        });

        // remake rect inputs
        for (let i=0; i<wallLayerItems.length; i++) {
          let rectangleInput = this.add.rectangle(tilesetSprite.x - 120 + (i * 40), tilesetSprite.y, 30, 30, "0xFFFFFF");
          rectangleInput.setDepth(5);
          rectangleInput.setStrokeStyle(2, "0x000000", 0);
          rectangleInput.setData("key", wallLayerItems[i]);

          // and set it interactive
          rectangleInput.setInteractive();
          rectangleInput.on("pointerover", function() {
            this.setAlpha(0.8);
          });

          rectangleInput.on("pointerout", function() {
            this.setAlpha(1);
          });

          rectangleInput.on("pointerup", function() {
            for (let j=0; j<rectInputs.length; j++) {
              rectInputs[j].setStrokeStyle(2, "0x000000", 0);
            }
            selectedItem = this.getData("key");
            this.setStrokeStyle(2, "0x000000", 1);
          });

          if (i === 0) {
            rectangleInput.setStrokeStyle(2, "0x000000", 1);
          }

          rectInputs.push(rectangleInput);
        }
      }
    });


    this.input.on("pointermove", (pointer) => {
      let tileX = Math.floor(pointer.x/20);
      let tileY = Math.floor(pointer.y/20);

      if (pointer.isDown) {
        if (currLayer === "wall") {
          if (tileX > 1 && tileX < 43 && tileY > 1 && tileY < 28 && this.level.items[tileY-2][tileX-2] !== 7 && this.level.items[tileY-2][tileX-2] !== 20) {
            if (selectedItem === 20) {
              this.wallLayer.fill(-1, tileX, tileY, 1, 1);
              this.level.items[Math.floor(this.ball.y/20)-2][Math.floor(this.ball.x/20)-2] = -1;
              this.level.items[tileY-2][tileX-2] = selectedItem;
              this.ball.x = tileX * 20 + 10;
              this.ball.y = tileY * 20 + 10;
            } else {
              this.wallLayer.fill(selectedItem, tileX, tileY, 1, 1);
              this.level.items[tileY-2][tileX-2] = selectedItem;
              if (selectedItem === 7) {
                this.level.items[this.hole.y-2][this.hole.x-2] = -1;
                this.wallLayer.fill(-1, this.hole.x, this.hole.y, 1, 1);
                this.hole = this.wallLayer.findByIndex(7);
              }
            }
          }
        } else if (tileX > 1 && tileX < 43 && tileY > 1 && tileY < 28) {
          this.turfLayer.fill(selectedItem, tileX, tileY, 1, 1);
          this.level.turf[tileY-2][tileX-2] = selectedItem;
        }

        localStorage.setItem("ul" + this.levelNum, JSON.stringify(this.level));
      }
    });


    this.input.on("pointerdown", (pointer) => {
      let tileX = Math.floor(pointer.x/20);
      let tileY = Math.floor(pointer.y/20);

      if (pointer.isDown) {
        if (currLayer === "wall") {
          if (tileX > 1 && tileX < 43 && tileY > 1 && tileY < 28 && this.level.items[tileY-2][tileX-2] !== 7 && this.level.items[tileY-2][tileX-2] !== 20) {
            if (selectedItem === 20) {
              this.wallLayer.fill(-1, tileX, tileY, 1, 1);
              this.level.items[Math.floor(this.ball.y/20)-2][Math.floor(this.ball.x/20)-2] = -1;
              this.level.items[tileY-2][tileX-2] = selectedItem;
              this.ball.x = tileX * 20 + 10;
              this.ball.y = tileY * 20 + 10;
            } else {
              this.wallLayer.fill(selectedItem, tileX, tileY, 1, 1);
              this.level.items[tileY-2][tileX-2] = selectedItem;
              if (selectedItem === 7) {
                this.level.items[this.hole.y-2][this.hole.x-2] = -1;
                this.wallLayer.fill(-1, this.hole.x, this.hole.y, 1, 1);
                this.hole = this.wallLayer.findByIndex(7);
              }
            }
          }
        } else if (tileX > 1 && tileX < 43 && tileY > 1 && tileY < 28) {
          this.turfLayer.fill(selectedItem, tileX, tileY, 1, 1);
          this.level.turf[tileY-2][tileX-2] = selectedItem;
        }

        localStorage.setItem("ul" + this.levelNum, JSON.stringify(this.level));
      }
    });




    // transition in
    this.tweens.add({
      targets: this.blackRect,
      x: this.blackRect.x,
      ease: 'Linear',
      duration: 10,
      repeat: 22,
      yoyo: false,
      onRepeat: () => {
        if (this.blackRect.fillAlpha > 0) {
          this.blackRect.fillAlpha -= 0.05;
        }
        if (this.blackRect.fillAlpha < 0) {
          this.blackRect.fillAlpha = 0;
        }
      },
    });

  }
}
