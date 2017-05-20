import Phaser from 'phaser'
import Bullet from '../sprites/Bullet'

const movementSpeed = 500

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)

    // Set up the physics for this ship.
    game.physics.enable(this, Phaser.Physics.ARCADE)
    this.body.drag.set(100)
    this.body.maxVelocity.set(movementSpeed)
    this.fuel = this.fuelMax = 1000000
    this.firerate = 10
  }

  update () {
    if (this.fuelTankIsEmpty()) {
      this.body.acceleration.set(0)
    } else if (game.cursors.up.isDown) {
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
          if (this.firerate < 0) {

              var newBullet = new Bullet({
                  game: game,
                  x: this.body.x + 16,
                  y: this.body.y + 16,
                  asset: 'bullet',
                  rotation: this.rotation
              })
              game.add.existing(newBullet)

              this.firerate = 10;
          }
      }

    this.fuel = Math.max(0, this.fuel - this.body.acceleration.getMagnitudeSq() / 1000)
      this.firerate -= 1
  }

  fuelTankIsEmpty () {
    return this.fuel == 0
  }


}
