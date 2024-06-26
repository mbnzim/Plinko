export class Peg {
    constructor(x, y, anchor, width, height, radius) {
      this.x = x;
      this.y = y;
      this.anchor = anchor;
      this.width = width;
      this.height = height;
      this.radius = radius;
      this.pegBall = null;
    }
  
    create() {
      const peg = PIXI.Sprite.from('./images/circle.png');
      peg.anchor.set(this.anchor);
      peg.x = this.x;
      peg.y = this.y;
      peg.width = this.width;
      peg.height = this.height;
  
      this.pegBall = peg;
  
      return peg;
    }
  }
  