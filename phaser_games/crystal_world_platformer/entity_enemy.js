class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x , y, key) {
        super(scene, x, y, key);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.config = scene.config;

        // Mixins
        Object.assign(this, collider);
        Object.assign(this, animsCheck);

        this.init();
        this.initEvents();
    }

    init() {
        this.gravity = 500;
        this.speed = 75;
        this.timeFromLastTurn = 0;
        this.maxPatrolDistance = 250;
        this.currentPatrolDistance = 0;
        
        this.health = 20;
        this.damage = 10;

        this.plateformsCollidersLayer = null;
        this.rayGraphics = this.scene.add.graphics({lineStyle: {width: 2, color: 0xaa00aa}});

        this.body.setGravityY(this.gravity);
        this.setCollideWorldBounds(true);
        this.setImmovable(true);
        this.setOrigin(0.5, 1);
        this.setVelocityX(this.speed);
    }

    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
    }

    update(time, delta) {
        if(this.getBounds().bottom > 600) {
            this.scene.events.removeListener(Phaser.Scenes.Events.UPDATE, this.update, this);
            this.setActive(false);
            this.rayGraphics.clear();
            this.destroy();
            return
        }

        this.patrol(time);
    }

    patrol(time) {
        if(!this.body || !this.body.onFloor()) return

        this.currentPatrolDistance += Math.abs(this.body.deltaX());
        const raycastOpt = {raylength: 30, precision: 0, steepness: 0.3};
        const { ray, hasHit } = this.raycast(this.body, this.plateformsCollidersLayer, raycastOpt);

        let condition1 = !hasHit;
        let condition2 = this.currentPatrolDistance >= this.maxPatrolDistance;
        let condition3 = this.timeFromLastTurn + 1000 < time;

        if((condition1 || condition2) && condition3) {
            this.setFlipX(!this.flipX);
            this.setVelocityX(this.speed = -this.speed);
            this.timeFromLastTurn = time;
            this.currentPatrolDistance = 0;
        }

        if(this.config.debug && ray) {
            this.rayGraphics.clear();
            this.rayGraphics.strokeLineShape(ray);
        }
        
    }

    setPlatformColliders(plateformsCollidersLayer) {
        this.plateformsCollidersLayer = plateformsCollidersLayer;
    }

    takesHit(source) {
        source.deliversHit(this);
        this.health -= source.damage;
        
        if(this.health <= 0) {
            this.setTint(0xff0000);
            this.setVelocity(0, -200);
            this.body.checkCollision.none = true;
            this.setCollideWorldBounds(false);
        }
    }
}