import Storage from '../libs/storage';
import DataBus from '../databus';

const HElP_IMG_SRC = [
  'images/help1.png',
  'images/help2.png'
];
const MAX_STEP = HElP_IMG_SRC.length;
const HELP_SIZE = 640;

let storage = new Storage();
let databus = new DataBus();

export default class GameHelp {
  constructor(ctx) {
    this.step = 0;
    this.imageList = HElP_IMG_SRC.map(src => {
      let img = new Image();
      img.src = src;
      return img;
    });
  }

  render(ctx) {
    ctx.drawImage(this.imageList[this.step], 0, 0);
  }

  handleTouch(x, y, x2, y2) {
    if (Math.abs(x - x2) > 50) {
      if (x > x2) {
        this.update(1);
      } else {
        this.update(-1);
      }
    }
  }

  update(direction) {
    if (direction < 0) {
      if (this.step > 0) {
        this.step--;
      }
    } else if (direction > 0) {
      if (this.step < MAX_STEP - 1) {
        this.step++;
      } else {
        databus.status = 'start';
        storage.set('hadin', 1);
        this.enterCall && this.enterCall();
        return;
      }
    }
  }
}

