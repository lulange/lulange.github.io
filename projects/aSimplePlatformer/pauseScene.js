class PauseScene extends Phaser.Scene {
  constructor() {
    super({key: 'PauseScene'});
  }

  create() {
    this.add.text(365, 80, `Paused`, { fontFamily: 'Arial', fontSize: 50, color: '#000000' });

    this.input.keyboard.on('keyup-P', () => {
      this.scene.stop();
      if (this.scene.isVisible("GameScene")) {
        this.scene.resume("GameScene");
      } else {
        this.scene.resume("EditScene");
      }
    });

    let restartButton = this.add.rectangle(450, 250, 300, 75, "0x000000");
    this.add.text(391.5, 230.5, `Restart`, { fontFamily: 'Arial', fontSize: 36, color: '#ffffff' });
    restartButton.setInteractive();
    restartButton.on('pointerup', () => {
      restartButton.setDepth(5);
      this.tweens.add({
        targets: restartButton,
        x: restartButton.x,
        ease: 'Linear',
        duration: 10,
        repeat: 40,
        yoyo: false,
        onRepeat: () => {
          restartButton.displayWidth += 50;
          restartButton.displayHeight += 50;
        },
        onComplete: () => {
          this.scene.stop();
          if (this.scene.isVisible("GameScene")) {
            this.scene.stop("GameScene");
            this.scene.start("GameScene");
          } else {
            this.scene.stop("EditScene");
            this.scene.start("GameScene");
          }
        },
      });
    });

    let levelsButton = this.add.rectangle(450, 350, 300, 75, "0x000000");
    this.add.text(397.5, 330.5, `Levels`, { fontFamily: 'Arial', fontSize: 36, color: '#ffffff' });
    levelsButton.setInteractive();
    levelsButton.on('pointerup', () => {
      levelsButton.setDepth(1);
      this.tweens.add({
        targets: levelsButton,
        x: levelsButton.x,
        ease: 'Linear',
        duration: 10,
        repeat: 40,
        yoyo: false,
        onRepeat: () => {
          levelsButton.displayWidth += 50;
          levelsButton.displayHeight += 50;
        },
        onComplete: () => {
          this.scene.stop();
          if (this.scene.isVisible("GameScene")) {
            this.scene.stop("GameScene");
          } else {
            this.scene.stop("EditScene");
          }

          this.scene.start("LevelSelect");
        },
      });
    });


    let mainMenuButton = this.add.rectangle(450, 450, 300, 75, "0x000000");
    this.add.text(360.5, 430.5, `Main menu`, { fontFamily: 'Arial', fontSize: 36, color: '#ffffff' });
    mainMenuButton.setInteractive();
    mainMenuButton.on('pointerup', () => {
      mainMenuButton.setDepth(1);
      this.tweens.add({
        targets: mainMenuButton,
        x: mainMenuButton.x,
        ease: 'Linear',
        duration: 10,
        repeat: 40,
        yoyo: false,
        onRepeat: () => {
          mainMenuButton.displayWidth += 50;
          mainMenuButton.displayHeight += 50;
        },
        onComplete: () => {
          this.scene.stop();
          if (this.scene.isVisible("GameScene")) {
            this.scene.stop("GameScene");
          } else {
            this.scene.stop("EditScene");
          }

          this.scene.start("StartScene");
        },
      });
    });
  }
}
