import Phaser from 'phaser'

const movementSpeed = 500

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)

    // Set up the physics for this ship.
    game.physics.enable(this, Phaser.Physics.ARCADE)
    this.body.drag.set(100)
    this.body.maxVelocity.set(movementSpeed)
  }

  update () {
    if (game.cursors.up.isDown) {
      game.physics.arcade.accelerationFromRotation(this.rotation, movementSpeed, this.body.acceleration)
    } else if (game.cursors.down.isDown) {
      game.physics.arcade.accelerationFromRotation(this.rotation, -movementSpeed, this.body.acceleration)
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
