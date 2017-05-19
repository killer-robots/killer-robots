import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)

    // Set up the physics for this asteroid.
    game.physics.enable(this, Phaser.Physics.ARCADE)
    this.body.drag.set(100)
    this.body.maxVelocity.set(200)
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
  }
}
