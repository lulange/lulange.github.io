import levels from "./levels.js";


export default class GameScene extends Phaser.Scene {
  constructor(level) {
    super({key: "GameScene"});
  }

  init(data) {
    if (data.userLevel) {
      this.levelNum = data.level;
      this.levelBanner = `My Level: ${this.levelNum}`;
      this.level = JSON.parse(localStorage.getItem("ul" + this.levelNum));
      this.hitsLeft = this.level.hits;
      this.userLevel = true;
    } else {
      this.levelNum = data.level;
      this.levelBanner = `Level: ${this.levelNum}`;
      this.hitsLeft = levels[this.levelNum-1].hits;
      this.level = levels[this.levelNum-1];
      this.userLevel = false;
    }

    // powerSensitivity variable (1 is normal)
    this.powerSensitivity = 1;
  }

  preload() {
    // create rectangle for transition
    this.blackRect = this.add.rectangle(450, 300, 900, 600, "0x000000", 1);
    this.blackRect.setDepth(10);

    this.load.scenePlugin("Slopes", "../projects/slopes.js");

    // tilemap
    this.load.image("tileset", "https://cdn.glitch.com/1737f775-4be5-40d3-b5b1-2ba50647b921%2Ftileset.png?v=1596372878925");
    this.load.tilemapTiledJSON("map", "../projects/minigolfMap.json");

    // ball sprite
    this.load.image("white", "https://cdn.glitch.com/1737f775-4be5-40d3-b5b1-2ba50647b921%2Fball.png?v=1594590260477");
    this.load.image("red", "https://cdn.glitch.com/1737f775-4be5-40d3-b5b1-2ba50647b921%2FredBall.png?v=1596914817032");
    this.load.image("orange", "https://cdn.glitch.com/1737f775-4be5-40d3-b5b1-2ba50647b921%2ForangeBall.png?v=1596914808138");
    this.load.image("blue", "https://cdn.glitch.com/1737f775-4be5-40d3-b5b1-2ba50647b921%2FblueBall.png?v=1596914833505");
    this.load.image("gold", "https://cdn.glitch.com/1737f775-4be5-40d3-b5b1-2ba50647b921%2FgoldBall.png?v=1596914853481");
    this.load.image("purple", "https://cdn.glitch.com/1737f775-4be5-40d3-b5b1-2ba50647b921%2FpurpleBall.png?v=1596914816877");
    this.load.image("green", "https://cdn.glitch.com/1737f775-4be5-40d3-b5b1-2ba50647b921%2FgreenBall.png?v=1596914824003");
    this.load.image("sky blue", "https://cdn.glitch.com/1737f775-4be5-40d3-b5b1-2ba50647b921%2FskyBlue.png?v=1596995370671");
  }

  create() {
    this.ballInAudio = document.getElementById("ballIn");
    this.ballDeadAudio = document.getElementById("ballDead");
    this.lastLevelWinAudio = document.getElementById("lastLevel");

    // this is a necessary change to the physics for my ball to work
    this.matter.resolver._restingThresh = 0.001;
    this.matter.world.autoUpdate = false;

    // console.log((300 - (MenuButton.getTopRight().x- MenuButton.getTopLeft().x)) / 2 );

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

    this.wallLayer.setCollisionBetween(0, 6);
    this.hole = this.wallLayer.findByIndex(7);

    this.matter.world.convertTilemapLayer(this.wallLayer);

    /********
    * create buttons and text headline
    *********/
    let levelText = this.add.text(50, 8, this.levelBanner, {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "24px",
    });

    let hitsLeftText = this.add.text(190, 9, `Hits left: ${this.hitsLeft}`, {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "22px",
    });
    if (this.userLevel === true) {
      hitsLeftText.x += 30;
    }

    // setup power bar
    let powerText = this.add.text(380, 9, `Power:`, {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "22px",
    });

    // rectangle for power bar background
    this.add.rectangle(605, 20, 300, 29, "0x000000", 0).setStrokeStyle(2, "0xFFFFFF");
    this.powerBar = this.add.rectangle(455, 20, 0, 29, "0xFFFFFF");



    let ballMaxPower = 5;
    this.ball = this.matter.add.sprite(ballX, ballY, sessionStorage.getItem("ball"));
    this.ball.setDepth(6);
    this.ball.setCircle(8);
    this.ball.setFixedRotation();
    this.ball.setFriction(0, 0.005, 0);
    this.ball.setBounce(1);
    this.ball.setData("dragging", false);
    this.ball.setData("dragVelocity", {x: 0, y: 0});

    this.ball.setInteractive();
    this.ball.on("pointerdown", function(e) {
      if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
        this.setData("dragging", true);
      }
    });

