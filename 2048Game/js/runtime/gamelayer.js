import Sprite from '../base/sprite';
import BackGround from './background';
import Block from '../block/index';

import DataBus from '../databus';

/**
 * 游戏层
 */
let databus = new DataBus();
let blockCache = [];//奴隶与死囚

export default class GameLayer {
  constructor(ctx) {

    this.bg = new BackGround(ctx);
  }

  render(ctx) {
    this.bg.render(ctx);

    databus.table.forEach((value, index) => {
      if (value && 0 != value) {
        let block;
        if (blockCache[index]) {
          block = blockCache[index];
          block.setValue(value);
        } else {
          block = blockCache[index] = new Block(ctx, value);
        }

        ctx.save();
        ctx.translate(47 + (index % 4) * (124 + 16), 78 + Math.floor(index / 4) * (124 + 16));

        //新添加的
        if (databus.new && databus.new.index == index) {
          //中心点缩放
          ctx.translate(62, 62);
          ctx.scale(databus.new.scale, databus.new.scale);
          ctx.translate(-62, -62);
          databus.new.scale += .04;
          if (databus.new.scale > 1) {
            databus.new = null;
          }
        }

        block.render(ctx);
        ctx.restore();
      }
    });
  }
}
