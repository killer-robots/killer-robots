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
    
    this.background = new Phaser.TileSprite(game, 0, 0, 800, 600, 'background')
    this.player = new Ship({
      game: this,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'ship'
    })

    this.game.add.existing(this.background)
    this.game.add.existing(this.player)
  }

  render () {
    var x = 32
    var y = 32

    // TODO: Use a proper font for this, not 'game.debug'.
    this.game.debug.start(x, y);
    this.game.debug.line('fuel: ' + Math.round(this.player.fuel / this.player.fuelMax * 100) + '%');
    this.game.debug.stop();
  }
}