    let ballLine;
    this.input.on("pointermove", (pointer) => {
      // declare a few variables that are used for calculations later
      let a = Math.abs(this.ball.x - pointer.x);
      let b = Math.abs(this.ball.y - pointer.y);
      let dist = Math.sqrt(a**2 + b**2);
      a = (this.ball.x - pointer.x);
      b = (this.ball.y - pointer.y);
      let slope = b/a;

      if (this.ball.getData("dragging") && dist > 8) {
        // calculate how much to add on to the center point of the ball to reach the edge with a given slope
        let ballLineX, ballLineY;

        if (isFinite(slope) === false) {
          ballLineX = 0;
          if (pointer.y >= this.ball.y) {
            ballLineY = 8;
          } else {
            ballLineY = -8;
          }
        } else {
          ballLineX = 8 / Math.sqrt((slope**2) + 1);
          ballLineY = slope * ballLineX;
        }


        // declare the power
        let powerA, powerB;
        if (isFinite(slope) === true) {
          if (this.ball.x < pointer.x) {
            powerA = (this.ball.x + ballLineX - pointer.x);
            powerB = (this.ball.y + ballLineY - pointer.y);
          } else {
            powerA = (this.ball.x - ballLineX - pointer.x);
            powerB = (this.ball.y - ballLineY - pointer.y);
          }
        } else {
          powerA = (this.ball.x + ballLineX - pointer.x);
          powerB = (this.ball.y + ballLineY - pointer.y);
        }
        let powerDist =  Math.sqrt(powerA**2 + powerB**2);
        let power = (powerDist / 20) * this.powerSensitivity;

        // calculate power for current position
        let powerX, powerY;
        if (power >= ballMaxPower) {
          if (isFinite(slope) === false) {
            powerX = 0;
            if (pointer.y <= this.ball.y) {
              powerY = ballMaxPower - 0.0001;
            } else {
              powerY = -(ballMaxPower - 0.0001);
            }
          } else {
            powerX = (ballMaxPower - 0.0001) / Math.sqrt((slope**2) + 1);
            powerY = slope * powerX;
          }
          power = ballMaxPower - 0.0001;
          if (pointer.x > this.ball.x) {
            powerX *= -1;
            powerY *= -1;
          }
        } else {
          if (isFinite(slope) === true) {
            if (this.ball.x < pointer.x) {
              powerX = ((this.ball.x + ballLineX - pointer.x) / 20) * this.powerSensitivity;
              powerY = ((this.ball.y + ballLineY - pointer.y) / 20) * this.powerSensitivity;
            } else {
              powerX = ((this.ball.x - ballLineX - pointer.x) / 20) * this.powerSensitivity;
              powerY = ((this.ball.y - ballLineY - pointer.y) / 20) * this.powerSensitivity;
            }
          } else {
            if (this.ball.x < pointer.x) {
              powerX = ((this.ball.x - ballLineX - pointer.x) / 20) * this.powerSensitivity;
              powerY = ((this.ball.y - ballLineY - pointer.y) / 20) * this.powerSensitivity;
            } else {
              powerX = ((this.ball.x + ballLineX - pointer.x) / 20) * this.powerSensitivity;
              powerY = ((this.ball.y + ballLineY - pointer.y) / 20) * this.powerSensitivity;
            }
          }
        }

        // set power
        this.ball.setData("dragVelocity", {
          x: powerX,
          y: powerY,
        });

        // destroy previous ballLine
        if (ballLine !== undefined && ballLine !== null) {
          ballLine.destroy();
        }

        // create new ballLine then draw it using calculated values
        ballLine = this.add.graphics().setDepth(6);

        if (power >= ballMaxPower) {
          ballLine.lineStyle(2, "0xFF0000", 1.0);
        } else {
          ballLine.lineStyle(2, "0x000000", 1.0);
        }

        // draw ballLine
        ballLine.beginPath();
        if (pointer.x < this.ball.x) {
          ballLine.moveTo(this.ball.x + ballLineX, this.ball.y + ballLineY);
          ballLine.lineTo(this.ball.x + ballLineX + (this.ball.getData("dragVelocity").x * 40), this.ball.y + ballLineY + (this.ball.getData("dragVelocity").y * 40));
        } else {
          ballLine.moveTo(this.ball.x - ballLineX, this.ball.y - ballLineY);
          ballLine.lineTo(this.ball.x - ballLineX + (this.ball.getData("dragVelocity").x * 40), this.ball.y - ballLineY + (this.ball.getData("dragVelocity").y * 40));
        }
        ballLine.closePath();
        ballLine.strokePath();

        // fill Power bar based on power
        let powerPercent = (power/ballMaxPower - 0.0001) * 100;
        if (powerPercent > 100) {
          powerPercent = 100;
          this.powerBar.setFillStyle("0xFF0000");
        } else {
          this.powerBar.setFillStyle("0xFFFFFF");
        }
        this.powerBar.width = powerPercent * 3;
      } else {
        // no power if in ball
        this.ball.setData("dragVelocity", {x: 0, y: 0});

        // destroy previous ballLine
        if (ballLine !== undefined && ballLine !== null) {
          ballLine.destroy();
        }
      }
    });

