export default class LevelWinScene extends Phaser.Scene {
  constructor() {
    super({key: "LevelWinScene"});
  }
  
  init(data) {
    this.myLevel = data.myLevel;
    this.levelNum = data.levelNum;
    if (this.levelNum === 30 && this.myLevel === false) {
      this.lastLevel = true;
    } else if (this.levelNum === 10 && this.myLevel) {
      this.lastLevel = true;
    } else {
      this.lastLevel = false;
    }
    
    if (parseInt(localStorage.getItem("unlockedLevels")) < this.levelNum+1 && this.myLevel === false) {
      localStorage.setItem("unlockedLevels", this.levelNum+1);
      this.unlockedLevel = true;
    } else {
      this.unlockedLevel = false;
    }
  }
  
  preload() {
  }
  
  create() {
    this.add.rectangle(450, 300, 900, 600, "0x000000", 1);
    this.blackRect = this.add.rectangle(450, 300, 900, 600, "0x000000", 1).setDepth(10);
    
    // create main text/buttons
    let congratsArray = ["Nice!", "Congratulations!", "Great!", "Excellent!", "Awesome!", "Incredible!"];
    let mainBanner = this.add.text(675, 90, congratsArray[Math.round(Math.random() * (congratsArray.length - 0.6))], {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "60px",
      resolution: 3,
    });
    
    if (this.lastLevel) {
      if (this.myLevel) {
        mainBanner.text = "You beat your last level!";
      } else {
        mainBanner.text = "You beat the last one!";
      }
    }
    
    mainBanner.x = (900 - (mainBanner.getTopRight().x- mainBanner.getTopLeft().x)) / 2;

    // console.log((900 - (MenuButton.getTopRight().x- MenuButton.getTopLeft().x)) / 2 );

    let MenuButton = this.add.text(675, 320, "Main Menu", {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "30px",
    });
    MenuButton.x = (900 - (MenuButton.getTopRight().x- MenuButton.getTopLeft().x)) / 2;

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
          this.scene.scene.start("MainMenuScene");
        },
      });
    });


    let levelsButton = this.add.text(663, 380, "Level Select", {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "30px",
    });
    levelsButton.x = (900 - (levelsButton.getTopRight().x- levelsButton.getTopLeft().x)) / 2;

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
          this.scene.scene.start("LevelSelectScene");
        },
      });
    });

    let userLevelsButton = this.add.text(681, 260, "My Levels", {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "30px",
    });
    userLevelsButton.x = (900 - (userLevelsButton.getTopRight().x- userLevelsButton.getTopLeft().x)) / 2;

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
          this.scene.scene.start("UserLevelsScene");
        },
      });
    });
    
    
    
    let nextLevelButton = this.add.text(681, 200, "Next Level", {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "30px",
    });
    
    if (this.lastLevel) {
      nextLevelButton.text = "Go Back";
    }
    
    nextLevelButton.x = (900 - (nextLevelButton.getTopRight().x- nextLevelButton.getTopLeft().x)) / 2;

    // and set it interactive
    nextLevelButton.setInteractive();
    nextLevelButton.on("pointerover", function() {
      this.setFontSize(32);
      this.x -= 3;
      this.y -= 1;
    });

    nextLevelButton.on("pointerout", function() {
      this.setFontSize(30);
      this.x += 3;
      this.y += 1;
    });

    nextLevelButton.on("pointerup", function() {
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
          if (this.scene.lastLevel) {
            this.scene.scene.start("MainMenuScene");
          } else {
            this.scene.scene.start("GameScene", {userLevel: this.scene.myLevel, level: this.scene.levelNum+1});
          }
        },
      });
    });
    
    
    
    let replayButton = this.add.text(681, 440, "Play Again", {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "30px",
    });
    replayButton.x = (900 - replayButton.width) / 2;
    replayButton.setPadding(0, 0, 0, 5);

    // and set it interactive
    replayButton.setInteractive();
    replayButton.on("pointerover", function() {
      this.setFontSize(32);
      this.x -= 3;
      this.y -= 1;
    });

    replayButton.on("pointerout", function() {
      this.setFontSize(30);
      this.x += 3;
      this.y += 1;
    });

    replayButton.on("pointerup", function() {
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
          this.scene.scene.start("GameScene", {userLevel: this.scene.myLevel, level: this.scene.levelNum});
        },
      });
    });
    
    
    let unlockLevelNums = [0, 3, 5, 10, 15, 20, 25, 30];
    let ballTypes = ["White", "Red", "Blue", "Purple", "Green", "Orange", "Gold", "Sky Blue"];
    let unlockText = this.add.text(681, 500, "", {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "30px",
    });
    
    
    if (this.unlockedLevel) {
      let newTextIndex = unlockLevelNums.indexOf(this.levelNum);
      if (newTextIndex !== -1) {
        unlockText.text = ballTypes[newTextIndex] + " Ball Unlocked!";
        unlockText.x = (900 - (unlockText.getTopRight().x- unlockText.getTopLeft().x)) / 2;
      }
    }
    
    
    // transition in
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