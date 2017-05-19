import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)

    // Set up the physics for this asteroid.
    game.physics.enable(this, Phaser.Physics.ARCADE)
    this.body.allowGravity = false;

    var speedX = 100 - (200 * Math.random());
    var speedY =  100 - (200 * Math.random());
    //var randomAngle = Math.atan2(speedY, speedX)/(Math.PI/180);

    var direction = new Phaser.Point(speedX, speedY);
    //direction.normalize();
    //direction.setMagnitude(speedX * speedY / 10);
    this.body.velocity = direction;
    //this.body.velocity.normalize();
    var randomAngle = Phaser.Math.radToDeg(
        Phaser.Point.angle(
          this.position,
        new Phaser.Point(
          this.x + this.body.velocity.x,
          this.y + this.body.velocity.y)
        )
      );
    this.angle = randomAngle;
    //console.log("Angle: " + randomAngle + ".Radians: " + radians + ". SpeedX: " + speedX + ".  SpeedY: " + speedY);
    console.log("Angle: " + randomAngle + ". SpeedX: " + speedX + ".  SpeedY: " + speedY);
  }

  update () {
    var outOfWorld =  (
      this.position.x > this.world.sizeX ||
      this.position.y > this.world.sizeY ||
      this.position.x < 0 ||
      this.position.Y < 0);

      if (outOfWorld)
      {
        console.log("Destroying asteroid");
        this.destroy();
        console.log("Asteroid destroyed");
      }
      //this.angle += 15
      //this.x = Math.sin(this.angle)*100;
      this.position.y += 1.0;
      this.position.x -= 1.0;

      //this.y = Math.cos(this.angle)*100;
  }
}
