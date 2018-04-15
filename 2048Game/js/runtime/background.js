import Sprite from '../base/sprite'
import DataBus from '../databus'

const BG_IMG_SRC = 'images/bg.png'
const BG_SIZE = 640;

let databus = new DataBus()

/**
 * 游戏背景类
 * 提供update和render函数实现无限滚动的背景功能
 */
export default class BackGround extends Sprite {
  constructor(ctx) {
    super(BG_IMG_SRC, BG_SIZE, BG_SIZE)

    this.render(ctx)
  }

  render(ctx) {
    ctx.drawImage(this.img, 0, 0);

    ctx.font = '32px Arial';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(databus.score, 290, 30);
    ctx.fillText(databus.best, 485, 30);
  }
}
