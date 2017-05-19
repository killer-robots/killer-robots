import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)
  }

  update () {
    //this.angle += 15
      //this.x = Math.sin(this.angle)*100;
      //this.y = Math.cos(this.angle)*100;
  }
}