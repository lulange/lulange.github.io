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
  var gameStage = "EDIT";
  var blockSize = width/20;
  var currEdit = "block";
  var currEditDisplay;
  var myCanvas = document.getElementById("mycanvas");
  myCanvas.style.borderLeftWidth = blockSize + "px";
  myCanvas.style.borderRightWidth = blockSize + "px";
  myCanvas.focus();
  document.body.style.zoom = (window.innerHeight/width)*100 + "%";
  var zoom = (window.innerHeight/width);
  var canvasWidth = width*zoom;
  var blocks = [];
  var trampolines = [];
  var lava = [];
  var coordinateTracker = [];
  for (var i=0; i<20; i++) {
    coordinateTracker[i] = [];
    for (var t=0; t<20; t++) {
      coordinateTracker[i][t] = "blank";
    }
  }


  // setup for the buttons on the outside
  {
  var playButton = document.getElementById("play-button");
  playButton.style.width = ((window.innerWidth-canvasWidth)/2) * (640/canvasWidth) - blockSize + "px";
  playButton.style.left = "0px";
  playButton.style.top = blockSize*3.5 + "px";
  playButton.addEventListener("click", function() {
    if (gameStage === "EDIT") {
      player.x = player.initialX;
      player.y = player.initialY;
      flag.x = flag.initialX;
      flag.y = flag.initialY;
      gameStage = "PLAY";
      currEdit = "block";
      myCanvas.focus();
      playButton.textContent = "edit";
      player.yMomentum = 0;
    } else if (gameStage === "PLAY") {
      player.x = player.initialX;
      player.y = player.initialY;
      flag.x = flag.initialX;
      flag.y = flag.initialY;
      gameStage = "EDIT";
      myCanvas.focus();
      playButton.textContent = "play";
      player.yMomentum = 0;
    }
  });

  var blocksButton = document.getElementById("blocks-button");
  blocksButton.style.width = ((window.innerWidth-canvasWidth)/2) * (640/canvasWidth) - blockSize + "px";
  blocksButton.style.left = parseFloat(blocksButton.style.width) +  blockSize*22 + "px";
  blocksButton.style.top = blockSize + "px";
  blocksButton.addEventListener("click", function() {
    currEdit = "block";
    myCanvas.focus();
    player.x = player.initialX;
    player.y = player.initialY;
    flag.x = flag.initialX;
    flag.y = flag.initialY;
  });

  var trampsButton = document.getElementById("tramps-button");
  trampsButton.style.width = ((window.innerWidth-canvasWidth)/2) * (640/canvasWidth) - blockSize + "px";
  trampsButton.style.left = parseFloat(trampsButton.style.width) +  blockSize*22 + "px";
  trampsButton.style.top = blockSize*3.5 + "px";
  trampsButton.addEventListener("click", function() {
    currEdit = "tramp";
    myCanvas.focus();
    player.x = player.initialX;
    player.y = player.initialY;
    flag.x = flag.initialX;
    flag.y = flag.initialY;
  });

  var deleteButton = document.getElementById("delete-button");
  deleteButton.style.width = ((window.innerWidth-canvasWidth)/2) * (640/canvasWidth) - blockSize + "px";
  deleteButton.style.left = parseFloat(deleteButton.style.width) +  blockSize*22 + "px";
  deleteButton.style.top = blockSize*6 + "px";
  deleteButton.addEventListener("click", function() {
    currEdit = "blank";
    myCanvas.focus();
    player.x = player.initialX;
    player.y = player.initialY;
    flag.x = flag.initialX;
    flag.y = flag.initialY;
  });

  var setPlayerButton = document.getElementById("set-player-button");
  setPlayerButton.style.width = ((window.innerWidth-canvasWidth)/2) * (640/canvasWidth) - blockSize + "px";
  setPlayerButton.style.left = parseFloat(setPlayerButton.style.width) +  blockSize*22 + "px";
  setPlayerButton.style.top = blockSize*8.5 + "px";
  setPlayerButton.addEventListener("click", function() {
    currEdit = "player";
    myCanvas.focus();
    flag.x = flag.initialX;
    flag.y = flag.initialY;
  });

  var setFlagButton = document.getElementById("set-flag-button");
  setFlagButton.style.width = ((window.innerWidth-canvasWidth)/2) * (640/canvasWidth) - blockSize + "px";
  setFlagButton.style.left = parseFloat(setFlagButton.style.width) +  blockSize*22 + "px";
  setFlagButton.style.top = blockSize*11 + "px";
  setFlagButton.addEventListener("click", function() {
    currEdit = "flag";
    myCanvas.focus();
    player.x = player.initialX;
    player.y = player.initialY;
  });
}
  // end of setup for the buttons


  class Block {
    constructor(xCoor, yCoor, editVer) {
      this.x = xCoor*blockSize;
      this.y = yCoor*blockSize;
      this.color = color(0, 0, 0);
      this.editVer = editVer || false;
    }

    draw() {
      if (this.editVer === false) {
        fill(this.color);
      } else {
        fill(this.color, 200);
      }
      noStroke();
      rect(this.x, this.y, blockSize, blockSize);
    }
  }

  class Lava {
    constructor(xCoor, yCoor) {
      this.x = xCoor*blockSize;
      this.y = yCoor*blockSize;
      this.color = color(random(200, 255), 10, 10);
    }

    draw() {
      fill(this.color);
      noStroke();
      rect(this.x, this.y, blockSize, blockSize);
    }
  }

  class Trampoline {
    constructor(xCoor, yCoor, editVer) {
      this.x = xCoor*blockSize;
      this.y = yCoor*blockSize;
      this.editVer = editVer || false;
    }

    draw() {
      if (this.editVer === false) {
        stroke(100, 100, 100);
      } else {
        stroke(100, 100, 100, 150);
      }
      strokeWeight(blockSize/20);
      line(this.x+blockSize*0.2, this.y+blockSize/2, this.x+blockSize*0.2, this.y+blockSize*0.95);
      line(this.x+blockSize*0.8, this.y+blockSize/2, this.x+blockSize*0.8, this.y+blockSize*0.95);
      if (this.editVer === false) {
        stroke(0, 0, 200);
      } else {
        stroke(0, 0, 200, 200);
      }
      strokeWeight(blockSize/10);
      line(this.x+blockSize/10, this.y+blockSize/2, this.x+blockSize-blockSize/10, this.y+blockSize/2);
    }
  }

  class Spider {
    constructor(xCoor, yCoor) {
      this.x = xCoor*blockSize;
      this.y = yCoor*blockSize;
      this.xMomentum = 0;
      this.yMomentum = 0;
      this.legSwing = 0;
      this.legSwingUpDown = "FORWARD";
    }

    draw() {
      this.x-=this.xMomentum;
      if (this.xMomentum !== 0) {
        if (this.legSwingUpDown === "FORWARD") {
          this.legSwing += 0.3;
          if (this.legSwing >= 2) {
            this.legSwingUpDown = "BACKWARD";
          }
        } else if (this.legSwingUpDown === "BACKWARD") {
          this.legSwing -= 0.3;
          if (this.legSwing <= -2) {
            this.legSwingUpDown = "FORWARD";
          }
        }
      }


      fill(0, 0, 0);
      noStroke();
      ellipse(this.x+blockSize*0.6, this.y+blockSize/2, blockSize*0.8, blockSize/3);
      ellipse(this.x+blockSize/4, this.y+blockSize*0.4, blockSize/3, blockSize/3);
      fill(255, 255, 255);
      ellipse(this.x+6, this.y+blockSize*0.37, 3, 3);
      stroke(0, 0, 0);
      strokeWeight(3);
      noFill();

      arc(this.x+18+this.legSwing, this.y+30, blockSize*0.7-this.legSwing, blockSize, radians(180), radians(270));
      // leg 2
      //line(this.x+blockSize*0.5, this.y+blockSize*0.6, this.x+blockSize*0.47-this.legSwing, this.y+blockSize-1);
      // leg 3
      //line(this.x+blockSize*0.7, this.y+blockSize*0.6, this.x+blockSize*0.73+this.legSwing, this.y+blockSize-1);
      // leg 4
      //line(this.x+blockSize*0.85, this.y+blockSize*0.6, this.x+blockSize*0.9-this.legSwing, this.y+blockSize-1);
    }
  }


