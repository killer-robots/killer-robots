import Phaser from 'phaser'
import Bullet from './Bullet'

const BASE_HEALTH = 1000
const firerateMax = 100

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    game.physics.enable(this, Phaser.Physics.ARCADE)

      this.health = 500
    var baseSpeed = 100
    var speedX = 0
    var speedY = 0
    if (x== 0) {
      speedX = baseSpeed * Math.random()
    } else {
      speedX = -baseSpeed * Math.random()
    }
    if (y == 0) {
      speedY = baseSpeed * Math.random()
    } else {
      speedY = -baseSpeed * Math.random()
    }

    var randomAngle = Math.atan2(speedY, speedX) / (Math.PI / 180)
    this.body.velocity = new Phaser.Point(speedX, speedY)
    this.body.setCircle(10, 0, 0);

    this.anchor.setTo(0.5)
    this.firerate = firerateMax
    this.body.bounce.set(1);

    this.outOfBoundsKill = true;
    this.health = BASE_HEALTH;
    this.alpha = 1;
    this.body.mass = 10
  }

  update () {
    this.body.gravity.set(0, 0) // Reset and recalculate below.
    for (let planet of game.planets) {
      planet.applyGravityTo(this)
    }
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
      console.log("asteroid destroyed!\nAlpha: " + this.alpha + "\nHealth: " +this.health);
      this.destroy();
    }
    else {
      try {
        if (this.playerIsNearby()) {
          // Move towards the player.
          this.body.velocity = Phaser.Point.subtract(this.game.player.body.center, this.body.center)

          // Try to shoot the player.
          if (this.firerate < 0) {
            this.game.laser2.play();
            var newBullet = new Bullet({
              game: this.game,
              x: this.body.center.x,
              y: this.body.center.y,
              asset: 'green-bullet',
              rotation: Phaser.Point.angle(this.game.player.body.center, this.body.center)
            })
            this.game.add.existing(newBullet)
            this.firerate = firerateMax;
          }
        }

        this.firerate -= 1
      } catch(err) {
        //player is likely dead
      }
    }

  }

  playerIsNearby() {
    return this.game.player.body.center.distance(this.body.center) < 200
  }
}
