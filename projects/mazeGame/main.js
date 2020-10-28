const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let boxes = [];
let stack = [];
let mazeSolvingInterval;
let randomAmount = 10;
let player = {
  x: 3,
  y: 3,
  draw(x, y) {
    ctx.fillStyle = "blue";
    let boxWidth = canvas.width/boxes.length;
    ctx.beginPath();
    ctx.arc(x * boxWidth + Math.round(boxWidth/2), y * boxWidth + Math.round(boxWidth/2), Math.floor(boxWidth/2) - Math.floor(boxWidth/10), 0, 2*Math.PI);
    ctx.fill();
  }
};
const gameState = {
  selectedMode: "normalMode",
  selectedSize: 11,
  stepsTaken: 0,
  switches: [{x: 1, y: 3, switched: false}],
  switchesSwitched: 0,
};

const setBackground = (r, g, b) => {
  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};
setBackground(0, 0, 0);

// sets the maze generation variables
const setMaze = (width) => {
  boxes = [];
  for (let i=0; i<width; i++) {
    boxes.push([]);
    for (let j=0; j<width; j++) {
      boxes[i].push(1);
    }
  }
  let xAndYStart = Math.floor(width/2);
  if (xAndYStart % 2 !== 1) {
    xAndYStart++;
  }
  boxes[xAndYStart][xAndYStart] = 0;
  stack = [{x: xAndYStart, y: xAndYStart}];
};

// the algorithm that draws the maze
const createMaze = () => {
  while (stack.length > 0) {
    let randomSelector = Math.random();
    let selectedVertexIndex;
    if (randomSelector > randomAmount/100) {
      selectedVertexIndex = stack.length - 1;
    } else {
      selectedVertexIndex = Math.floor(Math.random() * stack.length);
    }
    let selectedVertex = stack[selectedVertexIndex];

    let possibleExt = [];
    // left
    if (selectedVertex.x !== 1) {
      if (boxes[selectedVertex.y][selectedVertex.x - 2] === 1) {
        possibleExt.push({x: selectedVertex.x - 2, y: selectedVertex.y});
      }
    }
    // right
    if (selectedVertex.x !== boxes[0].length - 2) {
      if (boxes[selectedVertex.y][selectedVertex.x + 2] === 1) {
        possibleExt.push({x: selectedVertex.x + 2, y: selectedVertex.y});
      }
    }
    // down
    if (selectedVertex.y !== 1) {
      if (boxes[selectedVertex.y - 2][selectedVertex.x] === 1) {
        possibleExt.push({x: selectedVertex.x, y: selectedVertex.y - 2});
      }
    }
    // up
    if (selectedVertex.y !== boxes.length - 2) {
      if (boxes[selectedVertex.y + 2][selectedVertex.x] === 1) {
        possibleExt.push({x: selectedVertex.x, y: selectedVertex.y + 2});
      }
    }

    // check possible extensions
    if (possibleExt.length === 0) {
      stack.splice(selectedVertexIndex, 1);
    } else {
      let randomNum = Math.floor(Math.random() * possibleExt.length);
      boxes[possibleExt[randomNum].y][possibleExt[randomNum].x] = 0;
      // below
      if (possibleExt[randomNum].y > selectedVertex.y) {
        boxes[possibleExt[randomNum].y-1][possibleExt[randomNum].x] = 0;
      // above
      } else if (possibleExt[randomNum].y < selectedVertex.y) {
        boxes[possibleExt[randomNum].y+1][possibleExt[randomNum].x] = 0;
      // left
      } else if (possibleExt[randomNum].x > selectedVertex.x) {
        boxes[possibleExt[randomNum].y][possibleExt[randomNum].x-1] = 0;
      // right
      } else if (possibleExt[randomNum].x < selectedVertex.x) {
        boxes[possibleExt[randomNum].y][possibleExt[randomNum].x+1] = 0;
      }
      stack.push(possibleExt[randomNum]);
    }
  }
};

