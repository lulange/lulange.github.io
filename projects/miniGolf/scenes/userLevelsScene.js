export default class UserLevelsScene extends Phaser.Scene {
  constructor() {
    super({key: "UserLevelsScene"});
  }
  
  preload() {
    
  }
  
  create() {
    // create rectangle for transition
    let blackRect = this.add.rectangle(450, 300, 900, 600, "0x000000", 1);
    blackRect.setDepth(10);
    
    // create main text/buttons
    
    //create the main banner "Levels"
    let mainBanner = this.add.text(289, 75, "My Levels", {
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
    
    
    
    let levelBanner, levelNum, playButton, editButton;
    for (let i=0; i<5; i++) {
      for (let j=0; j<2; j++) {
        levelNum = (i + 1) + (j * 5);
        
        if (levelNum >= 10) {
          levelBanner = this.add.text(i*130 + 155, j*170 + 180, levelNum, {
            fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
            fontSize: "50px",
            color: "#FFFFFF",
          });
          
          playButton = this.add.text(i*130 + 155, j*170 + 240, "play", {
            fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
            fontSize: "30px",
            color: "#FFFFFF",
          });
          
          playButton.setInteractive();
          playButton.on("pointerover", function() {
            this.setFontSize(32);
            this.x = this.x - 2;
            this.y = this.y - 2;
          });

          playButton.on("pointerout", function() {
            this.setFontSize(30);
            this.x = this.x + 2;
            this.y = this.y + 2;
          });
          
          // edit button
          editButton = this.add.text(i*130 + 155, j*170 + 280, "edit", {
            fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
            fontSize: "30px",
            color: "#FFFFFF",
          });
          
          editButton.setInteractive();
          editButton.on("pointerover", function() {
            this.setFontSize(32);
            this.x = this.x - 2;
            this.y = this.y - 2;
          });

          editButton.on("pointerout", function() {
            this.setFontSize(30);
            this.x = this.x + 2;
            this.y = this.y + 2;
          });
        } else {
          levelBanner = this.add.text(i*130 + 166, j*170 + 180, levelNum, {
            fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
            fontSize: "50px",
            color: "#FFFFFF",
          });
          
          playButton = this.add.text(i*130 + 155, j*170 + 240, "play", {
            fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
            fontSize: "30px",
            color: "#FFFFFF",
          });
          
          playButton.setInteractive();
          playButton.on("pointerover", function() {
            this.setFontSize(32);
            this.x = this.x - 1;
            this.y = this.y - 1;
          });

          playButton.on("pointerout", function() {
            this.setFontSize(30);
            this.x = this.x + 1;
            this.y = this.y + 1;
          });
          
          // edit button
          editButton = this.add.text(i*130 + 155, j*170 + 280, "edit", {
            fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
            fontSize: "30px",
            color: "#FFFFFF",
          });
          
          editButton.setInteractive();
          editButton.on("pointerover", function() {
            this.setFontSize(32);
            this.x = this.x - 2;
            this.y = this.y - 2;
          });

          editButton.on("pointerout", function() {
            this.setFontSize(30);
            this.x = this.x + 2;
            this.y = this.y + 2;
          });
        }
        
        playButton.levelNum = levelNum;
        playButton.on("pointerup", function() {
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
                level: this.levelNum,
                userLevel: true,
              });
            },
          });
        });
        
        editButton.levelNum = levelNum;
        editButton.on("pointerup", function() {
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
              this.scene.scene.start("EditScene", {
                level: this.levelNum
              });
            },
          });
        });
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