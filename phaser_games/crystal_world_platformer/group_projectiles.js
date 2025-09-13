class Projectiles extends Phaser.Physics.Arcade.Group {
    constructor(scene, key) {
        super(scene.physics.world, scene);
        
        this.createMultiple({
            frameQuantity: 5,
            active: false,
            visible: false,
            key: key,
            classType: Projectile
        })

        this.timeFromLastProjectile = null;
    }

    fireProjectile(initiator, anims) {
        const projectile = this.getFirstDead(false);
        if(!projectile) return

        let condition = this.timeFromLastProjectile + projectile.cooldown > new Date().getTime();
        if(this.timeFromLastProjectile && condition) return

        const center = initiator.getCenter();
        let centerX;

        if(initiator.lastDirection === Phaser.Physics.Arcade.FACING_RIGHT) {
            projectile.speed = Math.abs(projectile.speed);
            projectile.setFlipX(false);
            centerX = center.x + 10;

        } else {
            projectile.speed = -Math.abs(projectile.speed);
            projectile.setFlipX(true);
            centerX = center.x - 10;
        }

        projectile.fire(centerX, center.y, anims);
        this.timeFromLastProjectile = new Date().getTime();
    }

}