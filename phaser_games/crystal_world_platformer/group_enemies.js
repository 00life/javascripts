class Enemies extends Phaser.GameObjects.Group {
    constructor(scene) {
        super(scene);
        Object.assign(this, collider);
    }

    getProjectiles() {
        const projectiles = new Phaser.GameObjects.Group();

        this.getChildren().forEach(enemy => {
            enemy.projectiles && projectiles.addMultiple(enemy.projectiles.getChildren())
        });

        return projectiles
    }

    getTypes() {
        return { Birdman, Snaky }
    }
}


class Birdman extends Enemy {
    constructor(scene, x , y) {
        super(scene, x, y, 'birdman');
    }

    init() {
        super.init();
        this.setSize(20, 45);
        this.setOffset(7, 20);
    }

    update(time, delta) {
        super.update(time, delta);

        if(!this.active || this.isPlayingAnims('birdman-hurt')) return

        this.play('birdman-idle', true);
    }

    takesHit(source) {
        super.takesHit(source);
        this.play('birdman-hurt', true);
    }
}


class Snaky extends Enemy {
    constructor(scene, x , y) {
        super(scene, x, y, 'snaky');
    }

    init() {
        super.init();
        this.speed = 50;

        this.projectiles = new Projectiles(this.scene, 'fireball-1');
        this.timeFromLastAttack = 0;
        this.attackDelay = Phaser.Math.Between(1000, 4000);

        this.setSize(12, 45);
        this.setOffset(10, 15);
    }

    update(time, delta) {
        super.update(time, delta);

        if(!this.active) return

        if(this.body.velocity.x > 0) {
            this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT
        } else Phaser.Physics.Arcade.FACING_LEFT;
        
        if(this.timeFromLastAttack + this.attackDelay <= time) {
            this.projectiles.fireProjectile(this, 'fireball')
            this.timeFromLastAttack = time;
            this.attackDelay = Phaser.Math.Between(1000, 4000);
            this.lastDirection = null;
        }

        if(!this.active) return
        if(this.isPlayingAnims('snaky-hurt')) return

        this.play('snaky-walk', true);
    }

    takesHit(source) {
        super.takesHit(source);
        this.play('snaky-hurt', true);
    }
}
