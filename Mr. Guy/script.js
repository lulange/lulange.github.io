var sketchProc = function(processingInstance) {
 with (processingInstance) {
   size(640, 640);
   frameRate(60);



  /**********
  Main Code
  **********/
  // gameStages to make:
  // EDIT mode
  // PLAY mode
  // MENU stage
  // MAINTITLE stage
  var gameStage = "PLAY";
  var blockSize = width/20;
  var myCanvas = document.getElementById("mycanvas");
  myCanvas.style.borderLeftWidth = blockSize + "px";
  myCanvas.style.borderRightWidth = blockSize + "px";
  document.body.style.zoom = (window.innerHeight/width)*100 + "%";
  var blocks = [];
  var trampolines = [];
  var coordinateTracker = [];
  for (var i=0; i<20; i++) {
    coordinateTracker[i] = [];
    for (var t=0; t<20; t++) {
      coordinateTracker[i][t] = "blank";
    }
  }


  class SquareObstacle  {
    constructor(xCoor, yCoor) {
      this.x = xCoor*blockSize;
      this.y = yCoor*blockSize;
      this.color = color(0, random(100, 200), 0);
    }

    draw() {
      fill(this.color);
      noStroke();
      rect(this.x, this.y, blockSize, blockSize);
    }
  }

  class Trampoline {
    constructor(xCoor, yCoor) {
      this.x = xCoor*blockSize;
      this.y = yCoor*blockSize;
    }

    draw() {
      stroke(100, 100, 100);
      strokeWeight(blockSize/20);
      line(this.x+blockSize*0.2, this.y+blockSize/2, this.x+blockSize*0.2, this.y+blockSize);
      line(this.x+blockSize*0.8, this.y+blockSize/2, this.x+blockSize*0.8, this.y+blockSize);
      stroke(0, 0, 200);
      strokeWeight(blockSize/10);
      line(this.x+blockSize/10, this.y+blockSize/2, this.x+blockSize-blockSize/10, this.y+blockSize/2);
    }
  }

  class Stomper  {
    constructor(xCoor, yCoor) {
      this.x = xCoor*blockSize;
      this.y = yCoor*blockSize;
    }

    draw() {
      fill(0, 0, 0);
      noStroke();
      rect(this.x, this.y, blockSize, blockSize*0.7);
      fill(100, 100, 100);
      triangle(this.x, this.y+blockSize*0.68, this.x + blockSize, this.y+blockSize*0.68, this.x + blockSize/2, this.y + blockSize);
    }
  }


/******  TESTING BLOCKS ADDED! NOT IN FINAL GAME!  ******/
  for (var i=1; i<20; i++) {
    if (i<10) {
      blocks.push(new SquareObstacle(i, 15));
      coordinateTracker[i][15] = "block";
    } else if (i === 10) {
    } else {
      blocks.push(new SquareObstacle(i, 16));
      coordinateTracker[i][16] = "block";
    }
  }

  for (var q=5; q<20; q++) {
      blocks.push(new SquareObstacle(q, 12));
      coordinateTracker[q][12] = "block";
  }

  trampolines.push(new Trampoline(10, 11));
  coordinateTracker[10][11] = "tramp";

  trampolines.push(new Trampoline(3, 14));
  coordinateTracker[3][14] = "tramp";

  blocks.push(new SquareObstacle(14, 11));
  coordinateTracker[14][11] = "block";


  //trampolines.push(new Stomper(7, 9));
  //coordinateTracker[7][9] = "block";
/******  END OF TESTING BLOCKS! BACK TO MAIN CODE  ******/



  var player = {
    x: blockSize*12.5,
    y: blockSize*11,
    initialX: blockSize*12.5,
    initialY: blockSize*11,
    xMomentum: 0,
    yMomentum: 0,
    speed: blockSize/15,
    alive: true,
    legSwing: 0,
    legSwingUpDown: "UP",
    legSwingSize: blockSize/6,
    wallMode: false,
    draw: function() {
      // this is for legSwing
      if (gameStage === "PLAY") {
        if (this.yMomentum === 0 || this.wallMode === true) {
          if (this.xMomentum === 0 && this.legSwing > this.legSwingSize/3) {
            this.legSwing -=this.speed/2.5;
          } else if (this.xMomentum === 0 && this.legSwing < this.legSwingSize/3) {
            this.legSwing = 0;
          }

          if (this.xMomentum === this.speed || this.xMomentum === -this.speed) {
            if (this.legSwingUpDown === "UP") {
              this.legSwing += this.speed*0.3;
              if (this.legSwing >= this.legSwingSize) {
                this.legSwingUpDown = "DOWN";
              }
            } else {
              this.legSwing -= this.speed*0.5;
              if (this.legSwing <= 0) {
                this.legSwingUpDown = "UP";
              }
            }
          }
        }
      } else if (gameStage === "EDIT") {
        this.legSwing = this.legSwingSize;
      }

      // this is for drawing the actual player
      fill(100, 0, 100);
      stroke(100, 0, 100);
      var drawX = Math.round(this.x);
      var drawY = Math.round(this.y);
      // body
      noStroke();
      rect(drawX - blockSize/16, this.y - blockSize*0.85, blockSize/8, blockSize*0.45, 10);
      // legs
      stroke(100, 0, 100);
      strokeWeight(blockSize/9.14);
      line(drawX, this.y - blockSize*0.44, drawX - this.legSwing, this.y - blockSize/16);
      line(drawX, this.y - blockSize*0.44, drawX + this.legSwing, this.y - blockSize/16);
      // arms
      line(drawX, this.y - Math.round(blockSize*0.74), drawX - this.legSwing, this.y - blockSize*0.44);
      line(drawX, this.y - Math.round(blockSize*0.74), drawX + this.legSwing, this.y - blockSize*0.44);
      // head
      strokeWeight(blockSize/4);
      line(this.x, this.y - blockSize*0.9, this.x, this.y - blockSize*0.9);
    },
    move: function() {
      // move the player
      this.x += this.xMomentum;
      this.y += this.yMomentum;
    },
    detectBlockAbove: function() {
      // the blocks where the player's legs are
      var blocksX = Math.floor(this.x/blockSize);
      var blocksY = Math.floor((this.y)/blockSize);

      // this makes it so that you can hit your head on a block above you
      if (coordinateTracker[blocksX][blocksY-1] === "block") {
        this.y -= this.yMomentum*2;
        this.yMomentum = 1;
      }
    },
    detectBlockBelow: function() {

      // blockX1 is where your left leg is in blocks
      var blockX1 = Math.floor((this.x - this.legSwing - blockSize/20)/blockSize);
      // if it is off the screen make sure it does not throw off errors
      if (blockX1 < 0) {
        blockX1 = 0;
      }
      // blockX2 is where your right leg is in blocks
      var blockX2 = Math.floor((this.x + this.legSwing + blockSize/20)/blockSize);
      // if it is off the screen make sure it does not throw off errors
      if (blockX2 > 19) {
        blockX2 = 19;
      }


      // if your left leg or your right leg is in a block then get it out of the block and stop your movement
      var fall = true;
      if (this.yMomentum >= 0 && coordinateTracker[blockX1][Math.floor((this.y + blockSize/10)/blockSize)] === "block" || this.yMomentum >= 0 && coordinateTracker[blockX2][Math.floor((this.y + blockSize/10)/blockSize)] === "block" ) {
        this.y = Math.floor((this.y + blockSize/10)/blockSize)*blockSize;
        this.yMomentum = 0;
        fall = false;
      } else if (this.yMomentum > 0 && coordinateTracker[blockX1][Math.floor((this.y - blockSize/3)/blockSize)] === "tramp" || this.yMomentum > 0 && coordinateTracker[blockX2][Math.floor((this.y - blockSize/3)/blockSize)] === "tramp" ) {
        this.yMomentum = -blockSize/3.5;
        player.legSwing = player.legSwingSize;
        player.legSwingUpDown = "DOWN";
      }
      if (fall === true) {
        this.yMomentum += blockSize/100;
      }
    },
    detectBlockLeftRight: function() {

      // the blocks where the player's legs are
      var blocksX = Math.floor(this.x/blockSize);
      var blocksY = Math.floor((this.y - blockSize/5)/blockSize);
      var blocksXMinus1 = blocksX-1;
      var blocksXPlus1 = blocksX+1;
      if (blocksXMinus1 < 0) {
        blocksXMinus1 = 0;
      }
      if (blocksXPlus1 > 19) {
        blocksXPlus1 = 19;
      }
      // blockX1 is where your left leg is in blocks
      var blockX1 = Math.floor((this.x - this.legSwing - blockSize/5)/blockSize);
      // if it is off the screen make sure it does not throw off errors
      if (blockX1 < 0) {
        blockX1 = 0;
      }
      // blockX2 is where your right leg is in blocks
      var blockX2 = Math.floor((this.x + this.legSwing + blockSize/5)/blockSize);
      // if it is off the screen make sure it does not throw off errors
      if (blockX2 > 19) {
        blockX2 = 19;
      }

      // head bump
      if (coordinateTracker[blocksXMinus1][blocksY] === "block" && this.x <= (blocksXMinus1)*blockSize + blockSize*1.13 || coordinateTracker[blocksXMinus1][Math.floor((this.y-blockSize*0.79)/blockSize)] === "block" && this.x <= (blocksXMinus1)*blockSize + blockSize*1.13) {
        this.legSwing = 0;
        this.x = (blocksXMinus1)*blockSize + blockSize*1.13;
      } else if (coordinateTracker[blocksXPlus1][blocksY] === "block" && this.x >= (blocksXPlus1)*blockSize - blockSize*0.13 || coordinateTracker[blocksXPlus1][Math.floor((this.y-blockSize*0.79)/blockSize)] === "block" && this.x >= (blocksXPlus1)*blockSize - blockSize*0.10) {
        this.legSwing = 0;
        this.x = (blocksXPlus1)*blockSize - blockSize*0.13;
      }

      // leg bump
      if (coordinateTracker[blockX1][blocksY] === "block" || coordinateTracker[blockX1][Math.floor((this.y-blockSize*0.9)/blockSize)] === "block") {
        this.wallMode = true;
        if (this.legSwing > 0) {
          this.legSwing -= this.speed*1.1;
        }
      } else if (coordinateTracker[blockX2][blocksY] === "block" || coordinateTracker[blockX2][Math.floor((this.y-blockSize*0.9)/blockSize)] === "block") {
        this.wallMode = true;
        if (this.legSwing > 0) {
          this.legSwing -= this.speed*1.1;
        }
      } else {
        this.wallMode = false;
      }
    },
    detectWalls: function() {
      // if your head is hitting the left wall then make sure you are not in it and stop your leg movement
      if (this.x <= blockSize/8) {
        this.x = blockSize/8;
        this.xMomentum = 0;
        this.legSwing = 0;
      // else if your head is hitting the right wall then make sure you are not in it and stop your leg movement
      } else if (this.x >= width - blockSize/8) {
        this.x = width - blockSize/8;
        this.legSwing = 0;
        this.xMomentum = 0;
      }

      // if your left arm is hitting the left wall then make sure your left arm is not in it same for right arm
      if (Math.floor((this.x - this.legSwing - blockSize/20)/blockSize) < 0) {
        this.wallMode = true;
        if (this.legSwing > 0) {
          this.legSwing -= this.speed*1.1;
        }
      } else if (Math.floor((this.x + this.legSwing + blockSize/20)/blockSize) > 19) {
        this.wallMode = true;
        if (this.legSwing > 0) {
          this.legSwing -= this.speed*1.1;
        }
      } else {
        this.wallMode = false;
      }
    },
    update: function() {
      this.move();
      this.detectBlockAbove();
      this.detectBlockLeftRight();
      this.detectBlockBelow();
      this.detectWalls();
      this.draw();
      if (this.y > height+200) {
        this.alive = false;
      }
      if (this.alive !== true) {
        //this.x = this.initialX;
        this.y = 0;
        this.alive = true;
      }
    },
  };

  var drawGrid = function() {
    for (let i=1; i<20; i++) {
      strokeWeight(1);
      stroke(100, 100, 100);
      line(blockSize*i, 0, blockSize*i, height);
      line(0, blockSize*i, width, blockSize*i);
    }
  };

  var drawBlocks = function() {
    for (let i=0; i<blocks.length; i++) {
      blocks[i].draw();
    }
  };

  var drawTrampolines = function() {
    for (let i=0; i<trampolines.length; i++) {
      trampolines[i].draw();
    }
  };

  draw = function() {
    background(0, 204, 255);
    if (gameStage === "PLAY") {
      drawTrampolines();
      player.update();
      drawBlocks();
    }
    else if (gameStage === "EDIT") {
      drawTrampolines();
      player.draw();
      drawBlocks();
      drawGrid();
    }
  }

  keyPressed = function() {
    if (gameStage === "PLAY") {
      if (player.yMomentum === 0) {
        if (keyCode === RIGHT) {
          player.speed = blockSize/15;
          player.xMomentum = player.speed;
        } else if (keyCode === LEFT) {
          player.speed = blockSize/15;
          player.xMomentum = -player.speed;
        }
      } else {
        if (keyCode === RIGHT) {
          player.speed = blockSize/20;
          player.xMomentum = player.speed;
        } else if (keyCode === LEFT) {
          player.speed = blockSize/20;
          player.xMomentum = -player.speed;
        }
      }

      if (keyCode === UP && player.yMomentum === 0) {
        player.legSwing = player.legSwingSize;
        player.legSwingUpDown = "DOWN";
        player.yMomentum = -blockSize/4.7;
      }
    }
    else if (gameStage === "EDIT") {

    }
  }

  keyReleased = function() {
    if (gameStage === "PLAY") {
      if (keyCode === RIGHT) {
        player.xMomentum = 0;
      } else if (keyCode === LEFT) {
        player.xMomentum = 0;
      }
    }
    else if (gameStage === "EDIT") {

    }
  }

}};

// Get the canvas that Processing-js will use
var canvas = document.getElementById("mycanvas");
// Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
var processingInstance = new Processing(canvas, sketchProc);
