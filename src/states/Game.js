/* globals __DEV__ */
import Phaser from 'phaser'
import Ship from '../sprites/Ship'
import Asteroid from '../sprites/Asteroid'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    //Initialize physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.asteroidGroup = game.add.physicsGroup();
    //this.asteroidGroup.classType = Asteroid;

    // Set up game input.
    game.cursors = game.input.keyboard.createCursorKeys()
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ])

    //Background image logic
    this.background = new Phaser.TileSprite(game, 0, 0, 800, 600, 'background')
    this.game.add.existing(this.background);

    //Player ship logic
    this.player = new Ship({
      game: this,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'ship'
    })
    this.game.add.existing(this.player);

    //Setup player/asteroid physics
    this.player.body.collideWorldBounds = true;
    game.physics.arcade.enable(this.player);

  }

  update() {
    this.addAsteroid();

    console.log("Asteroids in physics group: " + this.asteroidGroup.total);

    if (game.physics.arcade.collide(this.player, this.asteroidGroup))
    {
      console.log("Asteroid collision!");
    }

  }

  processHandler(player, asteroid) {
    return true;
  }

  collisionHandler(player, asteroid) {

  }


  render () {
    var x = 32
    var y = 32

    // TODO: Use a proper font for this, not 'game.debug'.
    this.game.debug.start(x, y);
    this.game.debug.line('fuel: ' + Math.round(this.player.fuel / this.player.fuelMax * 100) + '%');
    this.game.debug.stop();
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

      console.log("X:" + xPos, "Y: " + yPos);
      var newAsteroid = new Asteroid(game, xPos, yPos, "asteroid");
      this.asteroidGroup.add.existing(newAsteroid);
      //this.asteroidGroup.create( xPos,  yPos, 'asteroid');


      console.log("After: " + this.asteroidGroup.total);
    }
  }
}
