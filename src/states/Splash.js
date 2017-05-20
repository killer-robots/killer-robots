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

    for (let planet of planets) {
      this.load.image(planet, 'assets/images/planets/' + planet + '.png')
    }
  }

  create () {
    this.state.start('Game')
  }
}
