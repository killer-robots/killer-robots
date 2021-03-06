import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({game, x, y, asset}) {
    super(game, x, y, asset)

    // Set up the physics for this asteroid.
    game.physics.enable(this, Phaser.Physics.ARCADE)

    var baseSpeed = 100
    var speedX = 0
    var speedY = 0
    if (this.x== 0) {
      speedX = baseSpeed * Math.random()
    } else {
      speedX = -baseSpeed * Math.random()
    }
    if (this.y == 0) {
      speedY = baseSpeed * Math.random()
    } else {
      speedY = -baseSpeed * Math.random()
    }

    var randomAngle = Math.atan2(speedY, speedX) / (Math.PI / 180)

    var direction = new Phaser.Point(speedX, speedY)
    this.body.velocity = direction

    var randomAngle = 45 + Phaser.Math.radToDeg(
        Phaser.Point.angle(
          this.position,
          new Phaser.Point(
            this.x + this.body.velocity.x,
            this.y + this.body.velocity.y)
        )
      )
    this.body.setCircle(10, 5, 5);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.angle = randomAngle;
    this.outOfBoundsKill = true;

    this.health = 100;
    this.alpha = 1;

    this.body.mass = 5
  }

  update () {
    for (let blackHole of game.blackHoles) {
      blackHole.applyGravityTo(this)
    }
    for (let sun of game.suns) {
      sun.applyGravityTo(this)
    }
    if (this.health <= 0)
    {
      this.game.makeExplosion(this.x, this.y);
    }
    if (this.alpha == 0 || this.health <= 0 )
    {
      this.destroy();
      console.log("asteroid destroyed!\nAlpha: " +this.alpha + "\nHealth: " +this.health);
    }
  }

}
