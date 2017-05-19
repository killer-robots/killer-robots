/* globals __DEV__ */
import Phaser from 'phaser'
import Ship from '../sprites/Ship'
import Asteroid from '../sprites/Asteroid'

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
      asset: 'ship'
    })

    this.game.add.existing(this.player);
    //this.game.add.existing(this.asteroid);
  }
  update() {
    var asteroidRandom = Math.random();
    if (asteroidRandom > 0.9) {
      var xRandom = Math.random();
      var yRandom = Math.random();
      var newAsteroid = new Asteroid({
          game: this,
          x: this.world.centerX - 50 + (500 * xRandom),
          y: this.world.centerY- 50 + (100 * yRandom),
          asset: 'asteroid'
        })
      newAsteroid.angle = (xRandom + yRandom) * 20;
      this.game.add.existing(newAsteroid);
    }
  }


  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.player, 32, 32)
    }
  }
}