    this.input.on("pointerup", (pointer) => {
      let a = Math.abs(this.ball.x - pointer.x);
      let b = Math.abs(this.ball.y - pointer.y);
      let dist = Math.sqrt(a**2 + b**2);

      if (this.ball.getData("dragging") && dist > 8) {
        this.ball.setData("dragging", false);

        let vel = this.ball.getData("dragVelocity");
        this.ball.setVelocity(vel.x, vel.y);
        this.ball.setData("dragVelocity", {x: 0, y: 0});

        this.hitsLeft--;
        hitsLeftText.text = `Hits left: ${this.hitsLeft}`;

        if (ballLine !== undefined && ballLine !== null) {
          ballLine.destroy();
        }
      } else {
        this.ball.setData("dragging", false);

        if (ballLine !== undefined && ballLine !== null) {
          ballLine.destroy();
        }
      }
    });

    // setup leave canvas listener
    this.sys.canvas.addEventListener("mouseout", () => {
      if (this.ball.getData("dragging")) {
        this.ball.setData("dragging", false);
        this.ball.setData("dragVelocity", {x: 0, y: 0});
        if (ballLine !== undefined && ballLine !== null) {
          ballLine.destroy();
        }
      }
    });


    // create pause button
    let pauseButton = this.add.text(825, 1, `ll`, {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "30px",
      fontStyle: "bold",
    });

    // and set it interactive
    pauseButton.setInteractive();
    pauseButton.on("pointerover", function() {
      if (!this.scene.ball.getData("dragging")) {
        this.setFontSize(31);
      }
    });

    pauseButton.on("pointerout", function() {
      this.setFontSize(30);
    });

    pauseButton.on("pointerup", function() {
      if (!this.scene.ball.getData("dragging")) {
        this.setFontSize(30);
        this.scene.scene.pause("GameScene");
        this.scene.scene.run("PauseScene", {myLevel: this.scene.userLevel, editScene: false, levelNum: this.scene.levelNum});
      }
    });



    // power sensitivity options
    // create banner
    let powerSensitivityBanner = this.add.text(45, 568, `Power Sensitivity:`, {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "22px",
    });


    // create low button
    let lowPowerButton = this.add.text(250, 568, `1`, {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "22px",
    });

