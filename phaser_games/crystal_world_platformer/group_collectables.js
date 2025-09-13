class Collectables extends Phaser.Physics.Arcade.StaticGroup {
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createFromConfig({
            classType: Collectable
        })
    }

    mapProperties(propertiesList) {
        if(!propertiesList || propertiesList.length === 0) return {}

        return propertiesList.reduce((map, obj) => {
            map[obj.name] = obj.value;
            return map
        }, {})
    }

    addFromLayer(layer) {
        const { score: defaultScore, type } = this.mapProperties(layer.properties);
        layer.objects.forEach(obj => {
            const collectable = this.get(obj.x, obj.y, type);
            const props = this.mapProperties(obj.properties);
            collectable.score = props.score || defaultScore;
        })
    }
}