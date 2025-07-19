class ScoreScene extends Phaser.Scene {
    
    constructor(config) {
        super('ScoreScene');
        this.config = config;
        this.centerScreen = [this.config.width / 2, this.config.height / 2 ];
        this.fontOpt = {fontSize: '32px', fill: '#FFF'};

    };

    preload() {};
    
    create() {
        this.add.image(0, 0, 'sky').setOrigin(0, 0);
        const bestScoreText = localStorage.getItem('bestScore');
        this.add.text(...this.centerScreen, `Score: ${bestScoreText || 0}`, this.fontOpt).setOrigin(0.5,1);
        const backButton = this.add.image(this.config.width - 10, this.config.height - 10, 'back')
            .setOrigin(1, 1)
            .setScale(2)
            .setInteractive();
            
        backButton.on('pointerup', ()=>this.scene.start('MenuScene'))
    };

    update() {};
    
};