class Duck {
  constructor (round, duckId) {
    this.ducksContainer = round.ducksContainer;
    this.canvas = round.canvas;
    this.round = round;

    this.duck = this.duckSprite(round.roundNumber, duckId);

    const hit = new createjs.Shape();
    hit.graphics.beginFill('#000').drawRect(-5, -5, 45, 40);
    this.duck.hitArea = hit;

    this.removeDuckOutOfScreen = this.removeDuckOutOfScreen.bind(this);
  }

  moveDuck() {
    if ((this.duck.velX > 0 && this.duck.scaleX < 0) || (this.duck.velX < 0 && this.duck.scaleX > 0)) {
      this.duck.scaleX *= -1;
    }

    const randomDirection = (Math.random() > 0.5 ? 1 : -1);
    switch(this.duck.status) {
      case 1:
        this.randomQuacks();
        if (this.duck.x >= this.canvas.width - 60) {
          this.duck.velX = -1 * Math.abs(this.duck.velX);
          this.duck.velY *= randomDirection;
          this.duck.scaleX *= -1;
        } else if (this.duck.x <= 60) {
          this.duck.velX = Math.abs(this.duck.velX);
          this.duck.velY *= randomDirection;
          this.duck.scaleX *= -1;
        } else if (this.duck.y >= this.canvas.height - 200) {
          this.duck.velY = -1 * Math.abs(this.duck.velY);
          this.duck.velX *= randomDirection;
        } else if (this.duck.y <= 0) {
          this.duck.velY = Math.abs(this.duck.velY);
          this.duck.velX *= randomDirection;
        }
        this.duck.x += this.duck.velX;
        this.duck.y += this.duck.velY;
        break;
      case 0:
        if (this.duck.y < 300) {
          this.duck.y += 6;
        } else {
          this.removeDuckOutOfScreen(this.duck);
          const duckHitsGround = new Audio('assets/audio/duck_hits_ground.mp3');
          duckHitsGround.currentTime = 0;
          duckHitsGround.volume = .1;
          duckHitsGround.play();
        }
        break;
      case 2:
        if (this.duck.y > -100 && (this.duck.x > -100 && this.duck.x < 700)) {
          this.duck.y -= 6;
          this.duck.x += 6 * this.duck.velX / Math.abs(this.duck.velX);
        } else {
          this.removeDuckOutOfScreen(this.duck);
        }
        break;
    }
  }

  randomQuacks() {
    const quack = new Audio('assets/audio/quack.mp3');
    quack.volume = .1;

    if (Math.random() < 0.025) {
      quack.currentTime = 0;
      quack.volume = 0.1;
      quack.play();
    }
  }

  removeDuckOutOfScreen(duck) {
    if (duck.status === 2) {
      duck.flyAway.pause();
    }
    this.ducksContainer.removeChild(duck);
    delete this.round.ducks[duck.duckId];
  }

  deadDuck() {
    const fallingDuck = new Audio('assets/audio/duck_falling.mp3');
    fallingDuck.currentTime = 0;
    fallingDuck.volume = .1;
    fallingDuck.play();
    this.duck.gotoAndPlay('shot');
    this.duck.status = 0;
  }

  flyAway() {
    if (this.duck.status === 1) {
      this.duck.gotoAndPlay('flyUp');
      this.duck.status = 2;

      this.duck.flyAway = new Audio('assets/audio/fly_away.mp3');
      this.duck.flyAway.volume = .1;
      this.duck.flyAway.currentTime = 0;
      this.duck.flyAway.volume = 0.1;
      this.duck.flyAway.play();
    }
  }

  duckSprite(roundNumber, duckId) {
    const data = {
      images: ['./assets/images/duck_hunt.png'],
      frames: [
        [8, 127, 35, 34],
        [49, 127, 35, 34],
        [89, 127, 35, 34],
        [137, 132, 32, 37],
        [169, 132, 32, 37],
        [204, 132, 25, 37],
        [238, 135, 31, 32],
        [280, 134, 20, 32],
        [305, 133, 16, 33],
        [328, 134, 20, 32],
        [353, 134, 16, 33]
      ],
      animations: {
        flyForward: [0, 2],
        flyUp: [3, 5],
        shot: [6, 6, 'fall'],
        fall: [7, 10]
      },
      framerate: 8
    };
    const spriteSheet = new createjs.SpriteSheet(data);
    const duck = new createjs.Sprite(spriteSheet, 'flyForward');

    duck.framerate = 5 + roundNumber/1.35;
    duck.scaleX = 1.8;
    duck.scaleY = 1.8;
    duck.x = Math.random() * this.canvas.width;
    duck.y = Math.random() * this.canvas.height - 200;
    duck.velX = 9.5 + 2 * roundNumber;
    duck.velY = 9.5 + 1.6 * roundNumber;
    duck.duckId = duckId;
    duck.status = 1;

    return duck;
  }

}

module.exports = Duck;
