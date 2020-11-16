/**********
* initialize global variables
***********/
// references to html elements
let tdEls = document.getElementsByTagName("TD");
let inputEls = document.getElementsByTagName("INPUT");
let sudokuStatus = document.getElementById("sudoku-status");
let solveButton = document.getElementsByTagName("BUTTON")[0];

// the original puzzle
// zeros are blank boxes
const OGPuzzle = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
];

// a variable to hold the starting Date for the solver
let startDate;

// a variable to keep track of when the algorithm is running
// in order to assure that it does not get Interrupted by the user
let solving = false;

// a list of coordinates for each 3x3 box stored in a 2d array
let boxes = [
  [[], [], []],
  [[], [], []],
  [[], [], []]
];

// filling the boxes variable
for (let i=0; i<9; i++) {
  for (let j=0; j<9; j++) {
    boxes[Math.floor(i/3)][Math.floor(j/3)].push({x: j, y: i});
  }
}

// a function that loops through each table element and sets its innerHTML to the corsponding box
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

// check for contradictions in the puzzle
let checkForContradiction = (puzzle) => {
  let numbersCoor = [[], [], [], [], [], [], [], [], []];
  for (let i=0; i<puzzle.length; i++) {
    for (let j=0; j<puzzle[i].length; j++) {
      if (puzzle[i][j] !== 0) {
        numbersCoor[puzzle[i][j]-1].push({x: j, y: i});
      }
    }
  }

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

// a "simple" deductive algorithm that gets run throughout the main alg
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
              numbersCoor[num-1].push({x: j, y: i});

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
                        numbersCoor[puzzle[s][d]-1].push({x: d, y: s});
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

// the final phase
// this function loops itself with window.setTimeout until the puzzle is solved or proven unsolvable
let bruteForceAlg = (sudoku, p, cursor, blankBoxes) => {
  let loop = false;
  for (let i=0; i<sudoku.length; i++) {
    for (let j=0; j<sudoku[i].length; j++) {
      if (sudoku[i][j] === 0) {
        loop = true;
      }
    }
  }
  if (checkForContradiction(sudoku)) {
    loop = true;
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

  if (loop && solveButton.textContent === "Reset") {
    return {sudoku: sudoku, p: p, cursor: cursor, blankBoxes: blankBoxes, done: false};
  } else if (solving) {
    let endDate = new Date();
    sudokuStatus.textContent = "phase 3 solved successfully in " + (endDate - startDate) / 1000;
    return {sudoku: sudoku, p: p, cursor: cursor, blankBoxes: blankBoxes, done: true};
  }
};

let bruteForceAlgLooper = (sudoku, p, cursor, blankBoxes) => {
  if (solving) {
    let args = {sudoku: sudoku, p: p, cursor: cursor, blankBoxes: blankBoxes};
    for (let g=0; g<1000; g++) {
      if (solving) {
        args = bruteForceAlg(args.sudoku, args.p, args.cursor, args.blankBoxes);
        if (args.done) {
          break;
        }
      } else {
        break;
      }
    }
    if (solving) {
      setPuzzleNumbers(args.sudoku);
      if (!args.done) {
        window.setTimeout(function() {bruteForceAlgLooper(args.sudoku, args.p, args.cursor, args.blankBoxes);}, 0);
      } else {
        solving = false;
      }
    }
  }
};


/**********
* declare main alg
***********/

// this runs a three phase attempt to solve the puzzle
let solvePuzzle = () => {

  // set puzzle
  for (let i=0; i<inputEls.length; i++) {
    let text = inputEls[i].value;
    let y = Math.floor(i / 9);
    let x = i % 9;
    if (text === "" || isNaN(parseInt(text))) {
      OGPuzzle[y][x] = 0;
    } else {
      OGPuzzle[y][x] = parseInt(text);
    }
  }

  // check for contradictions before trying to solve
  sudokuStatus.textContent = "checking for contradictions...";
  if (!checkForContradiction(OGPuzzle)) {
    sudokuStatus.textContent = "running phase 1: deduction...";
    // set the start time
    startDate = new Date();
    // then call the deduction algorithm to see what can be solved easily
    let deductionResult = simpleDeductionAlg(OGPuzzle);

    // if the puzzle cannot be solved easily start phase 2
    let solvedPuzzle = false;
    if (!deductionResult.solved) {
      // phase 2 jumpstart
      sudokuStatus.textContent = "running phase 2: jumpstart...";
      let dR;
      for (let i=0; i<deductionResult.puzzle.length; i++) {
        for (let j=0; j<deductionResult.puzzle[i].length; j++) {
          if (deductionResult.puzzle[i][j] === 0) {
            deductionResult.p[i][j].possible.forEach(num => {
              let newPuzzle = JSON.parse(JSON.stringify(deductionResult.puzzle));
              newPuzzle[deductionResult.p[i][j].y][deductionResult.p[i][j].x] = num;

              dR = simpleDeductionAlg(newPuzzle);
              if (dR.solved === true) {
                solvedPuzzle = dR.puzzle;
              }
            });
            if (solvedPuzzle !== false) {
              break;
            }
          }
        }
        if (solvedPuzzle !== false) {
          let endDate = new Date();
          sudokuStatus.textContent = "phase 2 solved successfully in " + (endDate - startDate) / 1000;
          setPuzzleNumbers(solvedPuzzle);
          solving = false;
          break;
        }
      }

      // if it cannot be solved with phase 2 then start phase 3
      if (solvedPuzzle === false) {
        sudokuStatus.textContent = "phase 2 failed to complete puzzle";
        // initialize phase 3
        let blankBoxesArr = [];
        for (let i=0; i<deductionResult.puzzle.length; i++) {
          for (let j=0; j<deductionResult.puzzle[i].length; j++) {
            if (deductionResult.puzzle[i][j] === 0) {
              blankBoxesArr.push({
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

        blankBoxesArr.sort((a, b) => {
          return a.possible.length - b.possible.length;
        });

        sudokuStatus.textContent = "running phase 3: brute force...";

        // arguments: (puzzle, p, cursor, blankBoxes)
        bruteForceAlgLooper(deductionResult.puzzle, deductionResult.p, 0, blankBoxesArr);
      }
    } else {
      let endDate = new Date();
      sudokuStatus.textContent = "phase 1 solved successfully in " + (endDate - startDate) / 1000;
      setPuzzleNumbers(deductionResult.puzzle);
      solving = false;
    }
  } else {
    sudokuStatus.textContent = "puzzle contradicts itself";
    solving = false;
    solveButton.textContent = "Solve";
  }
};


solveButton.addEventListener("click", function() {
  if (this.textContent === "Solve" && !solving) {
    solving = true;
    this.textContent = "Reset";
    solvePuzzle();
  } else {
    solving = false;

    sudokuStatus.textContent = "enter a puzzle and click solve";
    for (let i=0; i<tdEls.length; i++) {
      tdEls[i].innerHTML = "<input type=\"text\" maxlength=\"1\">";
    }

    for (let i=0; i<inputEls.length; i++) {
      inputEls[i].addEventListener("input", function() {
        if (this.value !== "0" && this.value !== "1" && this.value !== "2" && this.value !== "3" && this.value !== "4" && this.value !== "5" && this.value !== "6" && this.value !== "7" && this.value !== "8" && this.value !== "9" && this.value !== "") {
          this.value = "";
          alert("You must input numeric values");
        }
      });
    }
    this.textContent = "Solve";
  }
});

for (let i=0; i<inputEls.length; i++) {
  inputEls[i].addEventListener("input", function() {
    if (this.value !== "0" && this.value !== "1" && this.value !== "2" && this.value !== "3" && this.value !== "4" && this.value !== "5" && this.value !== "6" && this.value !== "7" && this.value !== "8" && this.value !== "9" && this.value !== "") {
      this.value = "";
      alert("You must input numeric values");
    }
  });
}
