class Maze {
  constructor(ctx, width, height, randomness) {
    this._ctx = ctx;
    this._width = width || 10;
    this._height = height || this._width;
    this._randomness = randomness || 10;
    this._maze = [];
    let stack = [];
    for (let i=0; i<this._height*2 + 1; i++) {
      this._maze.push([]);
      for (let j=0; j<this._width*2 + 1; j++) {
        this._maze[i].push(1);
      }
    }
    let xAndYStart = Math.floor(this._width/2);
    if (xAndYStart % 2 !== 1) {
      xAndYStart++;
    }
    this._maze[xAndYStart][xAndYStart] = 0;
    stack = [{x: xAndYStart, y: xAndYStart}];



    while (stack.length > 0) {
      let randomSelector = Math.random();
      let selectedVertexIndex;
      if (randomSelector > this._randomness/100) {
        selectedVertexIndex = stack.length - 1;
      } else {
        selectedVertexIndex = Math.floor(Math.random() * stack.length);
      }
      let selectedVertex = stack[selectedVertexIndex];

      let possibleExt = [];
      // left
      if (selectedVertex.x !== 1) {
        if (this._maze[selectedVertex.y][selectedVertex.x - 2] === 1) {
          possibleExt.push({x: selectedVertex.x - 2, y: selectedVertex.y});
        }
      }
      // right
      if (selectedVertex.x !== this._maze[0].length - 2) {
        if (this._maze[selectedVertex.y][selectedVertex.x + 2] === 1) {
          possibleExt.push({x: selectedVertex.x + 2, y: selectedVertex.y});
        }
      }
      // down
      if (selectedVertex.y !== 1) {
        if (this._maze[selectedVertex.y - 2][selectedVertex.x] === 1) {
          possibleExt.push({x: selectedVertex.x, y: selectedVertex.y - 2});
        }
      }
      // up
      if (selectedVertex.y !== this._maze.length - 2) {
        if (this._maze[selectedVertex.y + 2][selectedVertex.x] === 1) {
          possibleExt.push({x: selectedVertex.x, y: selectedVertex.y + 2});
        }
      }

      // check possible extensions
      if (possibleExt.length === 0) {
        stack.splice(selectedVertexIndex, 1);
      } else {
        let randomNum = Math.floor(Math.random() * possibleExt.length);
        this._maze[possibleExt[randomNum].y][possibleExt[randomNum].x] = 0;
        // below
        if (possibleExt[randomNum].y > selectedVertex.y) {
          this._maze[possibleExt[randomNum].y-1][possibleExt[randomNum].x] = 0;
        // above
        } else if (possibleExt[randomNum].y < selectedVertex.y) {
          this._maze[possibleExt[randomNum].y+1][possibleExt[randomNum].x] = 0;
        // left
        } else if (possibleExt[randomNum].x > selectedVertex.x) {
          this._maze[possibleExt[randomNum].y][possibleExt[randomNum].x-1] = 0;
        // right
        } else if (possibleExt[randomNum].x < selectedVertex.x) {
          this._maze[possibleExt[randomNum].y][possibleExt[randomNum].x+1] = 0;
        }
        stack.push(possibleExt[randomNum]);
      }
    }
  }

  display(x, y, boxWidth, wallWidth, wallColor, passageColor) {
    if (passageColor === undefined || passageColor === null) {
      passageColor = "white";
    }
    if (wallColor === undefined || wallColor === null) {
      wallColor = "black";
    }
    this._ctx.fillStyle = wallColor;
    let totalHeight = Math.round(this._maze.length/2) * wallWidth + Math.floor(this._maze.length/2) * boxWidth;
    let totalWidth = Math.round(this._maze[0].length/2) * wallWidth + Math.floor(this._maze[0].length/2) * boxWidth;
    this._ctx.fillRect(x, y, totalWidth, totalHeight);
    this._ctx.fillStyle = passageColor;
    for (let i=0; i<this._maze.length; i++) {
      for (let j=0; j<this._maze[0].length; j++) {
        if (this._maze[i][j] === 0) {
          let horizontalWall = i % 2 === 0 ? true : false;
          let verticalWall = j % 2 === 0 ? true : false;

          if (!verticalWall && !horizontalWall) {
            let pixelX = x + (j+1)/2 * wallWidth + (j-1)/2 * boxWidth;
            let pixelY = y + (i+1)/2 * wallWidth + (i-1)/2 * boxWidth;
            this._ctx.fillRect(pixelX, pixelY, boxWidth, boxWidth);
          } else if (verticalWall) {
            let pixelX = x + (j/2) * wallWidth + (j/2) * boxWidth;
            let pixelY = y + (i+1)/2 * wallWidth + (i-1)/2 * boxWidth;
            this._ctx.fillRect(pixelX, pixelY, wallWidth, boxWidth);
          } else {
            let pixelX = x + (j+1)/2 * wallWidth + (j-1)/2 * boxWidth;
            let pixelY = y + (i/2) * wallWidth + (i/2) * boxWidth;
            this._ctx.fillRect(pixelX, pixelY, boxWidth, wallWidth);
          }
        }
      }
    }
  }

  getWidth(boxWidth, wallWidth) {
    return Math.round(this._maze[0].length/2) * wallWidth + Math.floor(this._maze[0].length/2) * boxWidth;
  }

  getHeight(boxWidth, wallWidth) {
    return Math.round(this._maze.length/2) * wallWidth + Math.floor(this._maze.length/2) * boxWidth;
  }

  getPixelCoor(startX, startY, boxWidth, wallWidth, x, y) {
    return {x: startX + (x+1)/2 * wallWidth + (x-1)/2 * boxWidth, y: startY + (y+1)/2 * wallWidth + (y-1)/2 * boxWidth};
  }

  get ctx() {
    return this._ctx;
  }

  get randomness() {
    return this._randomness;
  }

  get end() {
    return this._end;
  }

  get start() {
    return this._start;
  }

  get maze() {
    return this._maze;
  }

  get height() {
    return this._height;
  }

  get width() {
    return this._width;
  }
}
