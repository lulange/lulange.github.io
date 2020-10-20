const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let boxes = [];
let stack = [];
let mazeSolvingInterval;
let randomAmount = 10;
document.getElementById("percent-randomness-selector").value = 10;

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
  boxes[xAndYStart][xAndYStart] = 0;
  stack = [{x: xAndYStart, y: xAndYStart}];
};

// the algorithm that draws the maze
const drawMaze = () => {
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
  if (selectedVertex.x !== 0) {
    if (boxes[selectedVertex.y][selectedVertex.x - 1] === 1) {
      possibleExt.push({x: selectedVertex.x - 1, y: selectedVertex.y});
    }
  }
  // right
  if (selectedVertex.x !== boxes[0].length - 1) {
    if (boxes[selectedVertex.y][selectedVertex.x + 1] === 1) {
      possibleExt.push({x: selectedVertex.x + 1, y: selectedVertex.y});
    }
  }
  // down
  if (selectedVertex.y !== 0) {
    if (boxes[selectedVertex.y - 1][selectedVertex.x] === 1) {
      possibleExt.push({x: selectedVertex.x, y: selectedVertex.y - 1});
    }
  }
  // up
  if (selectedVertex.y !== boxes.length - 1) {
    if (boxes[selectedVertex.y + 1][selectedVertex.x] === 1) {
      possibleExt.push({x: selectedVertex.x, y: selectedVertex.y + 1});
    }
  }

  // check possible extensions
  if (possibleExt.length === 0) {
    stack.splice(selectedVertexIndex, 1);
  } else {
    let randomNum = Math.floor(Math.random() * possibleExt.length);
    boxes[possibleExt[randomNum].y][possibleExt[randomNum].x] = 0;
    stack.push(possibleExt[randomNum]);
    ctx.fillStyle = "white";

    // drawing part
    if (Math.abs(selectedVertex.x - possibleExt[randomNum].x) === 0) {
      if (selectedVertex.y > possibleExt[randomNum].y) {
        ctx.fillRect(selectedVertex.x * (600/boxes[0].length) + 2, possibleExt[randomNum].y * (600 / boxes.length) + 2, (canvas.width / boxes[0].length) - 2, (canvas.height / boxes.length) * 2 - 2);
      } else {
        ctx.fillRect(selectedVertex.x * (600/boxes[0].length) + 2, selectedVertex.y * (600 / boxes.length) + 2, (canvas.width / boxes[0].length) - 2, (canvas.height / boxes.length) * 2 - 2);
      }
    } else {
      if (selectedVertex.x > possibleExt[randomNum].x) {
        ctx.fillRect(possibleExt[randomNum].x * (600/boxes[0].length) + 2, selectedVertex.y * (600 / boxes.length) + 2, (canvas.width / boxes[0].length) * 2 - 2, (canvas.height / boxes.length) - 2);
      } else {
        ctx.fillRect(selectedVertex.x * (600/boxes[0].length) + 2, selectedVertex.y * (600 / boxes.length) + 2, (canvas.width / boxes[0].length) * 2 - 2, (canvas.height / boxes.length) - 2);
      }
    }
  }

  if (stack.length === 0) {
    window.clearInterval(mazeSolvingInterval);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 2, 2, (canvas.height / boxes.length) - 2);
    ctx.fillRect(canvas.width - 2, canvas.height - (canvas.height / boxes.length), 2, (canvas.height / boxes.length) - 2);
  }
};

// button event listener that starts generation
document.getElementById("button").addEventListener("click", () => {
  let selector = document.getElementById("size-selector");
  setBackground(0, 0, 0);
  setMaze(selector.value);
  window.clearInterval(mazeSolvingInterval);
  let quickGenerate = document.getElementById("quick-generate").checked;
  if (quickGenerate) {
    while (stack.length > 0) {
      drawMaze();
    }
  } else {
    mazeSolvingInterval = window.setInterval(function () {
      drawMaze();
    }, 0);
  }
});

// button event listener that starts generation
document.getElementById("percent-randomness-selector").addEventListener("input", function() {
  randomAmount = this.value;
  document.getElementById("percent-notifier").textContent = this.value + "%";
});