// a function that draw the boxes variable on to the canvas
const drawBoxes = () => {
  setBackground(0, 0, 0);
  ctx.fillStyle = "white";
  let boxWidth = canvas.width/boxes.length;
  for (let i=0; i<boxes.length; i++) {
    for (let j=0; j<boxes.length; j++) {
      if (boxes[i][j] === 0) {
        ctx.fillRect((j*boxWidth), i*boxWidth, boxWidth, boxWidth);
      } else if (boxes[i][j] === 10) {
        if (gameState.switchesSwitched === gameState.switches.length) {
          ctx.fillStyle = "green";
        } else {
          ctx.fillStyle = "red";
        }
        ctx.fillRect((j*boxWidth), i*boxWidth, boxWidth, boxWidth);
        ctx.fillStyle = "white";
      }
    }
  }

  gameState.switches.forEach(sw => {
    if (sw.switched) {
      ctx.fillStyle = "green";
    } else {
      ctx.fillStyle = "red";
    }
    let boxWidth = canvas.width/boxes.length;
    ctx.beginPath();
    ctx.arc(sw.x * boxWidth + Math.round(boxWidth/2), sw.y * boxWidth + Math.round(boxWidth/2) - 1, Math.floor(boxWidth/2) - 1, 0, 2*Math.PI);
    ctx.fill();
  });
};

// calls several functions to generate a maze
let solutionCoor = 0;
const generateMaze = (size) => {
  setMaze(size);
  createMaze();
  solutionCoor = Math.floor(boxes.length/2);
  if (solutionCoor % 2 === 0) {
    solutionCoor++;
  }
  boxes[solutionCoor][solutionCoor] = 10;
  gameState.switchesSwitched = 0;
  gameState.switches = [];
  for (let i=0; i<Math.round(boxes.length/5); i++) {
    let x = Math.floor(Math.random() * (boxes.length-1) + 1);
    if (x % 2 === 0) {
      if (x === boxes.length - 1) {
        x--;
      } else {
        x++;
      }
    }
    let y = Math.floor(Math.random() * (boxes.length-1) + 1);
    if (y % 2 === 0) {
      if (y === boxes.length - 1) {
        y--;
      } else {
        y++;
      }
    }
    let addSwitch = true;
    if (x === solutionCoor && y === solutionCoor) {
      addSwitch = false;
    }
    gameState.switches.forEach(sw => {
      if (x === sw.x && y === sw.y) {
        addSwitch = false;
      }
    });
    if (addSwitch) {
      gameState.switches.push({x: x, y: y, switched: false});
    }
  }
};

