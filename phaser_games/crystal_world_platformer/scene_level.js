class Level extends Phaser.Scene {
    
    constructor(config) {
        super('LevelScene');
        this.config = config;
        this.screenCenter = [config.width / 2, config.height / 2];
        this.lineHeight = 42;
        this.fontOpt = {font:'700 75px Arial', fill: '#713E01'};
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
        
        const unlock = this.registry.get('unlocked-levels');
        this.level = [];
        
        for(let i=1; i <= unlock; i++) {
            this.level.push({scene: 'PlayScene', text: `Level ${i}`, level: i});
        }

        this.createLevelMenu(this.level);
    };
    
    createLevelMenu(level) {
        let heightSpace = 0;
    
        level.forEach(item => {
            const levelPos = [this.config.width / 2, heightSpace + this.config.height / 2 ];
            let levelItem = this.add.text(...levelPos, item.text, this.fontOpt)
             .setOrigin(0.5, 1)
             .setInteractive()

            levelItem.on('pointerover', ()=>levelItem.setStyle({fill: '#FF0'}));
            levelItem.on('pointerout', ()=>levelItem.setStyle({fill: '#713E01'}));
            
            levelItem.on('pointerup', ()=>{
                this.registry.set('level', item.level);
                this.scene.start('PlayScene');
            })

            heightSpace += 85;
        })
    }

    update() {};
    
};