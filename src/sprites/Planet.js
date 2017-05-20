import Phaser from 'phaser'

export const planets = ['jupiter', 'mars', 'mercure', 'neptune', 'saturne', 'soleil', 'terre', 'uranus', 'venus']

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)
    game.physics.enable(this, Phaser.Physics.ARCADE)
    this.gravity = 5
    this.gravityRadius = 10000
  }

  update () {
  }

  applyGravityTo(object) {
    var distance = new Phaser.Point(this.body.x - object.body.x, this.body.y - object.body.y)
    if (distance.getMagnitudeSq() < this.gravityRadius) {
      // The object is close enough to be affected by this planet's gravity.
      object.body.gravity.add(distance.x * this.gravity, distance.y * this.gravity)
    }
  }
}
