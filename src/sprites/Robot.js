import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)
    game.physics.enable(this, Phaser.Physics.ARCADE)
  }

  update () {
    this.body.gravity.set(0, 0) // Reset and recalculate below.
    for (let planet of game.planets) {
      planet.applyGravityTo(this)
    }
  }
}
