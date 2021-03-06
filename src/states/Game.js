import Phaser from 'phaser'
import Ship from '../sprites/Ship'
import Asteroid from '../sprites/Asteroid'
import Robot from '../sprites/Robot'
import Planet, { planets } from '../sprites/Planet'
import BlackHole from '../sprites/BlackHole'
import Coin from '../sprites/Coin'
import Sun from '../sprites/Sun'
import Flag from '../sprites/Flag'
import Arrow from '../sprites/Arrow'

import config from '../config'

const API_URL = 'https://killer-robots-highscore-server.herokuapp.com'

const FlagPoints = 500;
const RobotPoints = 10;
const CoinPoints = 100;
const AsteroidPoints = 25;
const HealthPoints = 25;
const FuelPoints = 25;

export default class extends Phaser.State {
    init () {}
    preload () {}

    create () {
        //Setup physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Set up game input.
        game.cursors = game.input.keyboard.createCursorKeys()
        game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ])

        //Setup the world
        var worldWidth = 4096;
        var worldHeight = 4096;
        this.background = game.add.tileSprite(0, 0, worldWidth, worldHeight, 'background')

        //Setup the player
        this.world.setBounds(0,0,worldWidth,worldHeight);
        this.player = new Ship({
            game: this,
            x: this.world.centerX,
            y: this.world.centerY,
            asset: 'ship'
        })

        this.player.body.collideWorldBounds = true;
        game.camera.follow(this.player);

        //Populate world with objects
        this.asteroids = game.add.physicsGroup();
        this.robots = game.add.physicsGroup();
        this.coins = game.add.physicsGroup();
        this.addBlackHoles()
        this.addPlanets()
        this.flags = game.add.physicsGroup();
        this.addSun()
        this.game.add.existing(this.player);
        //Starting flag
        var sun = this.game.suns[0];
        var flag = this.addFlag(sun);

        //Arrow to flag
        this.addArrow(flag);

        //Load high score
        var highScore = 0;
        var loadScore = localStorage.getItem("killerRobotsHighScore");
        if (loadScore !== null) {
            highScore = parseInt(loadScore);
        }
        this.HighScore = highScore;

        //Add HUD info
        this.fuelText = game.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET2, 10, 1, 0)
        var fuelTextImage = game.add.image(362, 35, this.fuelText)
        fuelTextImage.tint = 0xFF7766
        fuelTextImage.fixedToCamera = true

        //health text
        this.healthText = game.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET2, 10, 1, 0)
        var healthTextImage = game.add.image(362, 5, this.healthText)
        healthTextImage.tint = 0x28bb35
        healthTextImage.fixedToCamera = true

        //score text
        this.scoreText = game.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET2, 10, 1, 0)
        var scoreTextImage = game.add.image(5, 5, this.scoreText)
        scoreTextImage.tint = 0xFFD700
        scoreTextImage.fixedToCamera = true

        //high score text
        this.highScoreText = game.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET2, 10, 1, 0)
        var highScoreTextImage = game.add.image(5, 35, this.highScoreText)
        highScoreTextImage.tint = 0xFF9905
        highScoreTextImage.fixedToCamera = true

        // options/pause menu text
        // var optionsText = game.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET2, 10, 1, 0)
        // this.optionsTextImage = game.add.image(5, 362, optionsText)
        // this.optionsTextImage.texture.text = 'pause'
        // this.optionsTextImage.tint = 0xFFFFFF
        // this.optionsTextImage.fixedToCamera = true
        // this.optionsTextImage.inputEnabled = true
        // this.optionsTextImage.events.onInputDown.add(() => {
        //   game.paused = !game.paused
        //   if (game.paused) {
        //     this.optionsTextImage.texture.text = 'unpause'
        //   } else {
        //     this.optionsTextImage.texture.text = 'pause'
        //   }
        // })

        //game over text
        this.gameOverText = game.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET2, 10, 1, 0)
        var gameOverTextImage = game.add.image(game.camera.width/8, game.camera.height/2, this.gameOverText)
        gameOverTextImage.tint = 0xD80000
        gameOverTextImage.fixedToCamera = true

        highScoreTextImage.tint = 0xFF9905
        highScoreTextImage.fixedToCamera = true

        // Set up the default weapon
        this.weapon = game.add.weapon(50, 'bullet')
        this.weapon.bulletLifespan = 1000;
        this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        this.weapon.bulletSpeed = 1200;
        this.weapon.fireRate = 100;
        this.weapon.trackSprite(this.player, 0, 0, true);
        this.weapon.actualFire = function(shooter, weapon) {
          weapon.fire(shooter);
        };
        var shootSignal = new Phaser.Signal();
        shootSignal.add(function() {
          this.laser1.play();
        }, this);
        this.weapon.onFire = shootSignal;
        var defaultWeapon = this.weapon;
        this.player.currentWeapon = defaultWeapon;

        // Set up the special weapon #1
        this.specialWeapon1 = game.add.weapon(50, 'bullet')
        this.specialWeapon1.bulletLifespan = 1000;
        this.specialWeapon1.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        this.specialWeapon1.bulletSpeed = 1200;
        this.specialWeapon1.fireRate = 100;
        this.specialWeapon1.trackSprite(this.player, 0, 0, true);
        this.specialWeapon1.actualFire = function(shooter, weapon) {
          if (weapon.game.time.time < weapon.nextFire) { return; }
          var c = Math.cos(shooter.angle * (Math.PI / 180));
          var s = Math.sin(shooter.angle * (Math.PI / 180));
          var firerateBackup = weapon.fireRate;
          weapon.fireRate = 0;
          var spread = 0.2;

          for (var dir = -2; dir <= 2; dir++) {
            weapon.fire(shooter, shooter.position.x + (c + spread * dir) % (Math.PI * 2),
                                 shooter.position.y + (s - spread * dir) % (Math.PI * 2));
          }

          weapon.fireRate = firerateBackup;
          weapon.nextFire = weapon.game.time.time + weapon.fireRate;
          weapon.shotsLeft--;
          if (weapon.shotsLeft <= 0) {
            shooter.currentWeapon = defaultWeapon; // Set default weapon back.
          }
        };
        this.specialWeapon1.onFire = shootSignal;

        this.robotWeaponGroup = this.game.add.physicsGroup();

        this.CoinGroup = this.game.add.physicsGroup();
        this.FuelGroup = this.game.add.physicsGroup();
        this.MedpackGroup = this.game.add.physicsGroup();
        this.WeaponGroup = this.game.add.physicsGroup();
        this.MissileGroup = this.game.add.physicsGroup();

        this.barGraphics = game.add.graphics(0, 0)
        this.barGraphics.fixedToCamera = true

        this.createRocketEmitters();

        // Audio
        this.missile1 = game.add.audio('missile1')
        this.laser1 = game.add.audio('laser1');
        this.laser2 = game.add.audio('laser2');
        this.explosion1 = game.add.audio('explosion1');
        this.coin1 = game.add.audio('coin1');
        this.powerupSound = game.add.audio('powerupSound', 0.5);
        this.spaceWind = game.add.audio('spaceWind', 0.5, true);
        this.musics = [game.add.audio('mars', 0.5), game.add.audio('mercury', 0.5),
                       game.add.audio('venus', 0.5), game.add.audio('map', 0.5)];
        this.currentSongIndex = game.rnd.integerInRange(0, this.musics.length - 1);
    }

    shutdown() {
      for (var music of this.musics) {
        music.stop();
      }
    }

    update() {

      this.updateRockets();
        if (!this.musics[this.currentSongIndex].isPlaying && !this.musics[this.currentSongIndex].isDecoding) {
          // Play next song.
          this.currentSongIndex = (this.currentSongIndex + 1) % this.musics.length;
          this.musics[this.currentSongIndex].play();
        }

        //Add objects
        this.addAsteroid();
        this.addRobot();
        this.addCoin();
        this.addFuel();
        this.addMedpack();
        this.addWeapons();

        //Check for firing input
        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.player.health > 0) {
            this.player.currentWeapon.actualFire(this.player, this.player.currentWeapon);
        }

        //Coin collection
        game.physics.arcade.overlap(this.player, this.CoinGroup, this.playerCollideCoin, null, this);

        //Fuel collision
        game.physics.arcade.overlap(this.player, this.FuelGroup, this.playerCollideFuel, null, this);

        //Health collision
        game.physics.arcade.overlap(this.player, this.MedpackGroup, this.playerCollideMedpack, null, this);

        //Weapons collision
        game.physics.arcade.overlap(this.player, this.WeaponGroup, this.playerCollideWeapon, null, this);
        // This doesn't probably work yet:
        // game.physics.arcade.overlap(this.robots, this.WeaponGroup, this.playerCollideWeapon, null, this);

        //Player collisions
        game.physics.arcade.collide(this.player, this.asteroids, this.playerCollideAsteroid, null, this);
        game.physics.arcade.collide(this.player, this.robots, this.playerCollideRobot, null, this);

        //Bullets
        //console.log("Bullets:" + this.weapon.bullets.total);
        game.physics.arcade.collide(this.weapon.bullets, this.asteroids, this.bulletCollideAsteroidHandler, null, this);
        game.physics.arcade.collide(this.weapon.bullets, this.robots, this.playerBulletCollideRobot, null, this);
        game.physics.arcade.collide(this.specialWeapon1.bullets, this.asteroids, this.bulletCollideAsteroidHandler, null, this);
        game.physics.arcade.collide(this.specialWeapon1.bullets, this.robots, this.playerBulletCollideRobot, null, this);
        game.physics.arcade.collide(this.MissileGroup, this.robots, this.missileHitsRobot, null, this);
        game.physics.arcade.collide(this.MissileGroup, this.asteroids, this.missileHitsAsteroid, null, this);

        //Self-collisions
        game.physics.arcade.collideGroupVsSelf(this.asteroids, this.asteroidCollideOther,  null, this);
        game.physics.arcade.collideGroupVsSelf(this.robots, this.robotCollideRobot,  null, this);

        //Robot/asteroid collisions
        game.physics.arcade.collide(this.asteroids, this.robots, this.asteroidCollideRobot, null, this);

        //player flag collision
        game.physics.arcade.collide(this.player, this.flags, this.playerCollideFlag, null, this);

            //robots shoot
            game.physics.arcade.collide(this.robotWeaponGroup, this.player, this.robotBulletCollidePlayerHandler, null, this);
    }

    playerCollideFlag(player, flag) {
        var sun = this.game.suns[0];

        if (flag.nearObject == sun)
        {
            var blackHole = this.game.blackHoles[0];
            this.arrow.towards = this.addFlag(blackHole);
        } else {
            this.arrow.towards = this.addFlag(sun);
        }
        this.flags.remove(flag);

        this.player.score += FlagPoints;
    }

    playerCollideRobot(player, robot) {
      this.checkIfPlayerStillAlive();

      this.player.health -= 1;
      robot.health -= 1;
    }

    robotBulletCollidePlayerHandler(player, bullet) {
        this.player.health -= 1;
        bullet.kill()
    }

    missileHitsRobot(missile, robot) {
      this.player.score += 100
      robot.health -= 100
        missile.kill()
    }

    missileHitsAsteroid(missile, asteroid) {
        this.makeExplosion(asteroid.body.x, asteroid.body.y);
        this.asteroids.remove(asteroid)
        missile.kill()
        this.player.score += AsteroidPoints;
    }

    robotCollideRobot(robot1, robot2) {
        // Robots are clever enough not to crash into each other.
    }
    playerBulletCollideRobot(bullet, robot) {
        this.player.score += RobotPoints;
        robot.health -= 5
        bullet.kill()
    }
    asteroidCollideRobot(asteroid, robot) {
      this.asteroids.remove(asteroid);
      robot.health -= 50;
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
        this.player.score += AsteroidPoints;
    }

    playerCollideAsteroid (player, asteroid) {
        this.player.health -= 10;
        this.checkIfPlayerStillAlive();

        this.makeExplosion(asteroid.body.x, asteroid.body.y);
        this.asteroids.remove(asteroid);
    }

    playerCollideCoin (player, coin) {
        //  If the ship collides with a coin it gets eaten :)
        this.coin1.play();
        this.player.score += CoinPoints;
        coin.kill();
    }
    playerCollideFuel (player, fuel) {
        this.powerupSound.play();
        this.player.fuel = Math.min(this.player.fuelMax, this.player.fuel + 500000);
        fuel.kill();
        this.player.score += FuelPoints;
    }
    playerCollideMedpack (player, medpack) {
        this.powerupSound.play();
        this.player.health = Math.min(this.player.maxHealth, this.player.health + 50);
        medpack.kill();
        this.player.score += HealthPoints;
    }
    playerCollideWeapon (player, weaponCrate) {
        this.powerupSound.play();
        weaponCrate.kill();
        this.player.currentWeapon = this.specialWeapon1;
        this.specialWeapon1.shotsLeft = 100;
    }

    checkIfPlayerStillAlive() {
        if (this.player.health <= 0) {
            //TODO:  End game
        }
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

    addBlackHoles() {
        const blackHoleCount = 1
        this.game.blackHoles = []

        for (var i = 0; i < blackHoleCount; i++) {
            var onLeft = Math.random() > 0.5;;
            var onTop = Math.random() > 0.5;

            var blackHole = new BlackHole({
                game: this,
                x: this.world.width*(onLeft ? 0.2 : 0.8),
                y: this.world.height*(onTop ? 0.2 : 0.8),
                asset: 'blackhole'
            })
            blackHole.onTop = onTop;
            blackHole.onLeft = onLeft;
            this.game.blackHoles.push(blackHole)
            this.game.add.existing(blackHole)
        }
    }

    addSun() {
        this.game.suns = []

        //Check where black hole was placed
        var blackHole = this.game.blackHoles[0];
        var onLeft = !blackHole.onLeft;
        var onTop = !blackHole.onTop;

        //Place sun in opposite corner
        var sun = new Sun({
            game: this.game,
            x: this.world.width*(onLeft ? 0.2 : 0.8),
            y: this.world.height*(onTop ? 0.2 : 0.8),
            asset: 'sun'
        })
        this.game.suns.push(sun);
        this.game.add.existing(sun);
        sun.animations.add('sun');
        sun.play('sun', 7, true, false);

        //console.log("Adding sun.  x: " + sun.x + ".  y: " + sun.y);
    }

    addFlag(nearObject) {
        var x = (nearObject.x > this.world.width/2 ? this.world.width*.9 : this.world.width*.1);
        var y = (nearObject.y > this.world.height/2 ? this.world.height*.9 : this.world.height*.1);

        //console.log("Adding flag.  x: " + x + ".  y: " + y);

        var newFlag = new Flag({
            game: this.game,
            x: x,
            y: y,
            asset: 'flag'
        });

        newFlag.nearObject = nearObject;

        this.flags.add(newFlag);

        newFlag.animations.add('flag');
        newFlag.play('flag', 15, true, false);
        return newFlag;
    }

    addArrow(towardObject) {
        //console.log('creating arrow!')
        var newArrow = new Arrow({
            game: this.game,
            x: this.player.x,
            y: this.player.y,
            asset: 'arrow'
        });

        newArrow.towards = towardObject;
        newArrow.animations.add('arrow');
        newArrow.play('arrow', 15, true, false);
        this.game.add.existing(newArrow);
        this.arrow = newArrow;
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

        if (this.player.score > this.HighScore)
        {
            this.HighScore = this.player.score;
        }
        this.highScoreText.text = 'high ' + this.HighScore;
        this.scoreText.text = 'score ' + this.player.score
    }
	
	notifyPlayerDied(message) {
		console.log("Player died")
		localStorage.setItem("killerRobotsHighScore", this.HighScore);
		this.gameOverText.text = message
		game.time.events.add(4000, this.restartGame, this);
        if (!config.PLAYER.NAME) {
            config.PLAYER.NAME = prompt("Enter your name for sending your score to " + API_URL)
        }
        if (config.PLAYER.NAME) {
            this.submitScore({
                player: config.PLAYER.NAME,
                points: this.player.score
            })
        }
	}

    restartGame() {
        this.game.state.start("Game");
    }

    addCoin() {
        if (this.CoinGroup.total < 33) {
            var chanceOfCoin = 0.1;

            var coinRandom = Math.random();
            if (coinRandom < chanceOfCoin) {
                var xPos = this.world.width * Math.random();
                var yPos = this.world.width * Math.random();
                var newCoin = this.CoinGroup.create(xPos, yPos, 'coin');
                newCoin.width = 32;
                newCoin.height = 32;
                newCoin.animations.add('coin');
                newCoin.play('coin', 10, true, false);
            }
        }
    }

    addFuel() {
        if (this.FuelGroup.total < 10) {
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
        if (this.MedpackGroup.total < 10) {
            var chanceOfMedpack = .1;
            var medpackRandom = Math.random();
            if (medpackRandom < chanceOfMedpack) {
                var xPos = this.world.width * Math.random();
                var yPos = this.world.width * Math.random();
                var newMedpack = this.MedpackGroup.create(xPos, yPos, 'medpack');
            }
        }
    }

    addWeapons() {
        if (this.WeaponGroup.total < 5) {
            var chanceOfFuel = .1;
            var fuelRandom = Math.random();
            if (fuelRandom < chanceOfFuel) {
                var xPos = this.world.width * Math.random();
                var yPos = this.world.width * Math.random();
                var newFuel = this.WeaponGroup.create(xPos, yPos, 'weapon1');
            }
        }
    }

    addAsteroid() {

      var maxAsteroids = 50 + (this.player.score / 500)
        if (this.asteroids.total < maxAsteroids) {
            var chanceOfAsteroid = 0.1;

            var asteroidRandom = Math.random();
            if (asteroidRandom < chanceOfAsteroid) {
                //console.log("Made an asteroid");
                var newPosition = this.getPositionAlongEdge(asteroidRandom, chanceOfAsteroid);
                var newAsteroid = new Asteroid({game: this, x: newPosition.x, y: newPosition.y, asset: 'asteroid'});
                this.asteroids.add(newAsteroid);
            }
        }
    }


    addRobot() {
        var maxRobots = 25 + (this.player.score / 500);

        if (this.robots.total < maxRobots) {
            var chanceOfRobot = 0.1;


                var robotRandom = Math.random();
                if (robotRandom < chanceOfRobot) {

                    var assetName = (robotRandom < chanceOfRobot/10 ? 'big-robot' : 'robot');
                  //var assetName = 'big-robot'
                    //console.log("Made a robot");
                    var newPosition = this.getPositionAlongEdge(robotRandom, chanceOfRobot);
                    var newRobot = new Robot({game: this, x: newPosition.x, y: newPosition.y, asset: assetName});

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
            //console.log("Making explosion!");
            var explosion = game.add.sprite(x, y, 'kaboom');
            explosion.anchor.x = 0.5;
            explosion.anchor.y = 0.5;
            explosion.animations.add('kaboom');
            explosion.play('kaboom', 30, false, true);

            this.explosion1.play();
        }

    updateRockets() {
      if (this.player != null && this.player.body != null) {
        var acc = this.player.body.acceleration.getMagnitude();

        if (acc > 0) {
          this.leftRocket.setAlpha(1, 0, 300);
          this.rightRocket.setAlpha(1, 0, 300);
        }
        else {
          this.leftRocket.setAlpha(0, 0, 300);
          this.rightRocket.setAlpha(0, 0, 300);
        }

        this.leftRocket.x = this.player.x;
        this.leftRocket.y = this.player.y;

        this.rightRocket.x = this.player.x;
        this.rightRocket.y = this.player.y;
      } else {
        this.leftRocket.setAlpha(0, 0, 300);
        this.rightRocket.setAlpha(0, 0, 300);
      }
    }

    createRocketEmitters() {
      var emitter = this.game.add.emitter(0, 0, 800);

      emitter.makeParticles( [ 'fire1', 'fire2', 'fire3', 'smoke' ] );
      //emitter.particleAnchor = new Phaser.Point(0.1,0.9);
      emitter.setAlpha(1, 0, 30);
      emitter.setScale(0.1, 0, 0.1, 0, 300);
      emitter.start(false, 200, 1);

      //this.player.addChild(emitter);
      this.leftRocket = emitter;

      var emitter2 = this.game.add.emitter(0, 0, 800);

      emitter2.makeParticles( [ 'fire1', 'fire2', 'fire3', 'smoke' ] );
      //emitter2.particleAnchor = new Phaser.Point(0.9,0.9);
      emitter2.setAlpha(1, 0, 30);
      emitter2.setScale(0.1, 0, 0.1, 0, 300);

      //this.player.addChild(emitter2);
      emitter2.start(false, 200, 1);

      this.rightRocket = emitter2;
    }

    submitScore(body) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", API_URL + '/submit_score', true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(body));
    }
}