    // and set it interactive
    lowPowerButton.setInteractive();
    lowPowerButton.on("pointerover", function() {
      if (!this.scene.ball.getData("dragging")) {
        this.setFontSize(24);
        this.y -= 3;
        this.x -= 1;
      }
    });

    lowPowerButton.on("pointerout", function() {
      if (!this.scene.ball.getData("dragging")) {
        this.setFontSize(22);
        this.y = 568;
        this.x += 1;
      }
    });

    lowPowerButton.on("pointerup", function() {
      if (!this.scene.ball.getData("dragging")) {
        this.scene.powerSensitivity = 0.5;
        this.text = "|1|";
        normalPowerButton.text = "2";
        highPowerButton.text = "3";

        this.x = 240;
        normalPowerButton.x = 290;
        highPowerButton.x = 330;
      }
    });

    // create normal power button
    let normalPowerButton = this.add.text(280, 568, `|2|`, {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "22px",
    });

    // and set it interactive
    normalPowerButton.setInteractive();
    normalPowerButton.on("pointerover", function() {
      if (!this.scene.ball.getData("dragging")) {
        this.setFontSize(24);
        this.y -= 3;
        this.x -= 1;
      }
    });

    normalPowerButton.on("pointerout", function() {
      if (!this.scene.ball.getData("dragging")) {
        this.setFontSize(22);
        this.y = 568;
        this.x += 1;
      }
    });

    normalPowerButton.on("pointerup", function() {
      if (!this.scene.ball.getData("dragging")) {
        this.scene.powerSensitivity = 1;
        this.text = "|2|";
        highPowerButton.text = "3";
        lowPowerButton.text = "1";

        this.x = 280;
        lowPowerButton.x = 250;
        highPowerButton.x = 330;
      }
    });

    // create normal power button
    let highPowerButton = this.add.text(330, 568, `3`, {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "22px",
    });

    // and set it interactive
    highPowerButton.setInteractive();
    highPowerButton.on("pointerover", function() {
      if (!this.scene.ball.getData("dragging")) {
        this.setFontSize(24);
        this.y -= 3;
        this.x -= 1;
      }
    });

    highPowerButton.on("pointerout", function() {
      if (!this.scene.ball.getData("dragging")) {
        this.setFontSize(22);
        this.y = 568;
        this.x += 1;
      }
    });

