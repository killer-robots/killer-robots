import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)

    // Set up the physics for this ship.
    game.physics.enable(this, Phaser.Physics.ARCADE)
    this.body.drag.set(100)
    this.body.maxVelocity.set(200)
  }

  update () {
    if (game.cursors.up.isDown) {
      game.physics.arcade.accelerationFromRotation(this.rotation, 2000, this.body.acceleration)
    } else {
      this.body.acceleration.set(0)
    }

    if (game.cursors.left.isDown) {
      this.body.angularVelocity = -300
    } else if (game.cursors.right.isDown) {
      this.body.angularVelocity = 300
    } else {
      this.body.angularVelocity = 0
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      // shoot
    }
  }
}
