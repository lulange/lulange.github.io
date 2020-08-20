export default class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super({key: "LevelSelectScene"});
  }

  create() {
    // create rectangle for transition
    let blackRect = this.add.rectangle(450, 300, 900, 600, "0x000000", 1);
    blackRect.setDepth(10);

    // create main text/buttons

    //create the main banner "Levels"
    let mainBanner = this.add.text(348, 75, "Levels", {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "70px",
    });

    let backButton = this.add.text(30, 20, "<<", {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "40px",
    });

    // and set it interactive
    backButton.setInteractive();
    backButton.on("pointerover", function() {
      this.setFontSize(43);
      this.x -= 1;
      this.y -= 2;
    });

    backButton.on("pointerout", function() {
      this.setFontSize(40);
      this.x += 1;
      this.y += 2;
    });

    backButton.on("pointerup", function() {
      this.scene.tweens.add({
        targets: blackRect,
        x: blackRect.x,
        ease: 'Linear',
        duration: 10,
        repeat: 22,
        yoyo: false,
        onRepeat: () => {
          if (blackRect.fillAlpha < 1) {
            blackRect.fillAlpha += 0.05;
          }
          if (blackRect.fillAlpha > 1) {
            blackRect.fillAlpha = 1;
          }
        },
        onComplete: () => {
          this.scene.scene.stop();
          this.scene.scene.start("MainMenuScene");
        },
      });
    });



    let levelButton, levelNum;
    for (let i=0; i<6; i++) {
      for (let j=0; j<5; j++) {
        levelNum = (i + 1) + (j * 6);

        if (parseInt(localStorage.getItem("MG-unlockedLevels")) >= levelNum) {
          if (levelNum >= 10) {
            levelButton = this.add.text(i*110 + 144, j*80 + 180, levelNum, {
              fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
              fontSize: "50px",
              color: "#FFFFFF",
            });

            levelButton.setInteractive();
            levelButton.on("pointerover", function() {
              this.setFontSize(53);
              this.x = this.x - 2;
              this.y = this.y - 2;
            });

            levelButton.on("pointerout", function() {
              this.setFontSize(50);
              this.x = this.x + 2;
              this.y = this.y + 2;
            });
          } else {
            levelButton = this.add.text(i*110 + 156, j*80 + 180, levelNum, {
              fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
              fontSize: "50px",
              color: "#FFFFFF",
            });

            levelButton.setInteractive();
            levelButton.on("pointerover", function() {
              this.setFontSize(53);
              this.x = this.x - 1;
              this.y = this.y - 1;
            });

            levelButton.on("pointerout", function() {
              this.setFontSize(50);
              this.x = this.x + 1;
              this.y = this.y + 1;
            });
          }

          levelButton.on("pointerup", function() {
            this.scene.tweens.add({
              targets: blackRect,
              x: blackRect.x,
              ease: 'Linear',
              duration: 10,
              repeat: 22,
              yoyo: false,
              onRepeat: () => {
                if (blackRect.fillAlpha < 1) {
                  blackRect.fillAlpha += 0.05;
                }
                if (blackRect.fillAlpha > 1) {
                  blackRect.fillAlpha = 1;
                }
              },
              onComplete: () => {
                this.scene.scene.stop();
                this.scene.scene.start("GameScene", {
                  level: parseInt(this.text),
                  userLevel: false,
                });
              },
            });
          });
        }
      }
    }


    this.tweens.add({
      targets: blackRect,
      x: blackRect.x,
      ease: 'Linear',
      duration: 10,
      repeat: 22,
      yoyo: false,
      onRepeat: () => {
        if (blackRect.fillAlpha > 0) {
          blackRect.fillAlpha -= 0.05;
        }
        if (blackRect.fillAlpha < 0) {
          blackRect.fillAlpha = 0;
        }
      },
    });
  }
}
