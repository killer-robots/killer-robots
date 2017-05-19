/* globals __DEV__ */
import Phaser from 'phaser'
import Ship from '../sprites/Ship'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    game.physics.startSystem(Phaser.Physics.ARCADE)

    // Set up game input.
    game.cursors = game.input.keyboard.createCursorKeys()
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ])

    this.player = new Ship({
      game: this,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'mushroom'
    })

    this.game.add.existing(this.player)
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.player, 32, 32)
    }
  }
}
