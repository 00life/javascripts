class PauseScene extends Phaser.Scene {
    
    constructor(config) {
        super('PauseScene');
        this.config = config;
        this.fontOpt = {fontSize: '32px', fill: '#FFF'};

        this.menu = [
            {scene: 'PlayScene', text: 'Continue'},
            {scene: 'MenuScene', text: 'Menu'}
        ]
    };

    preload() {};
    
    create() {
        this.add.image(0, 0, 'sky').setOrigin(0, 0);
        fn01_createMenu(this);
    };

    update() {};
    
};