const drawUserView = (x, y) => {
  let spacesDrawn = [];
  spacesDrawn.push({x: x, y: y});
  ctx.fillStyle = "white";
  let boxWidth = canvas.width/boxes.length;
  if (boxes[y][x] === 10) {
    if (gameState.switchesSwitched === gameState.switches.length) {
      ctx.fillStyle = "green";
    } else {
      ctx.fillStyle = "red";
    }
    ctx.fillRect(x*boxWidth, y*boxWidth, boxWidth, boxWidth);
    ctx.fillStyle = "white";
  } else {
    ctx.fillRect(x*boxWidth, y*boxWidth, boxWidth, boxWidth);
  }
  let loop = true;
  let cursor = 1;
  let lookLeft = true;
  let lookRight = true;
  let lookAbove = true;
  let lookBelow = true;
  while (loop) {
    let boxesDrawn = 0;
    // above
    if (y-cursor > 0 && lookAbove) {
      if (boxes[y-cursor][x] !== 1) {
        if (boxes[y-cursor][x] === 10) {
          if (gameState.switchesSwitched === gameState.switches.length) {
            ctx.fillStyle = "green";
          } else {
            ctx.fillStyle = "red";
          }
          ctx.fillRect(x*boxWidth, (y-cursor)*boxWidth, boxWidth, boxWidth);
          ctx.fillStyle = "white";
        } else {
          ctx.fillRect(x*boxWidth, (y-cursor)*boxWidth, boxWidth, boxWidth);
        }
        spacesDrawn.push({x: x, y: y-cursor});
        boxesDrawn++;
      } else {
        lookAbove = false;
      }
    }
    // below
    if (y+cursor < boxes.length-1 && lookBelow) {
      if (boxes[y+cursor][x] !== 1) {
        if (boxes[y+cursor][x] === 10) {
          if (gameState.switchesSwitched === gameState.switches.length) {
            ctx.fillStyle = "green";
          } else {
            ctx.fillStyle = "red";
          }
          ctx.fillRect(x*boxWidth, (y+cursor)*boxWidth, boxWidth, boxWidth);
          ctx.fillStyle = "white";
        } else {
          ctx.fillRect(x*boxWidth, (y+cursor)*boxWidth, boxWidth, boxWidth);
        }
        spacesDrawn.push({x: x, y: y+cursor});
        boxesDrawn++;
      } else {
        lookBelow = false;
      }
    }
    // left
    if (x-cursor > 0 && lookLeft) {
      if (boxes[y][x-cursor] !== 1) {
        if (boxes[y][x-cursor] === 10) {
          if (gameState.switchesSwitched === gameState.switches.length) {
            ctx.fillStyle = "green";
          } else {
            ctx.fillStyle = "red";
          }
          ctx.fillRect((x-cursor)*boxWidth, y*boxWidth, boxWidth, boxWidth);
          ctx.fillStyle = "white";
        } else {
          ctx.fillRect((x-cursor)*boxWidth, y*boxWidth, boxWidth, boxWidth);
        }
        spacesDrawn.push({x: x-cursor, y: y});
        boxesDrawn++;
      } else {
        lookLeft = false;
      }
    }
    // right
    if (x+cursor < boxes.length-1 && lookRight) {
      if (boxes[y][x+cursor] !== 1) {
        if (boxes[y][x+cursor] === 10) {
          if (gameState.switchesSwitched === gameState.switches.length) {
            ctx.fillStyle = "green";
          } else {
            ctx.fillStyle = "red";
          }
          ctx.fillRect((x+cursor)*boxWidth, y*boxWidth, boxWidth, boxWidth);
          ctx.fillStyle = "white";
        } else {
          ctx.fillRect((x+cursor)*boxWidth, y*boxWidth, boxWidth, boxWidth);
        }
        spacesDrawn.push({x: x+cursor, y: y});
        boxesDrawn++;
      } else {
        lookRight = false;
      }
    }

    if (boxesDrawn === 0) {
      loop = false;
    } else {
      cursor++;
    }
  }

  gameState.switches.forEach(sw => {
    let coor = {x: null, y: null};
    spacesDrawn.forEach(space => {
      if (space.x === sw.x && space.y === sw.y) {
        coor.x = sw.x;
        coor.y = sw.y;
      }
    });
    if (coor.x !== null) {
      if (sw.switched) {
        ctx.fillStyle = "green";
      } else {
        ctx.fillStyle = "red";
      }
      ctx.beginPath();
      ctx.arc(sw.x * boxWidth + Math.round(boxWidth/2), sw.y * boxWidth + Math.round(boxWidth/2) - 1, Math.floor(boxWidth/2) - 1, 0, 2*Math.PI);
      ctx.fill();
    }
  });
  player.draw(x, y);
};



class SceneManager {
  constructor() {
    this.sceneInterval = null;
    this.currScene;
    this.sceneList = [];
    this.sceneData;
  }

