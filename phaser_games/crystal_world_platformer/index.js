const MAP_WIDTH = 1600;
const WIDTH = document.body.offsetWidth;
const HEIGHT = 700;
const ZOOM_FACTOR = 1.5;

const SHARED_CONFIG = {
    mapOffSet: MAP_WIDTH > WIDTH ? MAP_WIDTH - WIDTH : 0,
    width: WIDTH,
    height: HEIGHT,
    zoomFactor: ZOOM_FACTOR,
    leftTopCorner: {
        x: (WIDTH - (WIDTH / ZOOM_FACTOR)) / 2,
        y: (HEIGHT - (HEIGHT / ZOOM_FACTOR)) / 2
    },
    rightTopCorner: {
        x: (WIDTH / ZOOM_FACTOR) + ((WIDTH - (WIDTH / ZOOM_FACTOR)) / 2),
        y: (HEIGHT - (HEIGHT / ZOOM_FACTOR)) / 2
    },
    rightBottomCorner: {
        x: (WIDTH / ZOOM_FACTOR) + ((WIDTH - (WIDTH / ZOOM_FACTOR)) / 2),
        y: (HEIGHT / ZOOM_FACTOR) + ((HEIGHT - (HEIGHT / ZOOM_FACTOR)) / 2)
    },
    lastLevel: 2,
    debug: true,
};

const config = {
    type: Phaser.AUTO,
    ...SHARED_CONFIG,
    pixelArt: true,
    parent: 'game-container',
    physics: {
        default:"arcade",
        arcade: {
            // gravity: { y: GRAVITY_Y },
            debug: SHARED_CONFIG.debug
        }
    },
    scene: [
        Preload,
        new Menu(SHARED_CONFIG),
        new Credits(SHARED_CONFIG),
        new Level(SHARED_CONFIG),
        new Play(SHARED_CONFIG),
    ]
};

const game = new Phaser.Game(config);


