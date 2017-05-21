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
    //Static images
    this.load.image('background', 'assets/background/deep-space.jpg')
    this.load.image('ship', 'assets/images/ship.png')
    this.load.image('asteroid', 'assets/images/asteroid.png')
    this.load.image('robot', 'assets/images/ufo.png')
    this.load.image('big-robot', 'assets/images/big_robot.png')
    this.load.image('bullet', 'assets/images/bullet.png')
    this.load.image('bullet', 'assets/images/bullet.png')
    this.load.image('green-bullet', 'assets/images/green-bullet.png')
    this.load.image('fuel','assets/images/gas.png' )
    this.load.image('medpack','assets/images/medpack.png' )
    this.load.image('blackhole', 'assets/images/blackhole.png')
    this.load.image('weapon1','assets/images/weapon1.png' )
    this.load.image('missile','assets/images/missile.png' )

    //Planets
    for (let planet of planets) {
      this.load.image(planet, 'assets/images/planets/' + planet + '.png')
    }

    //Animations
    game.load.spritesheet('kaboom', 'assets/images/explode.png', 128, 128);
    game.load.spritesheet('sun', 'assets/images/sun.png', 426, 426);
    game.load.spritesheet('flag', 'assets/images/flag.png', 278, 202);
    game.load.spritesheet('arrow', 'assets/images/arrow.png', 160, 160);
    game.load.spritesheet('coin', 'assets/images/spinningcoin.png',300,259)

    //Particle effects
    game.load.image('fire1', 'assets/images/particles/fire1.png');
    game.load.image('fire2', 'assets/images/particles/fire1.png');
    game.load.image('fire3', 'assets/images/particles/fire1.png');
    game.load.image('smoke', 'assets/images/particles/smoke-puff.png');

    //Audio
    game.load.audio('laser1', 'assets/audio/laser1.wav')
    game.load.audio('laser2', 'assets/audio/laser2.wav')
    game.load.audio('explosion1', 'assets/audio/explosion1.wav')
    game.load.audio('coin1', 'assets/audio/coin1.wav')
    game.load.audio('spaceWind', 'assets/audio/space-wind.wav')
    game.load.audio('powerupSound', 'assets/audio/powerup.wav')
    game.load.audio('missile1', 'assets/audio/missile.wav')
    game.load.audio('mars', 'assets/audio/music/Mars.wav')
    game.load.audio('venus', 'assets/audio/music/Venus.wav')
    game.load.audio('mercury', 'assets/audio/music/Mercury.wav')
    game.load.audio('map', 'assets/audio/music/Map.wav')
  }

  create () {
    this.state.start('Game')
  }
}