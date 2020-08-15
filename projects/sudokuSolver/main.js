/**********
* initialize global variables
***********/
let tdEls = document.getElementsByTagName("TD");
let inputEls = document.getElementsByTagName("INPUT");
let sudokuStatus = document.getElementById("sudoku-status");

const OGPuzzle = [
  [3, 0, 0,    0, 0, 0,    0, 1, 0],
  [1, 0, 5,    7, 9, 0,    0, 0, 3],
  [0, 0, 9,    0, 0, 1,    0, 0, 0],

  [0, 0, 0,    3, 0, 0,    0, 0, 5],
  [0, 7, 6,    0, 0, 0,    3, 9, 0],
  [4, 0, 0,    0, 0, 6,    0, 0, 0],

  [0, 0, 0,    5, 0, 0,    2, 0, 0],
  [5, 0, 0,    0, 1, 8,    6, 0, 9],
  [0, 4, 0,    0, 0, 0,    0, 0, 8],
];

let setPuzzleNumbers = (puzzle) => {
  for (let i=0; i<tdEls.length; i++) {
    let y = Math.floor(i / 9);
    let x = i % 9;
    if (puzzle[y][x] === 0) {
      tdEls[i].innerHTML = "";
    } else {
      tdEls[i].innerHTML = puzzle[y][x];
    }
  }
};

let blankBoxes = [];
let boxes = [
  [[], [], []],
  [[], [], []],
  [[], [], []]
];

for (let i=0; i<9; i++) {
  for (let j=0; j<9; j++) {
    boxes[Math.floor(i/3)][Math.floor(j/3)].push({x: j, y: i});
  }
}


let checkForContradiction = (puzzle) => {
  let numbersCoor = [[], [], [], [], [], [], [], [], []];
  for (let i=0; i<puzzle.length; i++) {
    for (let j=0; j<puzzle[i].length; j++) {
      if (puzzle[i][j] !== 0) {
        numbersCoor[puzzle[i][j]-1].push({x: j, y: i});
      }
    }
  }
  //console.log(puzzle);

  for (let i=0; i<puzzle.length; i++) {
    for (let j=0; j<puzzle[i].length; j++) {
      if (puzzle[i][j] !== 0) {
        let possible = numbersCoor[puzzle[i][j]-1].every(num => {
          if (num.x === j && num.y === i) {
            return true;
          } else {
            return num.x !== j && num.y !== i;
          }
        });

        if (possible) {
          possible = boxes[Math.floor(i/3)][Math.floor(j/3)].every(coor => {
            if (coor.x === j && coor.y === i) {
              return true;
            } else {
              return puzzle[coor.y][coor.x] !== puzzle[i][j];
            }
          });
        }

        if (possible === false) {
          return true;
        }
      }
    }
  }

  return false;
};

