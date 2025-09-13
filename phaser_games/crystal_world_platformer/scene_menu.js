class Menu extends Phaser.Scene {
    
    constructor(config) {
        super('MenuScene');
        this.config = config;
        this.screenCenter = [config.width / 2, config.height / 2];
        this.lineHeight = 42;
        this.fontOpt = {font:'700 75px Arial', fill: '#713E01'};

        this.menu = [
            {scene: 'PlayScene', text: 'Play'},
            {scene: 'LevelScene', text: 'Levels'},
            {scene: null, text: 'Exit'}
        ]
    };

    preload() {};
    
    create() {
        this.add.image(0, 0, 'menu-bg')
         .setOrigin(0, 0)
         .setScale(2.7)

        this.createMenu(this.menu);
    };
    
    createMenu(menu) {
        let heightSpace = 0;
    
        menu.forEach(item => {
            const menuPos = [this.config.width / 2, heightSpace + this.config.height / 2 ];
            let menuItem = this.add.text(...menuPos, item.text, this.fontOpt)
             .setOrigin(0.5, 1)
             .setInteractive()

            menuItem.on('pointerover', ()=>menuItem.setStyle({fill: '#FF0'}));
            menuItem.on('pointerout', ()=>menuItem.setStyle({fill: '#713E01'}));
            
            menuItem.on('pointerup', ()=>{
                if(item.text === 'Play') this.scene.start('PlayScene');
                else if(item.text === 'Levels') this.scene.start('LevelScene');
                else if(item.text === 'Exit') this.game.destroy(true);
            })

            heightSpace += 85;
        })
    }

    update() {};
    
};