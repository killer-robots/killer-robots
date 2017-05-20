/* globals __DEV__ */
import Phaser from 'phaser'
import Ship from '../sprites/Ship'
import Asteroid from '../sprites/Asteroid'
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

    this.background = new Phaser.TileSprite(game, 0, 0, 2048, 2048, 'background')

    game.world.setBounds(0,0,2048,2048);

    this.player = new Ship({
      game: this,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'ship'
    })
    this.player.body.collideWorldBounds = true;
    game.camera.follow(this.player);

    this.game.add.existing(this.background)
    this.addPlanets()
    this.game.add.existing(this.player);
	this.CoinGroup = this.game.add.physicsGroup();
  }

  update() {
    this.addAsteroid();
	this.addCoin();
	game.physics.arcade.overlap(this.player, this.CoinGroup, this.collisionHandler, null, this);
  }


  render () {
    var x = 32
    var y = 32

    // TODO: Use a proper font for this, not 'game.debug'.
    this.game.debug.start(x, y);
    this.game.debug.line('fuel: ' + Math.round(this.player.fuel / this.player.fuelMax * 100) + '%');
    this.game.debug.stop();
  }

  addPlanets() {
    const asteroidCount = 2
    this.game.planets = []

    for (var i = 0; i < asteroidCount; i++) {
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
    var chanceOfAsteroid = 0.01;

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

      var newAsteroid = new Asteroid({
        game: this,
        x: xPos,
        y: yPos,
        asset: 'asteroid'
      })
      this.game.add.existing(newAsteroid);
    }
  }
  addCoin() {
    var chanceOfCoin = 0.01;

    var coinRandom = Math.random();
    if (coinRandom < chanceOfCoin) {
      var xPos = Math.random();
      var yPos = Math.random();
      if (coinRandom <= chanceOfCoin / 4)
      {
        xPos = this.world.width * Math.random();
        yPos = Math.random();
      }
      else if (coinRandom <= chanceOfCoin / 2) {
        xPos = this.world.width * Math.random()+100;
        yPos = this.world.height* Math.random()+100;
      }
      else if (coinRandom <= (chanceOfCoin*3) /4 ) {
        xPos = this.world.width * Math.random()+100;
        yPos = this.world.height * Math.random()+100;
      }
      else {
        xPos = this.world.width* Math.random()+100;
        yPos = this.world.height * Math.random()+100;
      }
	  var newCoin = this.CoinGroup.create(xPos, yPos,'coin');
	  /*var newCoin = new Coin({
		  game: this,
		  x: xPos,
		  y: yPos,
		  asset: 'coin'
	  })*/
	  newCoin.width =16;
	  newCoin.height =16;
      //this.game.add.existing(newCoin);
    }
  }
  collisionHandler (player, coin) {
    //  If the ship collides with a coin it gets eaten :)
    coin.kill();
  }
}
