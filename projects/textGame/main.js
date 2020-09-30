/**********
* initialize global variables
***********/
if (localStorage.getItem("TG-highscore") === undefined || localStorage.getItem("TG-highscore") === null) {
  localStorage.setItem("TG-highscore", "0");
}
let score = 0;
const gameAreaEl = document.getElementById("game-area");

const blankGameScreen =
`#################################################
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#################################################
#################  SCORE: 0000  #################
###############  HIGHSCORE: 0000  ###############
#################################################`;

const startScreen =
`#################################################
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#             *PRESS ENTER TO PLAY*             #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                HIGHSCORE: 0000                #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#################################################`;

const loseScreen =
`#################################################
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#     *YOU LOST! PRESS ENTER TO PLAY AGAIN*     #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                  SCORE: 0000                  #
#                HIGHSCORE: 0000                #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#                                               #
#################################################`;

gameAreaEl.textContent = startScreen;
let gameState = "start";

let workingGameArea = startScreen.split("");

const getGameCoor = (x, y) => {
  if (x < 50 && x > -1 && y > -1 && y < 26) {
    return y * 50 + x + 1;
  } else {
    console.log("x or Y is too small/big for the screen in get Game Coor");
  }
}

const setGameArea = () => {
  let gameArea = ``;
  workingGameArea.forEach(index => {
    gameArea += index;
  });
  gameAreaEl.textContent = gameArea;
};

const setCoor = (x, y, mesg) => {
  workingGameArea[getGameCoor(x, y)] = mesg;
};

const setScore = (scoreToUse) => {
  scoreToUse = scoreToUse.toString();
  let highscore = localStorage.getItem("TG-highscore");
  if (gameState === "game") {
    for (let i=0; i<scoreToUse.length; i++) {
      workingGameArea[getGameCoor(28 - i, 24)] = scoreToUse[scoreToUse.length - i - 1];
    }
    for (let i=0; i<highscore.length; i++) {
      workingGameArea[getGameCoor(30 - i, 25)] = highscore[highscore.length - i - 1];
    }
  } else if (gameState === "start") {
    for (let i=0; i<highscore.length; i++) {
      workingGameArea[getGameCoor(30 - i, 18)] = highscore[highscore.length - i - 1];
    }
  } else if (gameState === "lose") {
    for (let i=0; i<scoreToUse.length; i++) {
      workingGameArea[getGameCoor(28 - i, 18)] = scoreToUse[scoreToUse.length - i - 1];
    }
    for (let i=0; i<highscore.length; i++) {
      workingGameArea[getGameCoor(30 - i, 19)] = highscore[highscore.length - i - 1];
    }
  }
};
setScore(0);
setGameArea();


class Spike {
  constructor(x, y, index) {
    this.x = x;
    this.y = y;
    this.loopWait = 5;
    this.loopCount = 0;
    this.index = index || 10;
  }

  update() {
    if (this.loopCount === this.loopWait) {
      if (this.y > 0) {
        setCoor(this.x, this.y, " ");
      }
      this.loopCount = 0;
      this.y++;
      if (this.y === 22) {
        setCoor(this.x, this.y, "_");
      } else if (this.y === 23) {
        this.y = 0;
      } else if (this.y > 0) {
        setCoor(this.x, this.y, "V");
      }
    } else {
      this.loopCount++;
    }
  }
}

class Coin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.loopWait = 10;
    this.loopCount = 0;
  }

  update() {
    if (this.loopCount === this.loopWait) {
      if (this.y > 0) {
        setCoor(this.x, this.y, " ");
      }
      this.loopCount = 0;
      this.y++;
      if (this.y === 23) {
        this.y = 0;
      } else if (this.y > 0) {
        setCoor(this.x, this.y, "©");
      }
    } else {
      this.loopCount++;
    }
  }
}

const player = {
  x: 25,
  y: 22,
  points: 0,
  setPoints() {

  },
  update() {
    setCoor(this.x, this.y, "U");
  }
};


let spikes = [];
spikes.push(new Spike(25, -5, 1));
let coins = [new Coin(15, Math.floor(Math.random() * -30)), new Coin(20, -1), new Coin(15, Math.floor(Math.random() * -30)), new Coin(20, Math.floor(Math.random() * -30)), new Coin(15, Math.floor(Math.random() * -30)), new Coin(20, Math.floor(Math.random() * -30)), new Coin(15, Math.floor(Math.random() * -30)), new Coin(20, Math.floor(Math.random() * -30))];

let mainLoop = () => {
  if (gameState === "game") {
    player.update();
    spikes.forEach(spike => {
      spike.update();
      if (spike.y === 0) {
        spike.x = Math.floor(Math.random() * 47);
        if (spike.index === 1 && spikes.length < 100 && spike.loopCount === spike.loopWait) {
          spikes.push(new Spike(25, Math.floor(Math.random() * -30)));
        }
      }
      if (spike.x === player.x && spike.y === player.y) {
        gameState = "lose";
        spikes = [];
        spikes.push(new Spike(25, -5, 1));
        coins = [new Coin(15, Math.floor(Math.random() * -30)), new Coin(20, -1), new Coin(15, Math.floor(Math.random() * -30)), new Coin(20, Math.floor(Math.random() * -30)), new Coin(15, Math.floor(Math.random() * -30)), new Coin(20, Math.floor(Math.random() * -30)), new Coin(15, Math.floor(Math.random() * -30)), new Coin(20, Math.floor(Math.random() * -30))];
        workingGameArea = loseScreen.split("");
        setScore(score);
        setGameArea();
        clearInterval(mainLoopHolder);
      }

      coins.forEach(coin => {
        if (coin.x === spike.x && spike.y === coin.y) {
          spike.y = 0;
        }
      });
    });
    coins.forEach(coin => {
      coin.update();
      if (coin.y === 0) {
        coin.x = Math.floor(Math.random() * 47);
      }
      if (coin.x === player.x && coin.y === player.y) {
        score++;
        if (parseInt(localStorage.getItem("TG-highscore")) < score) {
          localStorage.setItem("TG-highscore", `${score}`);
        }
        setScore(score);
        setCoor(coin.x, coin.y, "U");
        coin.y = -1;
      } else {

      }
    });
    if (gameState === "game") {
      setGameArea();
    }
  }
};


let mainLoopHolder;
document.addEventListener("keydown", (e) => {
  if (gameState === "game") {
    if (e.keyCode === 37) {
      if (player.x > 0) {
        setCoor(player.x, player.y, " ");
        player.x--;
      }
    } else if (e.keyCode === 39) {
      if (player.x < 46) {
        setCoor(player.x, player.y, " ");
        player.x++;
      }
    }
  } else {
    if (e.keyCode === 13) {
      gameState = "game";
      score = 0;
      workingGameArea = blankGameScreen.split("");
      setScore(0);
      setGameArea();
      mainLoopHolder = window.setInterval(mainLoop, 30);
    }
  }
});