let simpleDeductionAlg = (puzzle) => {
  // create the 2d array filled with objects
  let numbersCoor;
  let p = [];
  for (let i=0; i<puzzle.length; i++) {
    p[i] = [];
    for (let j=0; j<puzzle[i].length; j++) {
      if (puzzle[i][j] === 0) {
        p[i][j] = {
          number: 0,
          possible: [],
          impossible: [],
          x: j,
          y: i
        };
      } else {
        let impossibleNums = [];
        for (let v=1; v<=9; v++) {
          if (v === puzzle[i][j]) {
            continue;
          } else {
            impossibleNums.push(v);
          }
        }

        p[i][j] = {
          number: puzzle[i][j],
          possible: [puzzle[i][j]],
          impossible: impossibleNums,
          x: j,
          y: i
        };
      }
    }
  }


  let solved = false;
  for (let z=0; z<81; z++) {
    let solvedCount = 0;
    let loop = false;
    // reset numbersCoor
    numbersCoor = [[], [], [], [], [], [], [], [], []];
    for (let i=0; i<puzzle.length; i++) {
      for (let j=0; j<puzzle[i].length; j++) {
        if (puzzle[i][j] !== 0) {
          numbersCoor[puzzle[i][j]-1].push({x: j, y: i});
        } else {
          loop = true;
        }
      }
    }

    // setting possible or impossible
    let solvedExtra = false;
    for (let t=0; t<81; t++) {
      solvedExtra = false;
      for (let i=0; i<puzzle.length; i++) {
        for (let j=0; j<puzzle[i].length; j++) {
          if (puzzle[i][j] === 0) {
            p[i][j].possible = [];
            p[i][j].impossible = [];
            for (let v=0; v<9; v++) {
              let possible = numbersCoor[v].every(num => {
                return num.x !== j && num.y !== i;
              });

              if (possible) {
                possible = boxes[Math.floor(i/3)][Math.floor(j/3)].every(coor => {
                  if (coor.x !== j || coor.y !== i) {
                    return p[coor.y][coor.x].number !== v+1;
                  } else {
                    return true;
                  }
                });
              }


              if (possible === false) {
                p[i][j].impossible.push(v+1);
              } else {
                p[i][j].possible.push(v+1);
              }
            }

            if (p[i][j].possible.length === 1 && !solvedExtra) {
              solvedCount++;
              p[i][j].number = p[i][j].possible[0];
              puzzle[i][j] = p[i][j].possible[0];
              numbersCoor[puzzle[i][j]-1].push({x: j, y: i});
              solvedExtra = true;
              //console.log("solved " + p[i][j].number + " possible/impossible step at " + p[i][j].x + ", " + p[i][j].y, t);
            }

            if (p[i][j].possible.length === 0) {
              return {puzzle: puzzle, solved: solved, p: p};
            }
          }
        }
      }

      if (solvedExtra === false) {
        break;
      }
    }


    // box solving
    for (let i=0; i<puzzle.length; i++) {
      for (let j=0; j<puzzle[i].length; j++) {
        if (puzzle[i][j] === 0) {
          p[i][j].possible.forEach(num => {
            // check if it is the only one possible in the box
            let isAlone = boxes[Math.floor(i/3)][Math.floor(j/3)].every(coor => {
              if (coor.x !== j || coor.y !== i) {
                return p[coor.y][coor.x].possible.every(poss => {
                  return poss !== num;
                });
              } else {
                return true;
              }
            });

            // check if it is the only one possible in the row
            if (!isAlone) {
              let row = [];
              let collumn = [];
              for (let q=0; q<9; q++) {
                row.push({x: q, y: i});
                collumn.push({x: j, y: q});
              }

              isAlone = row.every(coor => {
                if (coor.x !== j || coor.y !== i) {
                  return p[coor.y][coor.x].possible.every(poss => {
                    return poss !== num;
                  });
                } else {
                  return true;
                }
              });

              isAlone = collumn.every(coor => {
                if (coor.x !== j || coor.y !== i) {
                  return p[coor.y][coor.x].possible.every(poss => {
                    return poss !== num;
                  });
                } else {
                  return true;
                }
              });
            }

            if (isAlone) {
              solvedCount++;
              let impossibleNums = [];
              for (let v=1; v<=9; v++) {
                if (v === num) {
                  continue;
                } else {
                  impossibleNums.push(v);
                }
              }

              p[i][j] = {
                number: num,
                possible: [num],
                impossible: impossibleNums,
                x: j,
                y: i
              };
              puzzle[i][j] = num;
              numbersCoor[puzzle[i][j]-1].push({x: j, y: i});

              let solvedExtra = false;
              for (let t=0; t<81; t++) {
                solvedExtra = false;
                for (let s=0; s<puzzle.length; s++) {
                  for (let d=0; d<puzzle[s].length; d++) {
                    if (puzzle[s][d] === 0) {
                      p[s][d].possible = [];
                      p[s][d].impossible = [];
                      for (let v=0; v<9; v++) {
                        let possible = numbersCoor[v].every(num => {
                          return num.x !== d && num.y !== s;
                        });

                        if (possible) {
                          possible = boxes[Math.floor(s/3)][Math.floor(d/3)].every(coor => {
                            if (coor.x !== d || coor.y !== s) {
                              return p[coor.y][coor.x].number !== v+1;
                            } else {
                              return true;
                            }
                          });
                        }


                        if (possible === false) {
                          p[s][d].impossible.push(v+1);
                        } else {
                          p[s][d].possible.push(v+1);
                        }
                      }

                      if (p[s][d].possible.length === 1 && !solvedExtra) {
                        solvedCount++;
                        p[s][d].number = p[s][d].possible[0];
                        puzzle[s][d] = p[s][d].possible[0];
                        numbersCoor[puzzle[i][j]-1].push({x: d, y: s});
                        solvedExtra = true;
                        //console.log("solved " + p[s][d].number + " possible/impossible reset step at " + p[s][d].x + ", " + p[s][d].y, t);
                      }
                    }
                  }
                }

                if (solvedExtra === false) {
                  break;
                }
              }
              //console.log("solved " + p[i][j].number + " in solving step at " + p[i][j].x + ", " + p[i][j].y);
            }
          });
        }
      }
    }

    if (solvedCount === 0 && loop) {
      break;
    }

    if (!loop) {
      solved = true;
      break;
    }
  }
  return {puzzle: puzzle, solved: solved, p: p};
};

