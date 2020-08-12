export default class PauseScene extends Phaser.Scene {
  constructor() {
    super({key: "PauseScene"});
  }
  
  init(data) {
    this.myLevel = data.myLevel;
    this.editScene = data.editScene;
    this.levelNum = data.levelNum;
  }
  
  preload() {
  }
  
  create() {
    this.blackRect = this.add.rectangle(450, 300, 900, 600, "0x000000", 0).setDepth(10);
    
    // create main text/buttons
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
      this.scene.scene.stop();
      if (this.scene.editScene) {
        this.scene.scene.resume("EditScene");
      } else {
        this.scene.scene.resume("GameScene");
      }
    });


    let pauseBackground = this.add.rectangle(800, 320, 400, 560, "0x000000", 0.7);

    // console.log((400 - (MenuButton.getTopRight().x- MenuButton.getTopLeft().x)) / 2 );
    
    // create restart button
    if (!this.editScene) {
      let restartButton = this.add.text(675, 140, "Restart", {
        fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
        fontSize: "30px",
      });
      restartButton.x = 600 + (300 - restartButton.width) / 2;

      // and set it interactive
      restartButton.setInteractive();
      restartButton.on("pointerover", function() {
        this.setFontSize(32);
        this.x -= 3;
        this.y -= 1;
      });

      restartButton.on("pointerout", function() {
        this.setFontSize(30);
        this.x += 3;
        this.y += 1;
      });

      restartButton.on("pointerup", function() {
        this.scene.tweens.add({
          targets: this.scene.blackRect,
          x: this.scene.blackRect.x,
          ease: 'Linear',
          duration: 10,
          repeat: 22,
          yoyo: false,
          onRepeat: () => {
            if (this.scene.blackRect.fillAlpha < 1) {
              this.scene.blackRect.fillAlpha += 0.05;
            }
            if (this.scene.blackRect.fillAlpha > 1) {
              this.scene.blackRect.fillAlpha = 1;
            }
          },
          onComplete: () => {
            this.scene.scene.stop();
            if (this.scene.editScene === true) {
              this.scene.scene.stop("EditScene");
            } else {
              this.scene.scene.stop("GameScene");
            }
            this.scene.scene.start("GameScene");
          },
        });
      });
    }
    

    let MenuButton = this.add.text(675, 260, "Main Menu", {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "30px",
    });

    // and set it interactive
    MenuButton.setInteractive();
    MenuButton.on("pointerover", function() {
      this.setFontSize(32);
      this.x -= 3;
      this.y -= 1;
    });

    MenuButton.on("pointerout", function() {
      this.setFontSize(30);
      this.x += 3;
      this.y += 1;
    });

    MenuButton.on("pointerup", function() {
      this.scene.tweens.add({
        targets: this.scene.blackRect,
        x: this.scene.blackRect.x,
        ease: 'Linear',
        duration: 10,
        repeat: 22,
        yoyo: false,
        onRepeat: () => {
          if (this.scene.blackRect.fillAlpha < 1) {
            this.scene.blackRect.fillAlpha += 0.05;
          }
          if (this.scene.blackRect.fillAlpha > 1) {
            this.scene.blackRect.fillAlpha = 1;
          }
        },
        onComplete: () => {
          this.scene.scene.stop();
          if (this.scene.editScene === true) {
            this.scene.scene.stop("EditScene");
          } else {
            this.scene.scene.stop("GameScene");
          }
          this.scene.scene.start("MainMenuScene");
        },
      });
    });


    let levelsButton = this.add.text(663, 320, "Level Select", {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "30px",
    });

    // and set it interactive
    levelsButton.setInteractive();
    levelsButton.on("pointerover", function() {
      this.setFontSize(32);
      this.x -= 3;
      this.y -= 1;
    });

    levelsButton.on("pointerout", function() {
      this.setFontSize(30);
      this.x += 3;
      this.y += 1;
    });

    levelsButton.on("pointerup", function() {
      this.scene.tweens.add({
        targets: this.scene.blackRect,
        x: this.scene.blackRect.x,
        ease: 'Linear',
        duration: 10,
        repeat: 22,
        yoyo: false,
        onRepeat: () => {
          if (this.scene.blackRect.fillAlpha < 1) {
            this.scene.blackRect.fillAlpha += 0.05;
          }
          if (this.scene.blackRect.fillAlpha > 1) {
            this.scene.blackRect.fillAlpha = 1;
          }
        },
        onComplete: () => {
          this.scene.scene.stop();
          if (this.scene.editScene === true) {
            this.scene.scene.stop("EditScene");
          } else {
            this.scene.scene.stop("GameScene");
          }
          this.scene.scene.start("LevelSelectScene");
        },
      });
    });

    let userLevelsButton = this.add.text(681, 200, "My Levels", {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "30px",
    });

    // and set it interactive
    userLevelsButton.setInteractive();
    userLevelsButton.on("pointerover", function() {
      this.setFontSize(32);
      this.x -= 3;
      this.y -= 1;
    });

    userLevelsButton.on("pointerout", function() {
      this.setFontSize(30);
      this.x += 3;
      this.y += 1;
    });

    userLevelsButton.on("pointerup", function() {
      this.scene.tweens.add({
        targets: this.scene.blackRect,
        x: this.scene.blackRect.x,
        ease: 'Linear',
        duration: 10,
        repeat: 22,
        yoyo: false,
        onRepeat: () => {
          if (this.scene.blackRect.fillAlpha < 1) {
            this.scene.blackRect.fillAlpha += 0.05;
          }
          if (this.scene.blackRect.fillAlpha > 1) {
            this.scene.blackRect.fillAlpha = 1;
          }
        },
        onComplete: () => {
          this.scene.scene.stop();
          if (this.scene.editScene === true) {
            this.scene.scene.stop("EditScene");
          } else {
            this.scene.scene.stop("GameScene");
          }
          this.scene.scene.start("UserLevelsScene");
        },
      });
    });


    let editButton = this.add.text(679, 430, "Edit Level", {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "30px",
    });

    if (!this.myLevel) {
      editButton.setAlpha(0.5);
    }
    
    if (this.editScene) {
      editButton.text = "Play Level";
    }

    // and set it interactive
    editButton.setInteractive();
    editButton.on("pointerover", function() {
      if (this.alpha === 1) {
        this.setFontSize(32);
        this.x -= 3;
        this.y -= 1;
      }
    });

    editButton.on("pointerout", function() {
      if (this.alpha === 1) {
        this.setFontSize(30);
        this.x += 3;
        this.y += 1;
      }
    });

    editButton.on("pointerup", function() {
      if (editButton.alpha === 1) {
        this.scene.tweens.add({
          targets: this.scene.blackRect,
          x: this.scene.blackRect.x,
          ease: 'Linear',
          duration: 10,
          repeat: 22,
          yoyo: false,
          onRepeat: () => {
            if (this.scene.blackRect.fillAlpha < 1) {
              this.scene.blackRect.fillAlpha += 0.05;
            }
            if (this.scene.blackRect.fillAlpha > 1) {
              this.scene.blackRect.fillAlpha = 1;
            }
          },
          onComplete: () => {
            this.scene.scene.stop();
            if (this.scene.editScene === true) {
              this.scene.scene.stop("EditScene");
              this.scene.scene.start("GameScene", {userLevel: true, level: this.scene.levelNum});
            } else {
              this.scene.scene.stop("GameScene");
              this.scene.scene.start("EditScene", {level: this.scene.levelNum});
            }
          },
        });
      }
    });
  }
}