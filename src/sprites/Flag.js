import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({game, x, y, asset}) {
    super(game, x, y, asset)
    game.physics.enable(this, Phaser.Physics.ARCADE)

    this.anchor.setTo(0.5)
    this.scale.setTo(1)
    this.alpha = 0.5;
  }

  update () {

  }
}
