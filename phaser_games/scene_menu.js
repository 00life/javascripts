class MenuScene extends Phaser.Scene {
    
    constructor(config) {
        super('MenuScene');
        this.config = config;
        this.fontOpt = {fontSize: '32px', fill: '#FFF'};

        this.menu = [
            {scene: 'PlayScene', text: 'Play'},
            {scene: 'ScoreScene', text: 'Score'},
            {scene: null, text: 'Exit'}
        ]
    };

    preload() {};
    
    create() {
        this.add.image(0, 0, 'sky').setOrigin(0, 0);

        fn01_createMenu(this);
    };

    update() {};
    
};