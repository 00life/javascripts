class Hud extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);

        scene.add.existing(this);

        const { rightTopCorner } = scene.config;
        this.setPosition(rightTopCorner.x - 75, rightTopCorner.y + 5);
        this.setScrollFactor(0);

        this.setupList();
    }

    setupList() {
        const title =  this.scene.add.text(0, 0, 'Score:', {fontSize:'20px', fill:'#fff'});
        const scoreBoard = this.createScoreboard();

        this.add([title, scoreBoard]);

        let lineHeight = 0;
        this.list.forEach(item => {
            item.setPosition(item.x, item.y + lineHeight);
            lineHeight += 20; 
        })
    }

    createScoreboard() {
        const graphicOpts = {fontSize:'20px', fill:'#fff'};
        const scoreText = this.scene.add.text(0, 0, '0', graphicOpts);
        const scoreImage = this.scene.add.image(scoreText.width + 5, 0, 'diamond');
        
        scoreImage
        .setOrigin(0, 0)
        .setScale(1.3)

        const scoreBoard = this.scene.add.container(0, 0, [scoreText, scoreImage]);
        scoreBoard.setName('scoreBoard')

        return scoreBoard
    }

    updateScoreboard(score) {
        const [ scoreText, scoreImage ] = this.getByName('scoreBoard').list;
        scoreText.setText(score);
        scoreImage.setX(scoreText.width + 5);
    }
}