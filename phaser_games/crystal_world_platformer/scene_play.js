class Play extends Phaser.Scene {
    
    constructor(config) {
        super('PlayScene');
        this.config = config;

        this.spikeImage = null;
        this.skyImage = null;
    }
    
    create({ gameStatus }) {
        this.score = 0;
        this.hud = new Hud(this, 0, 0);
        this.emitter = new EventEmitter();

        this.playBgMusic();
        this.collectSound = this.sound.add('collect', {volume: 0.2});

        const map = this.createMap();

        if(gameStatus !== 'PLAYER_LOSE') {
            if(Object.keys(this.anims.anims.entries).length === 0) { 
                initAnimationsProjectile(this.anims);
                initAnimationsMelee(this.anims);
                initAnimationsBirdman(this.anims);
                initAnimationsSnaky(this.anims);
                initAnimationsCollect(this.anims);
                initAnimationsPlayer(this.anims);
            }
        }

        const layers = this.createLayers(map);
        const playerZones = this.getPlayerZones(layers.playerZones);
        const player = this.createPlayer(playerZones.start);
        const enemies = this.createEnemies(layers.enemySpawns, layers.platformsColliders);
        const collectables = this.createCollectables(layers.collectables);

        this.createPlayerColliders(player, {
            colliders: {
                plateformsColliders: layers.platformsColliders,
                projectiles: enemies.getProjectiles(),
                collectables: collectables,
                traps: layers.traps
            }
        });

        this.createEnemyColliders(enemies, {
            colliders: {
                plateformsColliders: layers.platformsColliders,
                player: player
            }
        });

        this.createBG(map);
        this.createBackButton();
        this.createEndOfLevel(playerZones.end, player);
        this.setupFollowupCameraOn(player);

        // if(gameStatus === 'PLAYER_LOSE') return
        this.createGameEvents();
    }

    playBgMusic() {
        if(this.sound.get('theme')) return

        this.sound.add('theme', {loop: true, volume: 0.1}).play();
    }

    createMap() {
        const currentLevel = this.registry.get('level') || 1;
        const map = this.make.tilemap({key: `level_${currentLevel}`});
        map.addTilesetImage('main_lev_build_1', 'tiles-1');
        return map
    }
    
    createLayers(map) {
        const tileset = map.getTileset('main_lev_build_1');
        const platformsColliders = map.createLayer('layer_colliders', tileset);
        const environment = map.createLayer('distance_layer', tileset);
        map.createLayer('farBg', tileset).setDepth(-2);
        map.createLayer('farBgEnv', tileset).setDepth(-2);
        const platforms = map.createLayer('platforms', tileset);
        const playerZones = map.getObjectLayer('playerZones');
        const enemySpawns = map.getObjectLayer('spawnPoints');
        const collectables = map.getObjectLayer('collectables');
        const traps = map.createLayer('traps', tileset);

        platformsColliders.setCollisionByExclusion(-1, true);
        traps.setCollisionByExclusion(-1, true);
        // platformsColliders.setCollisionByProperty({collides: true});

        return { environment, platforms, platformsColliders, 
            playerZones, enemySpawns, collectables, traps }
    }

    createBG(map) {
        const bgObj = map.getObjectLayer('distance').objects[0];

        this.spikeImage = this.add.tileSprite(bgObj.x, bgObj.y, this.config.width, bgObj.height, 'bg-spikes-dark')
         .setOrigin(0, 0.7)
         .setDepth(-10)
         .setScrollFactor(0, 1)

        this.skyImage = this.add.tileSprite(0, 0, this.config.width, 180, 'sky-play')
         .setOrigin(0, 0)
         .setDepth(-11)
         .setScale(1.6)
         .setScrollFactor(0, 1)
    }

    createBackButton() {
        const backPos = [this.config.rightBottomCorner.x, this.config.rightBottomCorner.y];
        const backButton =  this.add.image(...backPos, 'back')
         .setOrigin(1, 1)
         .setScale(2)
         .setScrollFactor(0)
         .setInteractive()

        backButton.on('pointerup', ()=> {
            this.scene.start('MenuScene')
        });
    }

    createGameEvents() {
        this.emitter.on('PLAYER_LOSE', ()=>{
            console.log('you loser')
            this.scene.restart({gameStatus: 'PLAYER_LOSE'})
        })
    }

    createCollectables(collectableLayer) {
        // const collectables = this.physics.add.staticGroup();
        // layer.objects.forEach(obj => collectables.add(new Collectable(this, obj.x, obj.y, 'diamond')));

        const collectables = new Collectables(this);

        collectables.addFromLayer(collectableLayer);
        collectables.playAnimation('diamond-shine');
        collectables.setDepth(-1);

        return collectables
    }

    createPlayer(start) {
        return new Player(this, start.x, start.y);
    }

    createEnemies(spawnLayer, plateformsColliders) {
        const enemies = new Enemies(this);
        const enemyTypes = enemies.getTypes();

        spawnLayer.objects.forEach(spawnPoint => {
            const enemyObj = enemyTypes[spawnPoint.type];
            const enemy = new enemyObj(this, spawnPoint.x, spawnPoint.y);
            enemy.setPlatformColliders(plateformsColliders);
            enemies.add(enemy);
        });

        return enemies
    }

    onPlayerCollision(enemy, player) {
        console.log('ouch!');
        player.takesHit(enemy);
    }

    onHit(entity, source) {
        console.log('boom');
        entity.takesHit(source)
    }

    onCollect(entity, collectable) {
        this.collectSound.play();
        this.score += collectable.score;
        this.hud.updateScoreboard(this.score);
        collectable.disableBody(true, true); // disable gameObj, hide gameObj 
    }

    createPlayerColliders(player, { colliders }) {
        player
         .addCollider(colliders.plateformsColliders)
         .addCollider(colliders.projectiles, this.onHit)
         .addCollider(colliders.traps, this.onHit)
         .addOverlap(colliders.collectables, this.onCollect, this)
    }

    createEnemyColliders(enemies, { colliders }) {
        enemies
         .addCollider(colliders.plateformsColliders)
         .addCollider(colliders.player, this.onPlayerCollision)
         .addCollider(colliders.player.projectiles, this.onHit)
         .addOverlap(colliders.player.meleeWeapon, this.onHit)
    }

    setupFollowupCameraOn(player){
        const { width, height, mapOffSet, zoomFactor } = this.config;
        this.physics.world.setBounds(0, 0, width + mapOffSet, height);
        this.cameras.main.setBounds(0, 0, width + mapOffSet, height).setZoom(zoomFactor);
        this.cameras.main.startFollow(player);
    }

    getPlayerZones(playerZonesLayer) {
        const playerZones = playerZonesLayer.objects;
        return {
            start: playerZones.find(zone => zone.name === 'startZone'), 
            end: playerZones.find(zone => zone.name === 'finishZone')
        }
    }

    createEndOfLevel(end, player) {
        const endOfLevel = this.physics.add.sprite(end.x + 50, end.y, 'end')
         .setOrigin(0.5, 1)
         .setAlpha(0)
         .setSize(5, 200);
        
        const eolOverlap = this.physics.add.overlap(player, endOfLevel, ()=>{
            eolOverlap.active = false;
            console.log('END OF LEVEL');
            
            if(this.registry.get('level') === this.config.lastLevel) {
                this.scene.start('CreditsScene');
                return
            }

            this.registry.inc('level', 1);
            this.registry.inc('unlocked-levels', 1);
            this.scene.restart({gameStatus: 'LEVEL_COMPLETED'});
        })
    }

    update() {
        this.spikeImage.tilePositionX = this.cameras.main.scrollX  * 0.3;
        this.skyImage.tilePositionX = this.cameras.main.scrollX  * 0.1;
    }
}   
