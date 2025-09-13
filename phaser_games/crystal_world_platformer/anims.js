function initAnimationsPlayer(anims) {
    anims.create({
        key: 'idle',
        frames: anims.generateFrameNumbers('player', {start: 0, end: 8}),
        frameRate: 8,
        repeat: -1
    });

    anims.create({
        key: 'run',
        frames: anims.generateFrameNumbers('player', {start: 11, end: 16}),
        frameRate: 8,
        repeat: -1
    });

    anims.create({
        key: 'jump',
        frames: anims.generateFrameNumbers('player', {start: 17, end: 23}),
        frameRate: 2,
        repeat: 1
    });

    anims.create({
        key: 'throw',
        frames: anims.generateFrameNumbers('player-throw', {start: 0, end: 6}),
        frameRate: 14,
        repeat: 0
    });

    anims.create({
        key: 'slide',
        frames: anims.generateFrameNumbers('player-slide-sheet', {start: 0, end: 2}),
        frameRate: 20,
        repeat: 0
    });
}

function initAnimationsBirdman(anims) {
    anims.create({
        key: 'birdman-idle',
        frames: anims.generateFrameNumbers('birdman', {start: 0, end: 12}),
        frameRate: 8,
        repeat: -1
    });

    anims.create({
        key: 'birdman-hurt',
        frames: anims.generateFrameNumbers('birdman', {start: 25, end: 26}),
        frameRate: 10,
        repeat: 0
    });
}

function initAnimationsSnaky(anims) {
    anims.create({
        key: 'snaky-walk',
        frames: anims.generateFrameNumbers('snaky', {start: 0, end: 8}),
        frameRate: 8,
        repeat: -1
    });

    anims.create({
        key: 'snaky-hurt',
        frames: anims.generateFrameNumbers('snaky', {start: 21, end: 22}),
        frameRate: 10,
        repeat: 0
    });
}

function initAnimationsProjectile(anims) {
    anims.create({
        key: 'hit-effect',
        frames: anims.generateFrameNumbers('hit-sheet', {start: 0, end: 4}),
        frameRate: 10,
        repeat: 0
    });

    anims.create({
        key: 'fireball',
        frames: [{key: 'fireball-1'}, {key: 'fireball-2'}, {key: 'fireball-3'}],
        frameRate: 5,
        repeat: -1
    });

    anims.create({
        key: 'iceball',
        frames: [{key: 'iceball-1'}, {key: 'iceball-2'}],
        frameRate: 5,
        repeat: -1
    });
}

function initAnimationsMelee(anims) {
    anims.create({
        key: 'sword-default-swing',
        frames: anims.generateFrameNumbers('sword-default', {start: 0, end: 2}),
        frameRate: 20,
        repeat: 0
    });
}

function initAnimationsCollect(anims) {
     anims.create({
        key: 'diamond-shine',
        frames: [
            {key: 'diamond-1'}, {key: 'diamond-2'}, {key: 'diamond-3'},
            {key: 'diamond-4'}, {key: 'diamond-5'}, {key: 'diamond-6'}
        ],
        frameRate: 5,
        repeat: -1
    });
}