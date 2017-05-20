Util.ShatterSprite = function ShatterSprite(game, key, frame) {
  var numberOfSprites = 12; // make 12 sprites from frame
  var offCanvas = -1000; // constant to create sprites outside of game canvas

  function getImageFromSprite(game, key, frame) {
    // temp sprite used for extraction
    var sprite = game.add.sprite(offCanvas, offCanvas, key, frame);
    // create a canvas to draw the sprite to with Phaser's bitmapData method
    var bmd = game.add.bitmapData(sprite.width, sprite.height);
    // create an image and set the image data, and clean up
    var image = new Image();
    bmd.draw(sprite, 0, 0, sprite.width, sprite.height);
    bmd.update();
    sprite.destroy();
    image.src = bmd.canvas.toDataURL();
    return image;
  }

  // Create a phaser group out of a Shatter object
  function createShatteredGroup(game, shatteredImage) {
    var shatteredGroup = game.add.group();
    // Shatter.js returns the new images in an array at Shatter.images, here we loop through all of them
    shatteredImage.images.forEach(function(image, ind, arr) {
      // create a key for the using the same name as the frame of the original sprite + its position in the array of shattered images
      var key = frame + ind;
      // add it to the game cache, so we can add it to the new sprite group
      game.cache.addImage(key, null, image.image);
      var sprite = shatteredGroup.create(offCanvas, offCanvas, key);
      // save the sprites offset so we can place it properly when drawing the groupp
      sprite.originX = image.x;
      sprite.originY = image.y;
      game.physics.arcade.enable(sprite);
      // for the shattered ground objects I only check down collision. Need to move this out and pass in.
      sprite.body.checkCollision.left = false;
      sprite.body.checkCollision.right = false;
      sprite.body.checkCollision.up = false;
    });
    return shatteredGroup;
  }

  return createShatteredGroup(game,
    new Shatter(getImageFromSprite(game, key, frame), numberOfSprites));
}