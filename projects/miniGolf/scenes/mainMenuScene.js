export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({key: "MainMenuScene"});
  }
  
  preload() {
  }
  
  create() {
    
    // create rectangle for transition
    let blackRect = this.add.rectangle(450, 300, 900, 600, "0x000000", 1);
    blackRect.setDepth(10);
    
    // create main text/buttons
    
    //create the main banner "Mini golf"
    let mainBanner = this.add.text(285, 75, "Mini golf ", {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "80px",
    });
    
    // create the play button
    let playButton = this.add.text(403, 220, "play", {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "50px",
    });
    
    // and set it interactive
    playButton.setInteractive();
    playButton.on("pointerover", function() {
      this.setFontSize(53);
      this.x = 401;
      this.y = 218;
    });
    
    playButton.on("pointerout", function() {
      this.setFontSize(50);
      this.x = 403;
      this.y = 220;
    });
    
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
          this.scene.scene.start("LevelSelectScene");
        },
      });
    });
    
    // create the create button
    let createButton = this.add.text(345, 300, "my levels", {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "50px",
    });
    
    // and set it interactive
    createButton.setInteractive();
    createButton.on("pointerover", function() {
      this.setFontSize(53);
      this.x = 338;
      this.y = 298;
    });
    
    createButton.on("pointerout", function() {
      this.setFontSize(50);
      this.x = 345;
      this.y = 300;
    });
    
    createButton.on("pointerup", function() {
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
          this.scene.scene.start("UserLevelsScene");
        },
      });
    });
    
    // create the options button
    let optionsButton = this.add.text(300, 380, "select player", {
      fontFamily: "Comic Sans MS, Comic Sans, Chalkboard SE",
      fontSize: "50px",
    });
    
    // and set it interactive
    optionsButton.setInteractive();
    optionsButton.on("pointerover", function() {
      this.setFontSize(53);
      this.x = 291;
      this.y = 378;
    });
    
    optionsButton.on("pointerout", function() {
      this.setFontSize(50);
      this.x = 300;
      this.y = 380;
    });
    
    optionsButton.on("pointerup", function() {
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
          this.scene.scene.start("PlayerSelectScene");
        },
      });
    });
    
    //console.log((900 - (optionsButton.getTopRight().x- optionsButton.getTopLeft().x)) / 2 );
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