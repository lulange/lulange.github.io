class LevelSelect extends Phaser.Scene {
  constructor() {
    super({key: 'LevelSelect'});
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
    this.add.text(377.5, 30, `Levels`, { fontFamily: 'Arial', fontSize: 50, color: '#000000' });

    let levelSelectButtons = [];
    for (let i=0; i<15; i++) {
      levelSelectButtons[i] = this.add.rectangle((i-(Math.floor(i/5)*5))*120+210, Math.floor(i/5)*120+180, 90, 110, "0x000000");
      if (i+1 >= 10) {
        this.add.text((i-(Math.floor(i/5)*5))*120+190, Math.floor(i/5)*120+150, `${i+1}`, { fontFamily: 'Arial', fontSize: 36, color: '#ffffff' });
      } else {
        this.add.text((i-(Math.floor(i/5)*5))*120+200, Math.floor(i/5)*120+150, `${i+1}`, { fontFamily: 'Arial', fontSize: 36, color: '#ffffff' });
      }
      if (i >= parseInt(localStorage.getItem("SP-unlockedLevels"))) {
        this.add.text((i-(Math.floor(i/5)*5))*120+175, Math.floor(i/5)*120+200, `Locked!`, { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });
        levelSelectButtons[i].levelLocked = true;
      }

      levelSelectButtons[i].setInteractive();
      levelSelectButtons[i].on('pointerup', () => {
        if (levelSelectButtons[i].levelLocked !== true) {
          levelSelectButtons[i].setDepth(1);
          this.tweens.add({
            targets: levelSelectButtons[i],
            x: levelSelectButtons[i].x,
            ease: 'Linear',
            duration: 10,
            repeat: 40,
            yoyo: false,
            onRepeat: () => {
              levelSelectButtons[i].displayWidth += 50;
              levelSelectButtons[i].displayHeight += 50;
            },
            onComplete: () => {
              this.scene.stop();
              gameState.level = levels[i].level;
              gameState.spikesTracker = levels[i].spikesTracker;
              gameState.playerXAndY = levels[i].playerXAndY;
              gameState.arrowsTracker = levels[i].arrowsTracker;
              gameState.isEditable = levels[i].isEditable;
              gameState.currLevel = i+1;
              this.scene.start("GameScene");
            },
          });
        }
      });
    }

    let mainMenuButton = this.add.rectangle(450, 540, 400, 75, "0x000000");
    this.add.text(295.5, 520.5, `Back to main menu`, { fontFamily: 'Arial', fontSize: 36, color: '#ffffff' });
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
          this.scene.start("StartScene");
        },
      });
    });
  }
}
