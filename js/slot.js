export class Slot {
    constructor(x, y, anchor, width, height, cost) {
      this.x = x;
      this.y = y;
      this.anchor = anchor;
      this.width = width;
      this.height = height;
      this.cost = cost;
      this.slot = null;
    }
  
    create() {
      const slot = PIXI.Sprite.from(`./images/${this.cost}.png`);
      slot.anchor.set(this.anchor);
      slot.x = this.x;
      slot.y = this.y;
      slot.width = this.width;
      slot.height = this.height;
      this.slot = slot;
  
      return slot;
    }
  }