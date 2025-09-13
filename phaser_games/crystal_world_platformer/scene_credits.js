class Credits extends Phaser.Scene {
    
    constructor(config) {
        super('CreditsScene');
        this.config = config;
        this.screenCenter = [config.width / 2, config.height / 2];
        this.lineHeight = 42;
        this.fontOpt = {font:'700 75px Arial', fill: '#713E01'};

        this.credits = [
            {scene: null, text: 'Thank you for playing'},
            {scene: null, text: 'Author: Reza Tahirkheli'}
        ]
    };

    preload() {};
    
    create() {
        this.add.image(0, 0, 'menu-bg')
         .setOrigin(0, 0)
         .setScale(2.7)
        
        const backPos = [this.config.width - 10, this.config.height - 10];
        const backButton =  this.add.image(...backPos, 'back')
         .setOrigin(1, 1)
         .setScale(2)
         .setInteractive()

        backButton.on('pointerup', ()=> {
            this.scene.start('MenuScene')
        });

        this.createCredits(this.credits);
    };
    
    createCredits(credits) {
        let heightSpace = 0;
    
        credits.forEach(item => {
            const creditPos = [this.config.width / 2, heightSpace + this.config.height / 2 ];
            this.add.text(...creditPos, item.text, this.fontOpt)
             .setOrigin(0.5, 1)

            heightSpace += 85;
        })
    }

    update() {};
    
};