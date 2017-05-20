import Phaser from 'phaser'
import Ship from '../sprites/Ship'
import Asteroid from '../sprites/Asteroid'
import Robot from '../sprites/Robot'
import Planet, { planets } from '../sprites/Planet'
import Coin from '../sprites/Coin'
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
    game.camera.follow(this.player);

    this.player.body.collideWorldBounds = true;
    this.camera.follow(this.player);

    this.game.add.existing(this.background)
    this.addPlanets()
    this.game.add.existing(this.player);

    this.fuelText = game.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET2, 10, 1, 0)
    var fuelTextImage = game.add.image(5, 5, this.fuelText)
    fuelTextImage.tint = 0xFF7766
    fuelTextImage.fixedToCamera = true

    this.healthText = game.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET2, 10, 1, 0)
    var healthTextImage = game.add.image(380, 5, this.healthText)
    healthTextImage.tint = 0x28bb35
    healthTextImage.fixedToCamera = true

    this.asteroids = game.add.physicsGroup();
    this.robots = [];
    this.explosions = game.add.group();
    this.explosions.createMultiple(30, 'kaboom');
    this.explosions.forEach(this.setupExplosion, this);

    // Set up a weapon
    this.weapon = game.add.weapon(50, 'bullet')
    this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.weapon.bulletSpeed = 700;
    this.weapon.fireRate = 100;
    this.weapon.trackSprite(this.player, 0, 0, true);

    this.CoinGroup = this.game.add.physicsGroup();
  }

  setupExplosion(explosion) {
    explosion.anchor.x = 0.5;
    explosion.anchor.y = 0.5;
    explosion.animations.add('kaboom');
  }

  processHandler (player, asteroids) {
    return true;
  }

  update() {
    this.addAsteroid();
    this.addRobot();
    this.robots.forEach(robot => {
      if (robot.exists) {
        robot.update()
      }
    })
	  this.addCoin();

    if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      console.log('b');
      this.weapon.fire();
    }

    if (game.physics.arcade.collide(this.player, this.asteroids, this.playerCollideAsteroid, null, this)) {
      console.log("Player got a coin!");
    }
    if (game.physics.arcade.overlap(this.player, this.CoinGroup, this.playerCollideCoin, null, this)) {
      console.log("Player got a coin!");
    }
    if (game.physics.arcade.collide(this.player.bullet, this.asteroids, this.bulletCollideAsteroidHandler, this.processHandler, this)) {
      console.log('Player shot an asteroid');
    }
    if (game.physics.arcade.collideGroupVsSelf(this.asteroids, this.asteroidCollideAsteroidHandler,  this.processHandler, this))
    {
      console.log('asteroid hit asteroid!');
    }
    game.physics.arcade.collide(this.player, this.robots, this.collisionHandler, this.processHandler, this)
    game.physics.arcade.collide(this.player.bullet, this.robots, this.collisionHandler, this.processHandler, this)
  }

  asteroidCollideAsteroidHandler (asteroid1, asteroid2) {
    var explosion = this.explosions.getFirstExists(false);
    explosion.reset((asteroid1.body.x + asteroid2.body.x) / 2,
      (asteroid1.body.y + asteroid2.body.y) / 2);
    asteroid1.destroy();
    asteroid2.destroy();
    explosion.play('kaboom', 30, false, true);
  }

  bulletCollideAsteroidHandler (bullet, asteroid) {
    var explosion = this.explosions.getFirstExists(false);
    if (!explosion) return;
    explosion.reset(object.body.x, object.body.y);
    object.destroy();
    explosion.play('kaboom', 30, false, true);
  }

  playerCollideAsteroid (player, asteroid) {
    this.player.health -= player.maxHealth/10;
    if (this.player.health <= 0) {
      //TODO:  Kill player and explode ship
    }

    var explosion = this.explosions.getFirstExists(false);
    explosion.reset(asteroid.body.x, asteroid.body.y);
    asteroid.destroy();
    explosion.play('kaboom', 30, false, true);
  }

  playerCollideCoin (player, coin) {
    //  If the ship collides with a coin it gets eaten :)
    coin.kill();
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

  addAsteroid() {
    var chanceOfAsteroid = 0.1;

    var asteroidRandom = Math.random();
    if (asteroidRandom < chanceOfAsteroid) {
      var xPos = 0;
      var yPos = 0;
      if (asteroidRandom <= chanceOfAsteroid / 4)
      {
        xPos = this.world.width * Math.random();
        yPos = 0;
      }
      else if (asteroidRandom <= chanceOfAsteroid / 2) {
        xPos = this.world.width * Math.random();
        yPos = this.world.height-1;
      }
      else if (asteroidRandom <= (chanceOfAsteroid*3) /4 ) {
        xPos = 0;
        yPos = this.world.height * Math.random();
      }
      else {
        xPos = this.world.width-1;
        yPos = this.world.height * Math.random();
      }

      var newAsteroid =  this.asteroids.create(xPos, yPos, 'asteroid', 0);

      var baseSpeed = 100
      var speedX = 0
      var speedY = 0
      if (xPos== 0) {
        speedX = baseSpeed * Math.random()
      } else {
        speedX = -baseSpeed * Math.random()
      }
      if (yPos == 0) {
        speedY = baseSpeed * Math.random()
      } else {
        speedY = -baseSpeed * Math.random()
      }

      var randomAngle = Math.atan2(speedY, speedX) / (Math.PI / 180)

      var direction = new Phaser.Point(speedX, speedY)
      newAsteroid.body.velocity = direction

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
    var chanceOfAsteroid = 0.1;

    var asteroidRandom = Math.random();
    if (asteroidRandom < chanceOfAsteroid) {
      var xPos = 0;
      var yPos = 0;
      if (asteroidRandom <= chanceOfAsteroid / 4)
      {
        xPos = this.world.width * Math.random();
        yPos = 0;
      }
      else if (asteroidRandom <= chanceOfAsteroid / 2) {
        xPos = this.world.width * Math.random();
        yPos = this.world.height-1;
      }
      else if (asteroidRandom <= (chanceOfAsteroid*3) /4 ) {
        xPos = 0;
        yPos = this.world.height * Math.random();
      }
      else {
        xPos = this.world.width-1;
        yPos = this.world.height * Math.random();
      }

      var newRobot = new Robot({ game: this, x: xPos, y: yPos, asset: 'robot' });
      this.robots.push(newRobot);
      game.add.existing(newRobot);

      var baseSpeed = 100
      var speedX = 0
      var speedY = 0
      if (xPos== 0) {
        speedX = baseSpeed * Math.random()
      } else {
        speedX = -baseSpeed * Math.random()
      }
      if (yPos == 0) {
        speedY = baseSpeed * Math.random()
      } else {
        speedY = -baseSpeed * Math.random()
      }

      var randomAngle = Math.atan2(speedY, speedX) / (Math.PI / 180)

      var direction = new Phaser.Point(speedX, speedY)
      newRobot.body.velocity = direction

      newRobot.outOfBoundsKill = true;
    }
  }

  render () {
    var x = 32
    var y = 32

    this.fuelText.text = 'fuel:' + Math.round(this.player.fuel / this.player.fuelMax * 100) + '%'
    this.healthText.text = 'shields:' + Math.round(this.player.health / this.player.maxHealth * 100) + '%'
  }

  addCoin() {
    var chanceOfCoin = 0.05;

    var coinRandom = Math.random();
    if (coinRandom < chanceOfCoin) {
      var xPos = Math.random();
      var yPos = Math.random();
      xPos = this.world.width * Math.random();
      yPos = this.world.width * Math.random();
	    var newCoin = this.CoinGroup.create(xPos, yPos,'coin');
	    newCoin.width =32;
	    newCoin.height =32;
      newCoin.animations.add('coin');

      //  And this starts the animation playing by using its key ("run")
      //  15 is the frame rate (15fps)
      //  true means it will loop when it finishes
	    newCoin.body.setCircle(10,5,5);//(radius,xoffset,yoffset);
      newCoin.play('coin', 10, true, false);
    }
  }
}
