import Phaser from 'phaser'
import Bullet from '../sprites/Bullet'

const movementSpeed = 500
const maxHealth = 100

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
    this.health = maxHealth
    this.score = 0
    this.body.mass = 3
      this.maxFireRate = 300
      this.fireRate = 300
  }

  update () {
      this.fireRate -= 1
      if (this.firerate < 0) {
        if (game.input.keyboard.isDown(Phaser.Keyboard.X)) {
          this.game.missile1.play();
          var missile = new Bullet({
              game: this.game,
              x: this.body.center.x,
              y: this.body.center.y,
              asset: 'missile',
              rotation: this.rotation
          })
          this.game.MissileGroup.add(missile)
          this.firerate = this.maxFireRate;
      }
  }


    if (this.fuelTankIsEmpty()) {
      this.body.acceleration.set(0)
    } else if (game.cursors.up.isDown) {
      game.physics.arcade.accelerationFromRotation(this.rotation, movementSpeed, this.body.acceleration)
    } else if (game.cursors.down.isDown) {
      game.physics.arcade.accelerationFromRotation(this.rotation, -movementSpeed, this.body.acceleration)
    } else {
      this.body.acceleration.set(0)
    }

    if (this.body.acceleration.isZero()) {
      this.game.spaceWind.stop()
    } else if (!this.game.spaceWind.isPlaying) {
      this.game.spaceWind.play()
    }

    if (game.cursors.left.isDown) {
      this.body.angularVelocity = -250
    } else if (game.cursors.right.isDown) {
      this.body.angularVelocity = 250
    } else {
      this.body.angularVelocity = 0
    }

    this.fuel = Math.max(0, this.fuel - this.body.acceleration.getMagnitudeSq() / 500)
      this.firerate -= 1

    this.body.gravity.set(0, 0) // Reset and recalculate below.
    for (let blackHole of game.blackHoles) {
      blackHole.applyGravityTo(this)
    }
    for (let sun of game.suns) {
      sun.applyGravityTo(this)
    }
    for (let planet of game.planets) {
      planet.applyGravityTo(this)
    }

    if (this.health <= 0)
    {
      this.game.makeExplosion(this.x, this.y);
    }
    if (this.alpha == 0 || this.health <= 0 )
    {
      this.destroy();
      console.log("asteroid destroyed!\nAlpha: " +this.alpha + "\nHealth: " +this.health);
    }
  }

  fuelTankIsEmpty () {
    return this.fuel == 0
  }


}
