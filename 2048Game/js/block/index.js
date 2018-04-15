import Sprite from '../base/sprite'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

// 相关常量设置
const BLOCK_SIZE = 124;
const BLOCK_POS = {
  2: { x: 0, y: 0 },
  4: { x: 1, y: 0 },
  8: { x: 2, y: 0 },
  16: { x: 3, y: 0 },
  32: { x: 0, y: 1 },
  64: { x: 1, y: 1 },
  128: { x: 2, y: 1 },
  256: { x: 3, y: 1 },
  512: { x: 0, y: 2 },
  1024: { x: 1, y: 2 },
  2048: { x: 2, y: 2 },
  4096: { x: 3, y: 2 }
};
const BLOCK_IMG_SRC = 'images/block.png';

export default class Block extends Sprite {
  constructor(ctx, value = 2) {
    super(BLOCK_IMG_SRC, BLOCK_SIZE, BLOCK_SIZE);

    this.setValue(value);
  }

  render(ctx) {
    ctx.drawImage(
      this.img,
      this.x,
      this.y,
      this.width,
      this.height,
      0,
      0,
      this.width,
      this.height
    )
  }

  setValue(value) {
    this.value = value;
    let pos = BLOCK_POS[this.value];
    this.x = pos.x * BLOCK_SIZE;
    this.y = pos.y * BLOCK_SIZE;
  }
}
