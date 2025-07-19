const GRAVITY_Y = 600;
const WIDTH = 800;
const HEIGHT = 500;
const BIRD_POS = { x: WIDTH /10, y: HEIGHT/2 };

const SHARED_CONFIG = {
    width: WIDTH,
    height: HEIGHT,
    startPosition: BIRD_POS
};

const config = {
    type: Phaser.AUTO,
    ...SHARED_CONFIG,
    pixelArt: true,
    parent: 'game-container',
    physics: {
        default:"arcade",
        arcade: {
            gravity: { y: GRAVITY_Y },
            debug: true
        }
    },
    scene: [
        PreloadScene, 
        new MenuScene(SHARED_CONFIG), 
        new PlayScene(SHARED_CONFIG),
        new ScoreScene(SHARED_CONFIG),
        new PauseScene(SHARED_CONFIG)
    ]
};

const game = new Phaser.Game(config);


