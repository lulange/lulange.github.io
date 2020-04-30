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
    this.add.text(175, 100, `Level Select`, { fontFamily: 'Arial', fontSize: 100, color: '#000000' });

    let levelSelectButtons = [];
    for (let i=0; i<15; i++) {
      levelSelectButtons[i] = this.add.rectangle((i-(Math.floor(i/5)*5))*120+210, Math.floor(i/5)*180+375, 90, 120, "0x000000");
      if (i+1 >= 10) {
        this.add.text((i-(Math.floor(i/5)*5))*120+190, Math.floor(i/5)*180+345, `${i+1}`, { fontFamily: 'Arial', fontSize: 36, color: '#ffffff' });
      } else {
        this.add.text((i-(Math.floor(i/5)*5))*120+200, Math.floor(i/5)*180+345, `${i+1}`, { fontFamily: 'Arial', fontSize: 36, color: '#ffffff' });
      }
      if (i >= localStorage.getItem("unlockedLevels")) {
        this.add.text((i-(Math.floor(i/5)*5))*120+175, Math.floor(i/5)*180+395, `Locked!`, { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });
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
              var xmlhttp = new XMLHttpRequest();
              xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                  var myObj = JSON.parse(this.responseText);
                  console.log(myObj);
                }
              };
              xmlhttp.open("GET", "file:///C:/Users/lucas/Documents/lulange.github.io/typicalPlatformer/level1.txt", true);
              xmlhttp.send();
              this.scene.stop();
              gameState.blocksCoor = levels[i].blocksCoor;
              gameState.spikesCoor = levels[i].spikesCoor;
              gameState.doorsCoor = levels[i].doorsCoor;
              gameState.arrowsCoor = levels[i].arrowsCoor;
              gameState.keysCoor = levels[i].keysCoor;
              gameState.lavaCoor = levels[i].lavaCoor;
              gameState.playerXAndY = levels[i].playerXAndY;
              gameState.portalsCoor = levels[i].portalsCoor;
              gameState.currLevel = levels[i].currLevel;
              this.scene.start("GameScene");
            },
          });
        }
      });
    }
  }
}
