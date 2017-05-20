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
  }

  update() {
    this.addAsteroid();
  }


  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.player, 32, 32)
    }
  }

  addAsteroid() {
    var asteroidRandom = Math.random();
    if (asteroidRandom > 0.90) {
      var xPos = 0;
      var yPos = 0;
      if (asteroidRandom <= 0.925)
      {
        xPos = this.world.width * Math.random();
        yPos = 0;
      }
      else if (asteroidRandom <= 0.95) {
        xPos = this.world.width * Math.random();
        yPos = this.world.height-1;
      }
      else if (asteroidRandom <= 0.975) {
        xPos = 0;
        yPos = this.world.height * Math.random();
      }
      else {
        xPos = this.world.width-1;
        yPos = this.world.height * Math.random();
      }

      var newAsteroid = new Asteroid({
        game: this,
        x: xPos,
        y: yPos,
        asset: 'asteroid'
      })
      this.game.add.existing(newAsteroid);
    }
  }

}
