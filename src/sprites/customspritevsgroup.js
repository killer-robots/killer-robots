Vegetable = function (game) {

    frame = game.rnd.between(0, 1);//35);

    //  Just because we don't want a false chilli (frame 17)
    //if (frame === 1)
    //{
    //   frame = 1;
    //}

    var x = game.rnd.between(100, 770);
    var y = game.rnd.between(0, 570);

    Phaser.Image.call(this, game, x, y, 'veggies', frame);

};

Vegetable.prototype = Object.create(Phaser.Image.prototype);
Vegetable.prototype.constructor = Vegetable;

Coin = function (game) {

    var x = game.rnd.between(100, 770);
    var y = game.rnd.between(0, 570);

    Phaser.Sprite.call(this, game, x, y, 'coins', 1);

    game.physics.arcade.enable(this);

};

Coin.prototype = Object.create(Phaser.Sprite.prototype);
Coin.prototype.constructor = Coin;

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('phaser', 'assets/sprites/phaser-dude.png');
    game.load.spritesheet('coins', 'assets/images/coin.png', 32, 32);
    //game.load.spritesheet('uniqueKey', 'assets/sprites/metalslug_mummy37x45.png', 32, 32, 18);
    //  32x32 is the size of each frame
    //  There are 18 frames in the PNG - you can leave this value blank if the frames fill up the entire PNG, but in this case there are some
    //  blank frames at the end, so we tell the loader how many to load

}

var sprite;
var group;
var cursors;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#2d2d2d';

    //  This example will check Sprite vs. Group collision
   
    group = game.add.group();

    for (var i = 0; i < 70; i++)
    {
        if (i < 50)
        {
            //  Vegetables don't have any physics bodies
            //group.add(new Vegetable(game));
        }
        else
        {
            //  But a chilli has a physics body
            group.add(new Coin(game));
        }
    }

    //  Our player
    sprite = game.add.sprite(32, 200, 'phaser');

    game.physics.arcade.enable(sprite);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    game.physics.arcade.overlap(sprite, group, collisionHandler, null, this);

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
        sprite.body.velocity.x = -200;
    }
    else if (cursors.right.isDown)
    {
        sprite.body.velocity.x = 200;
    }

    if (cursors.up.isDown)
    {
        sprite.body.velocity.y = -200;
    }
    else if (cursors.down.isDown)
    {
        sprite.body.velocity.y = 200;
    }

}

function collisionHandler (player, coin) {

    //  If the player collides with a chilli it gets eaten :)
    coin.kill();

}