  runScene(key) {
    if (this.sceneList.length === 0) {
      console.log("not a real scene name");
    } else {
      if (this.sceneInterval !== null) {
        window.clearInterval(this.sceneInterval);
        this.sceneInterval = null;
      }
      this.sceneList.forEach(item => {
        if (item.key === key) {
          this.currScene = item.key;
          item.setUp();
          this.sceneInterval = window.setInterval(item.scene, 30);
          return;
        }
      });
    }
  }

  addScene(key, scene, sceneSetUp) {
    this.sceneList.push({key: key, scene: scene, setUp: sceneSetUp});
  }
}

const sM = new SceneManager();
sM.addScene("mainMenu", function() {
}, function() {
  setBackground(0, 0, 0);
  ctx.font = '50px sans-serif';
  ctx.fillStyle = "white";
  ctx.fillText("MAZES", 50, 100);
  ctx.fillText("Press E", 100, 200);
  ctx.font = '20px sans-serif';
  ctx.fillText("By Lucas", canvas.width - 100, canvas.height - 20);
});

sM.addScene("modeMenu", function() {
}, function() {
  setBackground(0, 0, 0);
  ctx.font = '30px sans-serif';
  ctx.fillStyle = "white";
  ctx.fillText("Press Q to go back", 10, 30);
  ctx.fillText("To play normal mode press A", 50, 250);
  ctx.fillText("To play explorer mode press S", 70, 300);
  ctx.fillText("To play dark mode press D", 90, 350);
});

sM.addScene("sizeMenu", function() {
}, function() {
  setBackground(0, 0, 0);
  ctx.font = '30px sans-serif';
  ctx.fillStyle = "white";
  ctx.fillText("Press Q to go back", 10, 30);
  ctx.fillText("For 11x11 press A", 50, 250);
  ctx.fillText("For 25x25 press S", 70, 300);
  ctx.fillText("For 55x55 press D", 90, 350);
});

sM.addScene("darkMode", function() {
  setBackground(0, 0, 0);
  drawUserView(player.x, player.y);
  ctx.font = '20px sans-serif';
  ctx.fillStyle = "white";
  ctx.fillText("Press Q to quit", 20, canvas.height - 20);
  ctx.fillText(gameState.switchesSwitched + "/" + gameState.switches.length + " switched", canvas.width - 150, canvas.height - 20);
}, function() {
});

sM.addScene("explorerMode", function() {
  drawUserView(player.x, player.y);
  ctx.fillStyle = "black";
  ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
  ctx.font = '20px sans-serif';
  ctx.fillStyle = "white";
  ctx.fillText("Press Q to quit", 20, canvas.height - 20);
  ctx.fillText(gameState.switchesSwitched + "/" + gameState.switches.length + " switched", canvas.width - 150, canvas.height - 20);
}, function() {
  setBackground(0, 0, 0);
});

sM.addScene("normalMode", function() {
  setBackground(0, 0, 0);
  drawBoxes();
  player.draw(player.x, player.y);
  ctx.font = '20px sans-serif';
  ctx.fillStyle = "white";
  ctx.fillText("Press Q to quit", 20, canvas.height - 20);
  ctx.fillText(gameState.switchesSwitched + "/" + gameState.switches.length + " switched", canvas.width - 150, canvas.height - 20);
}, function() {
  generateMaze(gameState.selectedSize);
  gameState.stepsTaken = 0;
  player.x = 1;
  player.y = 1;
});

sM.addScene("lookOnlyScene", function() {
  setBackground(0, 0, 0);
  drawBoxes();
  player.draw(player.x, player.y);
  ctx.font = '20px sans-serif';
  ctx.fillStyle = "white";
  ctx.fillText("Look closely for 3 seconds", 20, canvas.height - 20);
}, function() {
  generateMaze(gameState.selectedSize);
  gameState.stepsTaken = 0;
  player.x = 1;
  player.y = 1;
  window.setTimeout(function() {
    if (gameState.selectedMode === "explorerMode") {
      sM.runScene("explorerMode");
    } else {
      sM.runScene("darkMode");
    }
  }, 3000);
});

