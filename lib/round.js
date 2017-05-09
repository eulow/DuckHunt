const Duck = require ('./duck');

class Round {
  constructor(board, round) {
    // this.round = round;
    this.board = board;
    this.stage = board.stage;
    this.canvas = board.canvas;
    this.roundContainer = board.roundContainer;

    this.bullets = 3;
    this.bulletsSprite = '';
    this.ducksContainer = new createjs.Container();
    this.ducks = {};
    this.duckCount = 2;

    this.createRound(round);
    createjs.Ticker.addEventListener('tick', this.handleTick.bind(this));
    this.handleShot = this.handleShot.bind(this);
    this.canvas.addEventListener('click', this.handleShot);
    this.renderGrass = this.renderGrass.bind(this);
    this.renderBullets = this.renderBullets.bind(this);
    this.screenFlash = this.screenFlash.bind(this);
    this.createDucks = this.createDucks.bind(this);
    this.roundOver = this.roundOver.bind(this);
    // debugger
  }

  createRound(round) {
    this.createDucks(round);
    this.roundContainer.addChild(this.ducksContainer);
    this.renderGrass();
    this.renderBullets();
    this.board.renderScore();
    this.renderRoundInfo(round);
  }

  renderRoundInfo(round) {
    const score = new createjs.Text(`R=${round}`, "14px 'Press Start 2P'", '#93e473');
    score.x = 68;
    score.y = 390;
    this.roundContainer.addChild(score);
  }

  createDucks(round) {
    for (var id = 0; id < 2; id++) {
      const duck = new Duck (this.canvas, this.ducksContainer, id, round);
      duck.duck.addEventListener('click', this.shotDuck.bind(this));

      this.roundContainer.addChild(duck.duck);
      this.ducks[duck.duck.id] = duck;
    }
  }

  roundOver() {
    if (this.duckCount === 0 || this.bullets === 0) {
      this.canvas.removeEventListener('click', this.handleShot);
      this.board.nextRound();
    }
  }


  handleTick(event) {
    this.stage.update(event);
    const arrayDucks = Object.keys(this.ducks).map(id => this.ducks[id]);

    arrayDucks.forEach(
      (duck) => {
        duck.moveDuck();
      }
    );
  }

  shotDuck(e) {
    const duck = this.ducks[e.target.id];

    if (duck.duck.status === 1 && this.bullets > 0) {
      this.duckCount -= 1;
      duck.deadDuck();
      this.showScoreOnKill(e.target.x, e.target.y);
      this.board.addToScoreBoard();
    }
    this.roundOver();
  }

  showScoreOnKill(x, y) {
    const score = new createjs.Text('500', "18px 'Press Start 2P'", '#ffffff');
    score.x = x;
    score.y = y;

    this.roundContainer.addChild(score);
    window.setTimeout(
      (
        () => this.roundContainer.removeChild(score)
      ), 500
    );
  }

  handleShot(e) {
    if (this.bullets > 0) {
      const shotSound = new Audio('assets/audio/shot.mp3');
      shotSound.currentTime = 0;
      shotSound.play();
      this.screenFlash();

      this.bullets -= 1;

      switch (this.bullets) {
        case 2:
        this.bulletsSprite.gotoAndPlay('two');
        break;
        case 1:
        this.bulletsSprite.gotoAndPlay('one');
        break;
        case 0:
        this.bulletsSprite.gotoAndPlay('zero');
        break;
      }
    }
    this.roundOver();
  }

  screenFlash() {
    const flash = new createjs.Shape();

    flash.graphics.beginFill('white').drawRect(0, 0, 640, 480);
    flash.alpha = .9;
    this.roundContainer.addChild(flash);
    window.setTimeout(
      (
        () => this.roundContainer.removeChild(flash)
      ), 80
    );
  }


  renderGrass() {
    const grass = new createjs.Bitmap('./assets/images/grass.png');
    grass.scaleX = 2.5;
    grass.scaleY = 2;
    grass.y = 302;
    this.roundContainer.addChild(grass);
  }

  renderBullets() {
    const data = {
      images: ['./assets/images/duck_hunt.png'],
      frames: [
        [498, 261, 0, 8],
        [498, 261, 9, 8],
        [498, 261, 18, 8],
        [498, 261, 26, 8]
      ],
      animations: {
        zero: 0,
        one: 1,
        two: 2,
        three: 3
      },
      framerate: 0
    };
    const spriteSheet = new createjs.SpriteSheet(data);
    const bullets = new createjs.Sprite(spriteSheet, 'three');

    bullets.scaleX = 2.5;
    bullets.scaleY = 2;
    bullets.x = 56;
    bullets.y = 418;

    this.bulletsSprite = bullets;
    this.roundContainer.addChild(bullets);
  }
}


module.exports = Round;