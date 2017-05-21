import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)
    this.scale.setTo(0.5)
    game.physics.enable(this, Phaser.Physics.ARCADE)
    this.gravity = 10
    this.gravityRadius = 50000
    this.eventHorizonRadius = 10000
  }

  update () {
    this.rotation += 0.002
  }

  applyGravityTo(object) {
    if (object !== null && object.body !== null) {
      var distance = new Phaser.Point(this.body.center.x - object.body.center.x, this.body.center.y - object.body.center.y)
      var distMagSq = distance.getMagnitudeSq()
      if (distMagSq < this.gravityRadius) {
        // The object is close enough to be affected by this planet's gravity.
        object.body.gravity.add(distance.x * this.gravity, distance.y * this.gravity)

        if (distMagSq < this.eventHorizonRadius) {
          //console.log("Object past event horizon");
          game.add.tween(object).to({alpha: 0}, 50, Phaser.Easing.Linear.None, true, 0, 0, false)
          object.x = this.x;
          object.y = this.y;
		  object.health = 0;
          object.body.velocity = new Phaser.Point(0, 0);
        }
      }
    }
  }
}
