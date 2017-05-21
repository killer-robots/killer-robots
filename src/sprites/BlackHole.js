import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)
    this.scale.setTo(0.5)
    game.physics.enable(this, Phaser.Physics.ARCADE)
    this.gravity = 10
    this.gravityRadius = 50000
  }

  update () {
    this.rotation += 0.002
  }

  applyGravityTo(object) {
    var distance = new Phaser.Point(this.body.center.x - object.body.center.x, this.body.center.y - object.body.center.y)
    if (distance.getMagnitudeSq() < this.gravityRadius) {
      // The object is close enough to be affected by this planet's gravity.
      object.body.gravity.add(distance.x * this.gravity, distance.y * this.gravity)
	  //health drops to zero
	  //console.log('before blackhole')
	  //console.log(object.health)
	  object.health = 0
	  //console.log('after blackhole')
	  //console.log(object.health)
	  //ship fades
	  //console.log('fade in blackhole')
	  //console.log(object.alpha)
	  game.add.tween(object).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, -1, false)
    }
  }
}
