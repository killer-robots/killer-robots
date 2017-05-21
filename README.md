# [Our Microsoft Flux Game Jam 2017 May game](https://killer-robots.github.io/killer-robots/)

> Best game ever - Anonymous

> Shit this is better than drugs - Anonymous

Highscore server: https://killer-robots-highscore-server.herokuapp.com

It was bootstrapped with [Phaser+ES6+Webpack](https://github.com/lean/phaser-es6-webpack)

To try it out first you should have Node.js installed, then run `npm install` and `npm run dev` from the root of this repository.

It is deployed to github using `gh-pages` branch in which `dist` folder was removed from `.gitignore` and added to the source tree. To deploy to github you must first checkout to the `gh-pages` branch using `git checkout gh-pages` and then pull master `git pull origin master`. You should now have the most recent commit from master so all you gotta do now is run `npm run deploy` to build the latest version and then create a commit eg. `git add -A` `git commit -m "Version 0.1.2"` and perhaps tag it for fun `git tag v.0.1.2`. Then push it to `gh-pages` using `git push`.
