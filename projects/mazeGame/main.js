const gameState = {

};

const config = {
	type: Phaser.AUTO,
	width: 900,
	height: 600,
	backgroundColor: "b6eaff",
  parent: "canvas-wrapper",
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 1000 },
			enableBody: true,
		}
	},
	scene: [GameScene]
};

let game = new Phaser.Game(config);