let bruteForceAlg = (sudoku, p, cursor) => {
  let loop = false;
  for (let i=0; i<sudoku.length; i++) {
    for (let j=0; j<sudoku[i].length; j++) {
      if (sudoku[i][j] === 0) {
        loop = true;
      }
    }
  }

  if (loop) {
    blankBoxes[cursor].currentState++;

    if (blankBoxes[cursor].currentState >= blankBoxes[cursor].possible.length) {
      blankBoxes[cursor].number = 0;
      sudoku[blankBoxes[cursor].y][blankBoxes[cursor].x] = blankBoxes[cursor].number;
      blankBoxes[cursor].currentState = -1;
      cursor--;
      if (cursor < 0) {
        loop = false;
        sudokuStatus.textContent = "puzzle has no solutions";
        solving = false;
      }
    } else {
      blankBoxes[cursor].number = blankBoxes[cursor].possible[blankBoxes[cursor].currentState];
      sudoku[blankBoxes[cursor].y][blankBoxes[cursor].x] = blankBoxes[cursor].number;

      if (!checkForContradiction(sudoku)) {
        cursor++;
        let attemptToSolve = simpleDeductionAlg(JSON.parse(JSON.stringify(sudoku)));
        if (attemptToSolve.solved) {
          loop = false;
          sudoku = attemptToSolve.puzzle;
        }
      }
    }
  }

  setPuzzleNumbers(sudoku);
  if (loop) {
    window.setTimeout(function() {bruteForceAlg(sudoku, p, cursor);}, 0);
  } else if (solving) {
    let endDate = new Date();
    sudokuStatus.textContent = "solved successfully in " + (endDate - startDate) / 1000;
    solving = false;
  }
};

/**********
* start main program
***********/
let startDate;
let solving = false;
let solvePuzzle = () => {
  // reset a variable
  blankBoxes = [];
  // set puzzle
  for (let i=0; i<inputEls.length; i++) {
    let text = inputEls[i].value;
    let y = Math.floor(i / 9);
    let x = i % 9;
    if (text === "") {
      OGPuzzle[y][x] = 0;
    } else {
      OGPuzzle[y][x] = parseInt(text);
    }
  }
  // start by logging to the console

  sudokuStatus.textContent = "checking for contradictions...";
  if (!checkForContradiction(OGPuzzle)) {
    sudokuStatus.textContent = "puzzle has no illegal numbers";

    sudokuStatus.textContent = "running phase 1: deduction...";
    // then call the deduction algorithm to see what can be solved easily
    startDate = new Date();
    let deductionResult = simpleDeductionAlg(OGPuzzle);

    // if it cannot be solved easily then start phase 2
    let phase2Puzzle;
    if (!deductionResult.solved) {
      sudokuStatus.textContent = "phase 1 failed to complete puzzle";
      // initialize phase 2
      let phase2Puzzle = deductionResult.puzzle;

      for (let i=0; i<deductionResult.puzzle.length; i++) {
        for (let j=0; j<deductionResult.puzzle[i].length; j++) {
          if (deductionResult.puzzle[i][j] === 0) {
            blankBoxes.push({
              number: deductionResult.p[i][j].number,
              possible: deductionResult.p[i][j].possible,
              impossible: deductionResult.p[i][j].impossible,
              x: deductionResult.p[i][j].x,
              y: deductionResult.p[i][j].y,
              currentState: -1,
            });
          }
        }
      }

      blankBoxes.sort((a, b) => {
        return a.possible.length - b.possible.length;
      });

      sudokuStatus.textContent = "running phase 2: brute force...";
      bruteForceAlg(deductionResult.puzzle, deductionResult.p, 0);
    } else {
      let endDate = new Date();
      sudokuStatus.textContent = "solved successfully in " + (endDate - startDate) / 1000;
      setPuzzleNumbers(deductionResult.puzzle);
      solving = false;
    }
  } else {
    sudokuStatus.textContent = "puzzle contradicts itself";
    solving = false;
    solveButton.textContent = "Solve";
  }
};

let solveButton = document.getElementsByTagName("BUTTON")[0];
solveButton.addEventListener("click", function() {
  if (!solving) {
    if (this.textContent === "Solve") {
      solving = true;
      this.textContent = "Reset";
      solvePuzzle();
    } else {
      this.textContent = "Solve";
      sudokuStatus.textContent = "enter a puzzle and click solve";
      for (let i=0; i<tdEls.length; i++) {
        tdEls[i].innerHTML = "<input type=\"text\" maxlength=\"1\">";
      }
    }
  } else {
    if (this.textContent === "Reset") {
      alert("Cannot reset while solver is in progress. \nTo reset while solving, reload the webpage.");
    }
  }
});
