import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)

    // Set up the physics for this asteroid.
    game.physics.enable(this, Phaser.Physics.ARCADE)
    this.body.drag.set(100)
    this.body.maxVelocity.set(200)

  }

  update () {
    //this.angle += 15
      //this.x = Math.sin(this.angle)*100;
      //this.y = Math.cos(this.angle)*100;
  }
}