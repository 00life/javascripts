const PIPES_TO_RENDER = 4;
const PIPE_VELOCITY = 200;
const FLAP_VELOCITY = 300;

class PlayScene extends Phaser.Scene {
    
    constructor(config) {
        super('PlayScene');
        this.config = config;
        this.bird = null;
        this.pipes = null;
        this.score = 0;
        this.scoreText = '';
        this.isPaused = false;
        this.currentDifficulty = 'easy';
        this.difficulties = {
            'easy': {
                PIPE_GAP_RANGE : [300, 350],
                BTW_PIPE_RANGE : [150, 200]
            },
            'normal': {
                PIPE_GAP_RANGE : [200, 250],
                BTW_PIPE_RANGE : [140, 190]
            },
            'hard': {
                PIPE_GAP_RANGE : [100, 150],
                BTW_PIPE_RANGE : [120, 170]
            }
        }
    };

    preload() {};
    
    create() {
        this.currentDifficulty = 'easy';
        this.add.image(0, 0, 'sky').setOrigin(0, 0);
        this.bird = this.physics.add.sprite(0, 0, 'bird')
            .setFlipX(true)
            .setScale(3)
            .setOrigin(0, 0);

        this.bird.setBodySize(this.bird.width, this.bird.height - 8);
        this.bird.x = this.config.startPosition.x;
        this.bird.y = this.config.startPosition.y;
        this.bird.setImmovable(true).setCollideWorldBounds(true);
        this.pipes = this.physics.add.group();

        for(let i=0; i<PIPES_TO_RENDER; i++){

            const upperpipe = this.pipes.create(0, 0, 'pipe')
                .setImmovable(true)
                .setOrigin(0, 1);
            const lowerpipe = this.pipes.create(0, 0, 'pipe')
                .setImmovable(true)
                .setOrigin(0, 0);

            fn01_placePipe(upperpipe, lowerpipe, this.pipes, this);
        };

        this.pipes.setVelocityX(- PIPE_VELOCITY);
        fn01_inputControls(this);
        fn01_createColliders(this);
        fn01_createScore(this);
        fn01_createPause(this);
        fn01_listenToEvents(this);

        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('bird', {start:8, end:15}),
            // default 24fps
            frameRate: 8,
            // repeat infinitely
            repeat: -1
        });
        
        this.bird.play('fly');
    };

    update() {
        fn01_youlose(this);
        fn01_recyclePipes(this.pipes, this);
    };
    
};