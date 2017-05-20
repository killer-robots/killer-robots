import Phaser from 'phaser'

export const planets = ['jupiter', 'mars', 'mercure', 'neptune', 'saturne', 'soleil', 'terre', 'uranus', 'venus']

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)
    game.physics.enable(this, Phaser.Physics.ARCADE)
  }

  update () {
  }
}
