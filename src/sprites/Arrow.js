import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({game, x, y, asset}) {
    super(game, x, y, asset)

    // Set up the physics for this asteroid.
    game.physics.enable(this, Phaser.Physics.ARCADE)

    this.anchor.setTo(0.2, 0.5);
    this.body.allowRotation = false;
    this.scale.setTo(0.2)
    this.speed = 800;

  }

  update () {

    var cameraBounds = new Phaser.Rectangle(this.game.camera.x, this.game.camera.y,
      this.game.camera.width, this.game.camera.height);

    if (cameraBounds.contains(this.towards.x, this.towards.y))
    {
      this.visible = false;
      this.x = this.towards.x;
      this.y = this.towards.y;
      this.rotation = -this.rotation;

    } else {
      if (!this.visible)
      {
        this.rotation = game.physics.arcade.moveToObject(this, this.towards, this.speed);
      }
      this.visible = true;


        var direction = new Phaser.Point(this.towards.x, this.towards.y);
        direction.subtract(this.x, this.y);
        direction.normalize();
        direction.setMagnitude(this.speed);
        direction.subtract(this.body.velocity.x, this.body.velocity.y);
        direction.normalize();
        direction.setMagnitude(100);
        this.body.velocity.add(direction.x, direction.y);
        this.body.velocity.normalize();
        this.body.velocity.setMagnitude(this.speed);

      this.angle = Phaser.Math.radToDeg(
          Phaser.Point.angle(
            this.position,
            new Phaser.Point(
              this.x + this.body.velocity.x,
              this.y + this.body.velocity.y)
          )
        )

      var arrowBounds = new Phaser.Rectangle(this.game.camera.x+25, this.game.camera.y+75,
        this.game.camera.width-50, this.game.camera.height-100);

      this.x = Phaser.Math.clamp(this.x, arrowBounds.x, arrowBounds.x + arrowBounds.width);
      this.y = Phaser.Math.clamp(this.y, arrowBounds.y, arrowBounds.y + arrowBounds.height);
    }

    //console.log("arrow visible: " + this.visible + ".\narrow x: " + this.x + ". arrow y: " + this.y)
  }


}