    highPowerButton.on("pointerup", function() {
      if (!this.scene.ball.getData("dragging")) {
        this.scene.powerSensitivity = 2;
        this.text = "|3|";
        normalPowerButton.text = "2";
        lowPowerButton.text = "1";

        this.x = 320;
        lowPowerButton.x = 250;
        normalPowerButton.x = 290;
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

  update() {

    if (!this.ball.getData("dragging")) {
      this.powerBar.width = (this.ball.body.speed / 5) * 300;
    }


    for (let i=0; i<3; i++) {
      if (this.blackRect.fillAlpha !== 0) {
        break;
      }

      this.matter.world.step();

      switch (this.turfLayer.getTileAtWorldXY(this.ball.x, this.ball.y, true).index) {
        case -1:
          if (this.ball.body.frictionAir !== 0.005) {
            this.ball.setFriction(0, 0.005, 0);
          }
          break;

        case 9:
          if (this.ball.body.frictionAir !== 0.02) {
            this.ball.setFriction(0, 0.04, 0);
          }
          break;

        case 10:
          if (this.ball.body.frictionAir !== 0.002) {
            this.ball.setFriction(0, 0.002, 0);
          }
          break;

        case 8:
          this.ballDeadAudio.play();
          this.blackRect.fillAlpha = 0.05;
          this.tweens.add({
            targets: this.blackRect,
            x: this.blackRect.x,
            ease: 'Linear',
            duration: 10,
            repeat: 22,
            yoyo: false,
            onRepeat: () => {
              if (this.blackRect.fillAlpha < 1) {
                this.blackRect.fillAlpha += 0.05;
              }
              if (this.blackRect.fillAlpha > 1) {
                this.blackRect.fillAlpha = 1;
              }
            },
            onComplete: () => {
              this.scene.stop("GameScene");
              this.scene.start("GameScene");
            },
          });
          break;
      }

      if (this.hitsLeft === 0 && this.ball.body.speed === 0 && this.wallLayer.getTileAtWorldXY(this.ball.x, this.ball.y, true).index !== 7) {
        this.ballDeadAudio.play();
        this.blackRect.fillAlpha = 0.05;
        this.tweens.add({
          targets: this.blackRect,
          x: this.blackRect.x,
          ease: 'Linear',
          duration: 10,
          repeat: 22,
          yoyo: false,
          onRepeat: () => {
            if (this.blackRect.fillAlpha < 1) {
              this.blackRect.fillAlpha += 0.05;
            }
            if (this.blackRect.fillAlpha > 1) {
              this.blackRect.fillAlpha = 1;
            }
          },
          onComplete: () => {
            this.scene.stop("GameScene");
            this.scene.start("GameScene");
          },
        });
      }

      let a = Math.abs(this.ball.x - (this.hole.pixelX+10));
      let b = Math.abs(this.ball.y - (this.hole.pixelY+10));
      let dist = Math.sqrt(a**2 + b**2);

      if (dist < 12) {
        a = (this.ball.x - (this.hole.pixelX+10));
        b = (this.ball.y - (this.hole.pixelY+10));
        let slope = b/a;

        let powerX, powerY;

        if (dist > 3.5) {
          if (isFinite(slope) === false) {
            powerX = 0;
            if (this.hole.pixelY+10 >= this.ball.y) {
              powerY = 0.00001 * this.ball.body.speed * 5;
            } else {
              powerY = -0.00001 * this.ball.body.speed * 5;
            }
          } else {
            powerX = (0.00001 * this.ball.body.speed * 5) / Math.sqrt((slope**2) + 1);
            powerY = slope * powerX;
          }

          if (this.ball.x > this.hole.pixelX+10) {
            this.ball.applyForce({x: -powerX, y: -powerY});
          } else {
            this.ball.applyForce({x: powerX, y: powerY});
          }
        } else if (this.ball.body.speed < 3) {
          this.ball.setVelocity(0, 0);

          if (this.ball.x < this.hole.pixelX+10) {
            this.ball.x += 0.1;
          } else if (this.ball.x > this.hole.pixelX+10) {
            this.ball.x -= 0.1;
          }

          if (this.ball.y < this.hole.pixelY+10) {
            this.ball.y += 0.1;
          } else if (this.ball.y > this.hole.pixelY+10) {
            this.ball.y -= 0.1;
          }
        }


        if (Math.abs(this.ball.x - (this.hole.pixelX + 10)) < 1 && Math.abs(this.ball.y - (this.hole.pixelY + 10)) < 1) {
          this.ball.setScale(0.9);
          if (this.levelNum === 30) {
            this.lastLevelWinAudio.play();
          } else {
            this.ballInAudio.play();
          }
        }


        if (Math.abs(this.ball.x - (this.hole.pixelX + 10)) < 0.3 && Math.abs(this.ball.y - (this.hole.pixelY + 10)) < 0.3) {
          this.blackRect.fillAlpha = 0.05;
          this.tweens.add({
            targets: this.blackRect,
            x: this.blackRect.x,
            ease: 'Linear',
            duration: 10,
            repeat: 22,
            yoyo: false,
            onRepeat: () => {
              if (this.blackRect.fillAlpha < 1) {
                this.blackRect.fillAlpha += 0.05;
              }
              if (this.blackRect.fillAlpha > 1) {
                this.blackRect.fillAlpha = 1;
              }
            },
            onComplete: () => {
              this.scene.stop();
              this.scene.start("LevelWinScene", {myLevel: this.userLevel, levelNum: this.levelNum});
            },
          });
        }

      }


      if (Math.abs(this.ball.body.velocity.x) < 0.01) {
        this.ball.setVelocityX(0);
      }
      if (Math.abs(this.ball.body.velocity.y) < 0.01) {
        this.ball.setVelocityY(0);
      }
    }
  }
}
