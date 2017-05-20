/* globals __DEV__ */
import Phaser from 'phaser'
import Ship from '../sprites/Ship'
import Asteroid from '../sprites/Asteroid'
import Planet, { planets } from '../sprites/Planet'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    //Setup physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Set up game input.
    game.cursors = game.input.keyboard.createCursorKeys()
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ])

    var worldWidth = 2000;
    var worldHeight = 2000;

    this.background = new Phaser.TileSprite(game, 0, 0, worldWidth, worldHeight, 'background')

    this.world.setBounds(0,0,worldWidth,worldHeight);
    this.player = new Ship({
      game: this,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'ship'
    })

    this.player.body.collideWorldBounds = true;
    this.camera.follow(this.player);

    this.game.add.existing(this.background)
    this.addPlanets()
    this.game.add.existing(this.player);


    this.fuelText = game.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET2, 10, 1, 0)
    var fuelTextImage = game.add.image(5, 5, this.fuelText)
    fuelTextImage.tint = 0xFF7766
    fuelTextImage.fixedToCamera = true

    this.asteroids = game.add.physicsGroup();
    this.robots = game.add.physicsGroup();
    this.explosions = game.add.group();
    this.explosions.createMultiple(10, 'kaboom');
    this.explosions.forEach(this.setupExplosion, this);


  }
  setupExplosion(explosion) {
    explosion.anchor.x = 0.5;
    explosion.anchor.y = 0.5;
    explosion.animations.add('kaboom');
  }

  update() {
    this.addAsteroid();
    this.addRobot();

      if (game.physics.arcade.collide(this.player, this.asteroids, this.collisionHandler, this.processHandler, this))
      {
          console.log('boom');
      }

  }

  processHandler (player, asteroids) {
    return true;
  }

  collisionHandler (player, asteroid) {
    this.player.health -= player.maxHealth/10;
    var explosion = this.explosions.getFirstExists(false);
    explosion.reset(asteroid.body.x, asteroid.body.y);
    asteroid.destroy();
    explosion.play('kaboom', 30, false, true);
  }


  addPlanets() {
    const planetDensity = 0.000004
    const planetCount = this.world.width * this.world.height * planetDensity
    this.game.planets = []

    for (var i = 0; i < planetCount; i++) {
      var planet = new Planet({
        game: this,
        x: this.world.randomX,
        y: this.world.randomY,
        asset: Phaser.ArrayUtils.getRandomItem(planets)
      })
      this.game.planets.push(planet)
      this.game.add.existing(planet)
    }
  }

  getRandomBorderSpawnPosition(randomValue, randomChance) {
    var xPos = 0;
    var yPos = 0;
    if (randomValue <= randomChance / 4)
    {
      xPos = this.world.width * Math.random();
      yPos = 0;
    }
    else if (randomValue <= randomChance / 2) {
      xPos = this.world.width * Math.random();
      yPos = this.world.height-1;
    }
    else if (randomValue <= (randomChance*3) /4 ) {
      xPos = 0;
      yPos = this.world.height * Math.random();
    }
    else {
      xPos = this.world.width-1;
      yPos = this.world.height * Math.random();
    }

    return new Phaser.Point(xPos, yPos);
  }

  getInitialBorderSpawnVelocity(pos) {
      var baseSpeed = 100
      var speedX = 0
      var speedY = 0
      if (pos.x == 0) {
        speedX = baseSpeed * Math.random()
      } else {
        speedX = -baseSpeed * Math.random()
      }
      if (pos.y == 0) {
        speedY = baseSpeed * Math.random()
      } else {
        speedY = -baseSpeed * Math.random()
      }

      var randomAngle = Math.atan2(speedY, speedX) / (Math.PI / 180)

      return new Phaser.Point(speedX, speedY)
  }

  addAsteroid() {
    var chanceOfAsteroid = 0.1;

    var asteroidRandom = Math.random();
    if (asteroidRandom < chanceOfAsteroid) {
      var pos = this.getRandomBorderSpawnPosition(asteroidRandom, chanceOfAsteroid);
      var newAsteroid =  this.asteroids.create(pos.x, pos.y, 'asteroid', 0);
      newAsteroid.body.velocity = this.getInitialBorderSpawnVelocity(pos);

      var randomAngle = 45 + Phaser.Math.radToDeg(
          Phaser.Point.angle(
            newAsteroid.position,
            new Phaser.Point(
              newAsteroid.x + newAsteroid.body.velocity.x,
              newAsteroid.y + newAsteroid.body.velocity.y)
          )
        )
      newAsteroid.body.setCircle(10, 5, 5);
      newAsteroid.anchor.x = 0.5;
      newAsteroid.anchor.y = 0.5;
      newAsteroid.angle = randomAngle;
      newAsteroid.outOfBoundsKill = true;
    }
  }

  addRobot() {
    var chanceOfRobot = 0.1;

    var robotRandom = Math.random();
    if (robotRandom < chanceOfRobot) {
      var pos = this.getRandomBorderSpawnPosition(robotRandom, chanceOfRobot);
      var newRobot = this.robots.create(pos.x, pos.y, 'robot', 0);
      newRobot.body.velocity = this.getInitialBorderSpawnVelocity(pos);
      newRobot.outOfBoundsKill = true;
    }
  }
}
