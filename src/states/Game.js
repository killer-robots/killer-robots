/* globals __DEV__ */
import Phaser from 'phaser'
import Asteroid from '../sprites/Asteroid'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    const bannerText = 'Phaser + ES6 + Webpack'
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText)
    banner.font = 'Bangers'
    banner.padding.set(10, 16)
    banner.fontSize = 40
    banner.fill = '#77BFA3'
    banner.smoothed = false
    banner.anchor.setTo(0.5)

    this.asteroid = new Asteroid({
      game: this,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'asteroid'
    })

    this.game.add.existing(this.asteroid)
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.asteroid, 32, 32)
    }
  }
}