sM.addScene("winScene", function() {
}, function() {
  window.setTimeout(function() {
    boxes = [];
    setBackground(0, 0, 0);
    ctx.font = '30px sans-serif';
    ctx.fillStyle = "white";
    ctx.fillText("Maze completed in " + gameState.stepsTaken + " steps", 70, 250);
    ctx.fillText("Press E", 90, 300);
  }, 1000);
});

sM.runScene("mainMenu");

document.onkeydown = (e) => {
  let direction = {x: 0, y: 0};
  switch (e.keyCode) {
    case 81:
      if (sM.currScene === "modeMenu") {
        sM.runScene("mainMenu");
      } else if (sM.currScene === "sizeMenu") {
        sM.runScene("modeMenu");
      } else if (sM.currScene === "normalMode" || sM.currScene === "explorerMode" || sM.currScene === "darkMode") {
        boxes = [];
        sM.runScene("mainMenu");
      }
      break;
    case 65:
      if (sM.currScene === "modeMenu") {
        gameState.selectedMode = "normalMode";
        sM.runScene("sizeMenu");
      } else if (sM.currScene === "sizeMenu") {
        gameState.selectedSize = 11;
        if (gameState.selectedMode !== "normalMode") {
          sM.runScene("lookOnlyScene");
        } else {
          sM.runScene("normalMode");
        }
      } else if (sM.currScene !== "lookOnlyScene") {
        direction.x = -1;
      }
      break;
    case 87:
      if (sM.currScene !== "lookOnlyScene") {
        direction.y = -1;
      }
      break;
    case 68:
      if (sM.currScene === "modeMenu") {
        gameState.selectedMode = "darkMode";
        sM.runScene("sizeMenu");
      } else if (sM.currScene === "sizeMenu") {
        gameState.selectedSize = 55;
        if (gameState.selectedMode !== "normalMode") {
          sM.runScene("lookOnlyScene");
        } else {
          sM.runScene("normalMode");
        }
      } else if (sM.currScene !== "lookOnlyScene") {
        direction.x = 1;
      }
      break;
    case 83:
      if (sM.currScene === "modeMenu") {
        gameState.selectedMode = "explorerMode";
        sM.runScene("sizeMenu");
      } else if (sM.currScene === "sizeMenu") {
        gameState.selectedSize = 25;
        if (gameState.selectedMode !== "normalMode") {
          sM.runScene("lookOnlyScene");
        } else {
          sM.runScene("normalMode");
        }
      } else if (sM.currScene !== "lookOnlyScene") {
        direction.y = 1;
      }
      break;
    case 69:
      if (sM.currScene === "mainMenu") {
        sM.runScene("modeMenu");
      } else if (sM.currScene === "winScene") {
        sM.runScene("mainMenu");
      }
  }

  if (boxes.length > 0) {
    if (boxes[player.y+direction.y][player.x+direction.x] === 0) {
      player.x += direction.x;
      player.y += direction.y;
      gameState.stepsTaken++;
      gameState.switches.forEach(sw => {
        if (player.x === sw.x && player.y === sw.y && sw.switched === false) {
          sw.switched = true;
          gameState.switchesSwitched++;
          if (gameState.switchesSwitched === gameState.switches.length) {
            ctx.fillStyle = "green";
            let boxWidth = canvas.width/boxes.length;
            ctx.fillRect(solutionCoor*boxWidth, solutionCoor*boxWidth, boxWidth, boxWidth);
          }
        }
      });
    } else if (boxes[player.y+direction.y][player.x+direction.x] === 10) {
      player.x += direction.x;
      player.y += direction.y;
      gameState.stepsTaken++;
      if (gameState.switchesSwitched === gameState.switches.length) {
        setBackground();
        drawBoxes();
        player.draw(player.x, player.y);
        sM.runScene("winScene");
      }
    }
  }
};
