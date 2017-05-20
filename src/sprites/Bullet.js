import Phaser from 'phaser'

var bulletTime = 0;

export default class extends Phaser.Sprite {
    constructor ({ game, x, y, asset, rotation }) {
        super(game, x, y, asset)
        this.enableBody = true
        game.physics.enable(this, Phaser.Physics.ARCADE)
        this.anchor.set(0.5)
        bulletTime = game.time.now + 50
        this.lifespan = 2000
        this.body.drag.set(50)
        this.rotation = rotation
        game.physics.arcade.accelerationFromRotation(this.rotation, 520, this.body.velocity)
    }

}