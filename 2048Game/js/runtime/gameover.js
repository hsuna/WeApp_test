import DataBus from '../databus';

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

let databus = new DataBus();

export default class GameOver {
  constructor(ctx) {
  }

  render(ctx) {
    //遮罩层
    ctx.globalAlpha = .2;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 640, 640);
    ctx.globalAlpha = 1;

    //背景
    ctx.fillStyle = "#FF8800";
    ctx.fillRect(70, 120, 500, 360, 10);
    ctx.fillStyle = "#FFB45B";
    ctx.fillRect(90, 230, 460, 220, 5);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = '64px Arial';
    ctx.fillText('游戏结束', 190, 200);

    ctx.font = '48px Arial';
    ctx.fillText('本次得分', 220, 300);

    ctx.font = '80px Arial';
    ctx.textAlign = "center";
    ctx.fillText(databus.score, 320, 400);
  }
}