/******  TESTING BLOCKS ADDED! NOT IN FINAL GAME!  ******/
{

  for (var i=0; i<2; i++) {
    if (i<2) {
      blocks.push(new Block(i, 19));
      coordinateTracker[i][19] = "block";
    }
  }



}
/******  END OF TESTING BLOCKS! BACK TO MAIN CODE  ******/


  var player = {
    x: blockSize*1.5,
    y: blockSize*19,
    initialX: blockSize*1.5,
    initialY: blockSize*19,
    xMomentum: 0,
    yMomentum: 0,
    speed: blockSize/15,
    alive: true,
    legSwing: blockSize/6,
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
      var drawX = this.x;
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
      } else if (coordinateTracker[blocksX][blocksY-1] === "lava") {
        this.alive = false;
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
      if (this.yMomentum >= 0 && coordinateTracker[blockX1][Math.floor((this.y + blockSize/10)/blockSize)] === "block" || this.yMomentum >= 0 && coordinateTracker[blockX2][Math.floor((this.y + blockSize/10)/blockSize)] === "block") {
        this.y = Math.floor((this.y + blockSize/10)/blockSize)*blockSize;
        this.yMomentum = 0;
        fall = false;
      } else if (this.yMomentum > 0 && coordinateTracker[blockX1][Math.floor((this.y - blockSize/3)/blockSize)] === "tramp" || this.yMomentum > 0 && coordinateTracker[blockX2][Math.floor((this.y - blockSize/3)/blockSize)] === "tramp") {
        this.yMomentum = -blockSize/3.5;
        player.legSwingUpDown = "DOWN";
      } else if (this.yMomentum >= 0 && coordinateTracker[blockX1][Math.floor((this.y)/blockSize)] === "lava" || this.yMomentum >= 0 && coordinateTracker[blockX2][Math.floor((this.y)/blockSize)] === "lava") {
        this.alive = false;
      }

      if (fall === true && this.yMomentum < 100) {
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
      if (coordinateTracker[blocksX][blocksY] !== "block" && coordinateTracker[blocksXMinus1][blocksY] === "block" && this.x <= (blocksXMinus1)*blockSize + blockSize*1.13 || coordinateTracker[blocksXMinus1][Math.floor((this.y-blockSize)/blockSize)] === "block" && this.x <= (blocksXMinus1)*blockSize + blockSize*1.13) {
        this.legSwing = 0;
        this.x = (blocksXMinus1)*blockSize + blockSize*1.13;
      } else if (coordinateTracker[blocksX][blocksY] !== "block" && coordinateTracker[blocksXPlus1][blocksY] === "block" && this.x >= (blocksXPlus1)*blockSize - blockSize*0.13 || coordinateTracker[blocksXPlus1][Math.floor((this.y-blockSize)/blockSize)] === "block" && this.x >= (blocksXPlus1)*blockSize - blockSize*0.13) {
        this.legSwing = 0;
        this.x = (blocksXPlus1)*blockSize - blockSize*0.13;
      } else if (coordinateTracker[blocksXMinus1][blocksY] === "lava" && this.x <= (blocksXMinus1)*blockSize + blockSize*1.13 || coordinateTracker[blocksXMinus1][Math.floor((this.y-blockSize)/blockSize)] === "lava" && this.x <= (blocksXMinus1)*blockSize + blockSize*1.13) {
        this.alive = false;
      } else if (coordinateTracker[blocksXPlus1][blocksY] === "lava" && this.x >= (blocksXPlus1)*blockSize - blockSize*0.13 || coordinateTracker[blocksXPlus1][Math.floor((this.y-blockSize)/blockSize)] === "lava" && this.x >= (blocksXPlus1)*blockSize - blockSize*0.13) {
        this.alive = false;
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
        this.yMomentum = 0;
      }
      if (this.alive !== true) {
        this.x = this.initialX;
        this.y = this.initialY;
        this.alive = true;
      }
    },
  };

  var flag = {
    x: blockSize*18.5,
    y: blockSize*18,
    initialX: blockSize*18.5,
    initialY: blockSize*18,
    draw: function() {
      fill(255, 10, 10);
      stroke(100, 100, 100);
      strokeWeight(2);
      line(this.x+blockSize/6, this.y+15, this.x+blockSize/6, this.y+blockSize*0.95);
      stroke(255, 10, 10);
      strokeWeight(2);
      triangle(this.x+blockSize/6, this.y+3, this.x+blockSize/6, this.y+blockSize/3+3, this.x-blockSize/2+blockSize/6, this.y+blockSize/6+3);
    },
    checkForWin: function() {
      let playerBlocksX = Math.floor(player.x/blockSize);
      let playerBlocksY = Math.floor(player.y/blockSize)-1;
      let blocksX = Math.floor(this.initialX/blockSize);
      let blocksY = Math.floor(this.initialY/blockSize);
      if (blocksX === playerBlocksX && playerBlocksY === blocksY) {
        player.x = player.initialX;
        player.y = player.initialY;
        player.xMomentum = 0;
        player.yMomentum = 0;
        gameStage = "EDIT";
        playButton.textContent = "play";
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

  var drawLava = function() {
    for (var i=0; i<lava.length; i++) {
      lava[i].draw();
    }
  };

  draw = function() {

    background(0, 204, 255);
    if (gameStage === "PLAY") {
      drawTrampolines();
      player.update();
      drawBlocks();
      flag.draw();
      flag.checkForWin();
    }
    else if (gameStage === "EDIT") {
      drawTrampolines();
      player.draw();
      drawBlocks();
      flag.draw();
      if (currEditDisplay !== undefined) {
        currEditDisplay.draw();
      }
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

  mousePressed = function() {
    if (gameStage === "EDIT") {
      if (currEdit !== "blank") {
        if (currEdit === "block"  && coordinateTracker[Math.floor(currEditDisplay.x/blockSize)][Math.floor(currEditDisplay.y/blockSize)] === "blank") {
          blocks.push(new Block(Math.floor(currEditDisplay.x/blockSize), Math.floor(currEditDisplay.y/blockSize)));
          coordinateTracker[Math.floor(currEditDisplay.x/blockSize)][Math.floor(currEditDisplay.y/blockSize)] = "block";
        } else if (currEdit === "tramp"  && coordinateTracker[Math.floor(currEditDisplay.x/blockSize)][Math.floor(currEditDisplay.y/blockSize)] === "blank") {
          trampolines.push(new Trampoline(Math.floor(currEditDisplay.x/blockSize), Math.floor(currEditDisplay.y/blockSize)));
          coordinateTracker[Math.floor(currEditDisplay.x/blockSize)][Math.floor(currEditDisplay.y/blockSize)] = "tramp";
        } else if (currEdit === "player") {
          let checkX = Math.floor(player.x/blockSize);
          let checkY = Math.floor(player.y/blockSize)-1;
          if (checkX < 0) {
            checkX = 0;
          } else if (checkX > 19) {
            checkX = 19;
          }
          if (coordinateTracker[checkX][checkY] === "blank") {
            currEdit = "block";
            player.initialX = player.x;
            player.initialY = player.y;
          }
        } else if (currEdit === "flag") {
          flag.initialX = flag.x;
          flag.initialY = flag.y;
          currEdit = "block";
        }
      } else if (currEdit === "blank") {
        if (coordinateTracker[currEditDisplay.blocksX][currEditDisplay.blocksY] === "block") {
          coordinateTracker[currEditDisplay.blocksX][currEditDisplay.blocksY] = "blank";
          for (var i=0; i<blocks.length; i++) {
            if (currEditDisplay.blocksX === Math.floor(blocks[i].x/blockSize) && currEditDisplay.blocksY === Math.floor(blocks[i].y/blockSize)) {
              blocks.splice(i, 1);
            }
          }
        } else if (coordinateTracker[currEditDisplay.blocksX][currEditDisplay.blocksY] === "tramp") {
          coordinateTracker[currEditDisplay.blocksX][currEditDisplay.blocksY] = "blank";
          for (var i=0; i<trampolines.length; i++) {
            if (currEditDisplay.blocksX === Math.floor(trampolines[i].x/blockSize) && currEditDisplay.blocksY === Math.floor(trampolines[i].y/blockSize)) {
              trampolines.splice(i, 1);
            }
          }
        }
      }
    }
  }

  document.body.addEventListener("mousemove", function(e) {
    var canvasZoom = 640/canvasWidth;
    var canvasX = Math.round((e.clientX-((window.innerWidth-canvasWidth)/2))*canvasZoom);
    var canvasY = Math.round(e.clientY*canvasZoom);

    if (gameStage === "EDIT") {
      if (currEdit !== "blank") {
        if (currEdit === "block") {
          currEditDisplay = new Block(Math.floor(canvasX/blockSize), Math.floor(canvasY/blockSize), true);
        } else if (currEdit === "tramp") {
          currEditDisplay = new Trampoline(Math.floor(canvasX/blockSize), Math.floor(canvasY/blockSize), true);
        } else if (currEdit === "player") {
          currEditDisplay = undefined;
          player.x = (Math.floor(canvasX/blockSize)*blockSize) + blockSize/2;
          player.y = (Math.floor(canvasY/blockSize)*blockSize) + blockSize;
        } else if (currEdit === "flag") {
          currEditDisplay = undefined;
          flag.x = (Math.floor(canvasX/blockSize)*blockSize) + blockSize/2;
          flag.y = (Math.floor(canvasY/blockSize))*blockSize;
        }
      } else if (currEdit === "blank") {
        currEditDisplay = {
          blocksX: Math.floor(canvasX/blockSize),
          blocksY: Math.floor(canvasY/blockSize),
          draw: function() {
            fill(200, 10, 10, 150);
            noStroke();
            rect(this.blocksX*blockSize, this.blocksY*blockSize, blockSize, blockSize);
          },
        };
      }
    }
  });

  document.body.addEventListener("unload", function(e) {
    document.body.style.zoom = "0%";
    console.log(window.innHeight);
  });

}};

// Get the canvas that Processing-js will use
var canvas = document.getElementById("mycanvas");
// Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
var processingInstance = new Processing(canvas, sketchProc);
