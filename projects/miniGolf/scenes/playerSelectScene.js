export default class PlayerSelectScene extends Phaser.Scene {
  constructor() {
    super({key: "PlayerSelectScene"});
  }
  
  preload() {
    // create rectangle for transition
    this.blackRect = this.add.rectangle(450, 300, 900, 600, "0x000000", 1);
    this.blackRect.setDepth(10);
    this.load.image("white", "https://cdn.glitch.com/1737f775-4be5-40d3-b5b1-2ba50647b921%2Fball.png?v=1594590260477");
    this.load.image("red", "https://cdn.glitch.com/1737f775-4be5-40d3-b5b1-2ba50647b921%2FredBall.png?v=1596914817032");
    this.load.image("orange", "https://cdn.glitch.com/1737f775-4be5-40d3-b5b1-2ba50647b921%2ForangeBall.png?v=1596914808138");
    this.load.image("blue", "https://cdn.glitch.com/1737f775-4be5-40d3-b5b1-2ba50647b921%2FblueBall.png?v=1596914833505");
    this.load.image("gold", "https://cdn.glitch.com/1737f775-4be5-40d3-b5b1-2ba50647b921%2FgoldBall.png?v=1596914853481");
    this.load.image("purple", "https://cdn.glitch.com/1737f775-4be5-40d3-b5b1-2ba50647b921%2FpurpleBall.png?v=1596914816877");
    this.load.image("green", "https://cdn.glitch.com/1737f775-4be5-40d3-b5b1-2ba50647b921%2FgreenBall.png?v=1596914824003");
    this.load.image("sky blue", "https://cdn.glitch.com/1737f775-4be5-40d3-b5b1-2ba50647b921%2FskyBlue.png?v=1596995370671");
  }
  
  create() {
    
    // create main text/buttons
    
    //create the main banner "Levels"
    let mainBanner = this.add.text(348, 75, "Select Player", {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "70px",
    });
    
    mainBanner.x = (900 - (mainBanner.getTopRight().x- mainBanner.getTopLeft().x)) / 2;
    
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
          this.scene.scene.start("MainMenuScene");
        },
      });
    });
    
    let equipButtons = [];
    let unlockLevelNums = [0, 3, 5, 10, 15, 20, 25, 30];
    let ballTypes = ["white", "red", "blue", "purple", "green", "orange", "gold", "sky blue"];
    let ballButton;
    for (let i=0; i<2; i++) {
      for (let j=0; j<4; j++) {
        this.add.rectangle(j*170 + 195, i*170 + 280, 150, 150, "0x000000", 0).setStrokeStyle(3, "0xFFFFFF", 1);
        
        this.add.image(j*170 + 195, i*170 + 250, ballTypes[((i*4) + j)]);
        
        if (parseInt(localStorage.getItem("unlockedLevels")) > unlockLevelNums[(i*4) + j]) {
          let ballName = this.add.text(j*170 + 120, i*170 + 270, ballTypes[(i*4) + j], {
            fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
            fontSize: "24px",
            color: "#FFFFFF",
          });
          ballName.x = ((150 - (ballName.getTopRight().x- ballName.getTopLeft().x)) / 2) + ballName.x;


          ballButton = this.add.text(j*170 + 164, i*170 + 300, "equip", {
            fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
            fontSize: "24px",
            color: "#FFFFFF",
          });

          ballButton.setInteractive();
          ballButton.on("pointerover", function() {
            this.setFontSize(25);
            this.x = this.x - 1;
            this.y = this.y - 1;
          });

          ballButton.on("pointerout", function() {
            this.setFontSize(24);
            this.x = this.x + 1;
            this.y = this.y + 1;
          });

          ballButton.on("pointerup", function() {
            if (this.text === "equip") {
              sessionStorage.setItem("ball", ballTypes[(i*4) + j]);
              for (let v=0; v<equipButtons.length; v++) {
                if (equipButtons[v].text === "equipped") {
                  equipButtons[v].text = "equip";
                  equipButtons[v].x += 20;
                }
              }

              this.text = "equipped";
              this.x -= 20;
            }
          });

          if (ballTypes[(i*4) + j] === sessionStorage.getItem("ball")) {
            ballButton.text = "equipped";
            ballButton.x -= 20;
          }

          equipButtons.push(ballButton);
        } else {
          let lockedText = this.add.text(j*170 + 120, i*170 + 270, "unlock at", {
            fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
            fontSize: "24px",
            color: "#FFFFFF",
          });
          lockedText.x = ((150 - (lockedText.getTopRight().x- lockedText.getTopLeft().x)) / 2) + lockedText.x;
          
          let lockedText2 = this.add.text(j*170 + 120, i*170 + 300, "level " + unlockLevelNums[(i*4) + j], {
            fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
            fontSize: "24px",
            color: "#FFFFFF",
          });
          lockedText2.x = ((150 - (lockedText2.getTopRight().x- lockedText2.getTopLeft().x)) / 2) + lockedText2.x;
        }
      }


      this.tweens.add({
        targets: this.blackRect,
        x: this.blackRect.x,
        ease: 'Linear',
        duration: 10,
        repeat: 22,
        yoyo: false,
        onRepeat: () => {
          if (this.blackRect.fillAlpha > 0) {
            this.blackRect.fillAlpha -= 0.05;
          }
          if (this.blackRect.fillAlpha < 0) {
            this.blackRect.fillAlpha = 0;
          }
        },
      });
    }
  }
}