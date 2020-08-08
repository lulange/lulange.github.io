class WinScene extends Phaser.Scene {
  constructor() {
    super({key: 'WinScene'});
  }

  preload() {
    localStorage.setItem("completed", "true");
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
    this.add.text(320.5, 50, `YOU WON!`, { fontFamily: 'Arial', fontSize: 50, color: '#000000' });
    this.add.text(318.5, 200, `Congratulations!`, { fontFamily: 'Arial', fontSize: 36, color: '#000000' });
    this.add.text(209, 240, `You have unlocked edit mode!`, { fontFamily: 'Arial', fontSize: 36, color: '#000000' });
    this.add.text(112, 280, `Press "e" to toggle edit mode on any level,`, { fontFamily: 'Arial', fontSize: 36, color: '#000000' });
    this.add.text(258.5, 320, `then click to place items`, { fontFamily: 'Arial', fontSize: 36, color: '#000000' });

    let mainMenuButton = this.add.rectangle(450, 500, 400, 75, "0x000000");
    this.add.text(295.5, 480.5, `Back to main menu`, { fontFamily: 'Arial', fontSize: 36, color: '#ffffff' });
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
