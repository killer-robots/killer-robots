import Phaser from 'phaser'
import { centerGameObjects } from '../utils'
import { planets } from '../sprites/Planet'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.image('background', 'assets/background/deep-space.jpg')
    this.load.image('ship', 'assets/images/ship.png')
    this.load.image('asteroid', 'assets/images/asteroid.png')
    this.load.image('robot', 'assets/images/ufo.png')
    this.load.image('bullet', 'assets/images/bullet.png')
    game.load.spritesheet('kaboom', 'assets/images/explode.png', 128, 128);
    game.load.spritesheet('sun', 'assets/images/sun.png', 426, 426);
    game.load.spritesheet('flag', 'assets/images/flag.png', 278, 202);
    game.load.spritesheet('arrow', 'assets/images/arrow.png', 160, 160);

    this.load.image('bullet', 'assets/images/bullet.png')
    this.load.image('green-bullet', 'assets/images/green-bullet.png')
    this.load.image('fuel','assets/images/gas.png' )
    this.load.image('medpack','assets/images/medpack.png' )

    for (let planet of planets) {
      this.load.image(planet, 'assets/images/planets/' + planet + '.png')
    }
    this.load.image('blackhole', 'assets/images/blackhole.png')

    game.load.spritesheet('coin', 'assets/images/spinningcoin.png',300,259)

    game.load.audio('laser1', 'assets/audio/laser1.wav')
    game.load.audio('laser2', 'assets/audio/laser2.wav')
    game.load.audio('explosion1', 'assets/audio/explosion1.wav')
    game.load.audio('coin1', 'assets/audio/coin1.wav')
    game.load.audio('spaceWind', 'assets/audio/space-wind.wav')
    game.load.audio('mars', 'assets/audio/music/Mars.wav')
  }

  create () {
    this.state.start('Game')
  }
}
