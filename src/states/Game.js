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
    var fuelTextImage = game.add.image(362, 35, this.fuelText)
    fuelTextImage.tint = 0xFF7766
    fuelTextImage.fixedToCamera = true

    this.healthText = game.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET2, 10, 1, 0)
    var healthTextImage = game.add.image(362, 5, this.healthText)
    healthTextImage.tint = 0x28bb35
    healthTextImage.fixedToCamera = true

      this.scoreText = game.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET2, 10, 1, 0)
      var scoreTextImage = game.add.image(5, 5, this.scoreText)
      scoreTextImage.tint = 0xFFD700
      scoreTextImage.fixedToCamera = true

    this.asteroids = game.add.physicsGroup();
    this.robots = game.add.physicsGroup();

    // Set up a weapon
    this.weapon = game.add.weapon(50, 'bullet')
      this.weapon.bulletLifespan = 500;
    this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    this.weapon.bulletSpeed = 700;
    this.weapon.fireRate = 100;
    this.weapon.trackSprite(this.player, 0, 0, true);

    this.CoinGroup = this.game.add.physicsGroup();
    this.FuelGroup = this.game.add.physicsGroup();
    this.MedpackGroup = this.game.add.physicsGroup();

    this.barGraphics = game.add.graphics(0, 0)
    this.barGraphics.fixedToCamera = true

    // Audio
    this.laser1 = game.add.audio('laser1');
    this.laser2 = game.add.audio('laser2');
    this.explosion1 = game.add.audio('explosion1');
    this.coin1 = game.add.audio('coin1');
    this.fuel1 = game.add.audio('fuel1');
      this.med1 = game.add.audio('med1');
  }


  update() {
    this.addAsteroid();
    this.addRobot();

	  this.addCoin();
	  this.addFuel();
	  this.addMedpack();

    if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      console.log('b');
      this.weapon.fire();
      this.laser1.play();
    }
    //Coin collection
    game.physics.arcade.overlap(this.player, this.CoinGroup, this.playerCollideCoin, null, this);

    //Fuel collision
      game.physics.arcade.overlap(this.player, this.FuelGroup, this.playerCollideFuel, null, this);

      //Health collision
      game.physics.arcade.overlap(this.player, this.MedpackGroup, this.playerCollideMedpack, null, this);

    //Player collisions
    game.physics.arcade.collide(this.player, this.asteroids, this.playerCollideAsteroid, null, this);
    game.physics.arcade.collide(this.player, this.robots, this.playerCollideRobot, null, this);

    //Bullets
    console.log("Bullets:" + this.weapon.bullets.total);
    game.physics.arcade.collide(this.weapon.bullets, this.asteroids, this.bulletCollideAsteroidHandler, null, this);
    game.physics.arcade.collide(this.weapon.bullets, this.robots, this.playerBulletCollideRobot, null, this);

    //Self-collisions
    game.physics.arcade.collideGroupVsSelf(this.asteroids, this.asteroidCollideOther,  null, this);
    game.physics.arcade.collideGroupVsSelf(this.robots, this.robotCollideRobot,  null, this);

    //Robot/asteroid collisions
    game.physics.arcade.collide(this.asteroids, this.robots, this.asteroidCollideRobot, null, this);
  }

  playerCollideRobot(player, robot) {
    this.makeExplosion(
      (player.body.x + robot.body.x) / 2,
      (player.body.y + robot.body.y) / 2
    );

    this.player.health -= player.maxHealth/4;
    this.robots.remove(robot);
  }
  robotCollideRobot(robot1, robot2) {
    this.makeExplosion(
      (robot1.body.x + robot2.body.x) / 2,
      (robot1.body.y + robot2.body.y) / 2
    );
    this.robots.remove(robot1);
    this.robots.remove(robot2);
  }
  playerBulletCollideRobot(bullet, robot) {
    this.makeExplosion(robot.body.x, robot.body.y);
    this.robots.remove(robot);
  }
  asteroidCollideRobot(asteroid, robot) {
    this.makeExplosion(((asteroid.body.x + robot.body.x) / 2),
      (asteroid.body.y + robot.body.y) / 2);
    this.asteroids.remove(asteroid);
    this.robots.remove(robot);
  }

  asteroidCollideOther (asteroid, asteroid2) {
    this.makeExplosion(((asteroid.body.x + asteroid2.body.x) / 2),
                      (asteroid.body.y + asteroid2.body.y) / 2);
    this.asteroids.remove(asteroid);
    this.asteroids.remove(asteroid2);
  }

  bulletCollideAsteroidHandler (bullet, asteroid) {
    this.makeExplosion(asteroid.body.x, asteroid.body.y);
    this.asteroids.remove(asteroid);
    this.weapon.bullets.remove(bullet);
  }

  playerCollideAsteroid (player, asteroid) {
    this.player.health -= player.maxHealth / 10;
    if (this.player.health <= 0) {
      //TODO:  Kill player and explode ship
    }
    this.makeExplosion(asteroid.body.x, asteroid.body.y);
    this.asteroids.remove(asteroid);
  }

  playerCollideCoin (player, coin) {
    //  If the ship collides with a coin it gets eaten :)
    this.coin1.play();
    this.player.score += 1;
    coin.kill();
  }
    playerCollideFuel (player, fuel) {
        //  If the ship collides with a coin it gets eaten :)
        this.fuel1.play();
        this.player.fuel += 200000;
        fuel.kill();
    }
    playerCollideMedpack (player, medpack) {
        //  If the ship collides with a coin it gets eaten :)
        this.med1.play();
        this.player.health += 25;
        medpack.kill();
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

  drawBar(x, y, percentage) {
    var maxWidth = 150
    var width = Math.ceil(percentage * maxWidth)
    var height = 20
    var borderSize = 2

    var color = Phaser.Color.HSLtoRGB(percentage * 0.35, 0.75, 0.45)
    color = color.r * 0x010000 + color.g * 0x000100 + color.b * 0x000001

    this.barGraphics.beginFill(0);
    this.barGraphics.drawRect(x, y, maxWidth, height)
    this.barGraphics.beginFill(color);
    this.barGraphics.drawRect(x + borderSize, y + borderSize,
                              Math.max(0, width - borderSize * 2), height - borderSize * 2)
  }

  render () {
    this.barGraphics.clear();
    var y = 7

    this.healthText.text = ' health'
    this.drawBar(600, y, this.player.health / this.player.maxHealth)

    this.fuelText.text = '   fuel'
    this.drawBar(600, y + 30, this.player.fuel / this.player.fuelMax)

    this.scoreText.text = 'score ' + this.player.score
  }

  addCoin() {
    if (this.CoinGroup.total < 25) {
        var chanceOfCoin = 0.05;

        var coinRandom = Math.random();
        if (coinRandom < chanceOfCoin) {
          var xPos = this.world.width * Math.random();
          var yPos = this.world.width * Math.random();
          var newCoin = this.CoinGroup.create(xPos, yPos, 'coin');
          newCoin.width = 32;
          newCoin.height = 32;
          newCoin.animations.add('coin');
          newCoin.body.setCircle(10, 5, 5);//(radius,xoffset,yoffset);
          newCoin.play('coin', 10, true, false);
        }
      }
    }

    addFuel() {
        if (this.FuelGroup.total < 5) {
            var chanceOfFuel = .1;
            var fuelRandom = Math.random();
            if (fuelRandom < chanceOfFuel) {
                var xPos = this.world.width * Math.random();
                var yPos = this.world.width * Math.random();
                var newFuel = this.FuelGroup.create(xPos, yPos, 'fuel');
            }
        }
    }

    addMedpack() {
        if (this.MedpackGroup.total < 5) {
            var chanceOfMedpack = .1;
            var medpackRandom = Math.random();
            if (medpackRandom < chanceOfMedpack) {
                var xPos = this.world.width * Math.random();
                var yPos = this.world.width * Math.random();
                var newMedpack = this.MedpackGroup.create(xPos, yPos, 'medpack');
            }
        }
    }

    addAsteroid() {
      if (this.asteroids.total < 30) {
        var chanceOfAsteroid = 0.1;

        var asteroidRandom = Math.random();
        if (asteroidRandom < chanceOfAsteroid) {
          var newPosition = this.getPositionAlongEdge(asteroidRandom, chanceOfAsteroid);
          var newAsteroid = new Asteroid({game: this, x: newPosition.x, y: newPosition.y, asset: 'asteroid'});
          this.asteroids.add(newAsteroid);
        }
      }
    }

    addRobot() {
      if (this.robots.total < 5) {
        var chanceOfRobot = 0.1;
        var robotRandom = Math.random();
        if (robotRandom < chanceOfRobot) {
          var newPosition = this.getPositionAlongEdge(robotRandom, chanceOfRobot);
          var newRobot = new Robot({game: this, x: newPosition.x, y: newPosition.y, asset: 'robot'});
          this.robots.add(newRobot);
        }
      }
    }

    getPositionAlongEdge(randomSeed, seedRange) {
      var xPos, yPos;
      if (randomSeed <= seedRange / 4)
      {
        xPos = this.world.width * Math.random();
        yPos = 0;
      }
      else if (randomSeed <= seedRange / 2) {
        xPos = this.world.width * Math.random();
        yPos = this.world.height-1;
      }
      else if (randomSeed <= (seedRange*3) /4 ) {
        xPos = 0;
        yPos = this.world.height * Math.random();
      }
      else {
        xPos = this.world.width-1;
        yPos = this.world.height * Math.random();
      }
      return {x:xPos, y:yPos};
    }

    makeExplosion(x, y) {
      var explosion = game.add.sprite(x, y, 'kaboom');
      explosion.anchor.x = 0.5;
      explosion.anchor.y = 0.5;
      explosion.animations.add('kaboom');
      explosion.play('kaboom', 30, false, true);

      this.explosion1.play();
    }
}
