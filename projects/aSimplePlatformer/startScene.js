class StartScene extends Phaser.Scene {
  constructor() {
    super({key: 'StartScene'});
  }

  preload() {
    let blackRect = this.add.rectangle(450, 450, 1000,  1000, "0x000000").setDepth(2);
    this.tweens.add({
      targets: blackRect,
      x: blackRect.x,
      ease: 'Linear',
      duration: 10,
      repeat: 20,
      yoyo: false,
      onRepeat: () => {
        blackRect.displayWidth -= 50;
        blackRect.displayHeight -= 50;
      },
      onComplete: () => {
        blackRect.destroy();
      },
    });
  }

  create() {
    this.add.text(227.5, 50, `A Simple Platformer`, { fontFamily: 'Arial', fontSize: 50, color: '#000000' });

    let quickPlayButton = this.add.rectangle(450, 250, 300, 75, "0x000000");
    let textToCenter = this.add.text(357.5, 230.5, `Play level ${localStorage.getItem("SP-unlockedLevels")}`, { fontFamily: 'Arial', fontSize: 36, color: '#ffffff' });
    textToCenter.x = (900 - (textToCenter.getTopRight().x - textToCenter.getTopLeft().x)) / 2;
    quickPlayButton.setInteractive();
    quickPlayButton.on('pointerup', () => {
      quickPlayButton.setDepth(1);
      this.tweens.add({
        targets: quickPlayButton,
        x: quickPlayButton.x,
        ease: 'Linear',
        duration: 10,
        repeat: 40,
        yoyo: false,
        onRepeat: () => {
          quickPlayButton.displayWidth += 50;
          quickPlayButton.displayHeight += 50;
        },
        onComplete: () => {
          let levelIndex = parseInt(localStorage.getItem("SP-unlockedLevels")) - 1;
          this.scene.stop();
          gameState.level = levels[levelIndex].level;
          gameState.spikesTracker = levels[levelIndex].spikesTracker;
          gameState.playerXAndY = levels[levelIndex].playerXAndY;
          gameState.arrowsTracker = levels[levelIndex].arrowsTracker;
          gameState.isEditable = levels[levelIndex].isEditable;
          gameState.currLevel = levelIndex+1;
          this.scene.start("GameScene");
        },
      });
    });

    let levelsButton = this.add.rectangle(450, 350, 300, 75, "0x000000");
    this.add.text(357.5, 330.5, `Select level`, { fontFamily: 'Arial', fontSize: 36, color: '#ffffff' });
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
          this.scene.start("LevelSelect");
        },
      });
    });

    let restartButton = this.add.rectangle(450, 450, 300, 75, "0x000000");
    this.add.text(341.5, 430.5, `Restart game`, { fontFamily: 'Arial', fontSize: 36, color: '#ffffff' });
    restartButton.setInteractive();
    restartButton.on('pointerup', () => {
      restartButton.setDepth(1);
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
          localStorage.setItem("SP-unlockedLevels", 1);
          levels.forEach(level => {
            level.isEditable = false;
          });
          this.scene.start("StartScene");
        },
      });
    });
  }
}
