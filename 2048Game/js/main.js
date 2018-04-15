import GameHelp from './runtime/gamehelp';
import GameLayer from './runtime/gamelayer';
import GameOver from './runtime/gameover';
import DataBus from './databus';

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

let ctx = canvas.getContext('2d');
let databus = new DataBus();

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId = 0

    this.restart()
  }

  restart() {
    databus.reset()

    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )

    this.gameHelp = new GameHelp(ctx);
    this.gameLayer = new GameLayer(ctx);
    this.gameOver = new GameOver(ctx);

    this.bindLoop = this.loop.bind(this)
    this.hasEventBind = false

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId);

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )

    if ('help' == databus.status) {
      this.gameHelp.enterCall = _ => { this.start(); }
    } else {
      this.start();
    }
    this.initEvent();
  }


  // 游戏逻辑更新主函数
  update() {
    if ('over' == databus.status) {
      return;
    }
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width + 1, canvas.height + 1)

    //背景色
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, screenWidth, screenHeight);

    ctx.save();
    ctx.translate(0, screenHeight - screenWidth >> 1);
    ctx.scale(screenWidth / 640, screenWidth / 640);

    if ('help' == databus.status) {
      this.gameHelp.render(ctx);
    } else {
      this.gameLayer.render(ctx);

      if ('over' == databus.status) {
        this.gameOver.render(ctx);
      }
    }
    ctx.restore();
  }

  // 实现游戏帧循环
  loop() {
    databus.frame++;

    this.update();
    this.render();

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

  initEvent() {
    let mouseX = 0, mouseY = 0;

    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault();

      if ('over' == databus.status) {
        if (this.restart) {
          this.start();
        }
        return;
      }

      let x = e.targetTouches[0].clientX;
      let y = e.targetTouches[0].clientY;

      mouseX = x;
      mouseY = y;
    }).bind(this))

    canvas.addEventListener('touchend', ((e) => {
      e.preventDefault()

      let x = e.changedTouches[0].clientX;
      let y = e.changedTouches[0].clientY;

      if ('help' == databus.status) {
        this.gameHelp.handleTouch(mouseX, mouseY, x, y);
        return;
      }

      x = x - mouseX;
      y = y - mouseY;

      let t;
      if (x > 0) {
        if (y > x)
          t = 'down';
        else if (y < 0 && -y > x)
          t = 'up';
        else
          t = 'right';
      }
      else {
        if (y > -x)
          t = 'down';
        else if (y < 0 && -y > -x)
          t = 'up';
        else
          t = 'left';

      }
      if ((x * x + y * y) > 100) this.move(t);
    }).bind(this))
  }

  start() {
    databus.reset();
    databus.table[Math.floor(Math.random() * 16)] = 2;
    this.addRandNum();
  }

  move(type) {
    let changes = [], isAddNum = false;
    //console.log(type);
    for (let i = 0; i < 4; i++) {
      let b;
      switch (type) {
        case 'up':
          b = [i + 0 * 4, i + 1 * 4, i + 2 * 4, i + 3 * 4];
          break;
        case 'right':
          b = [3 + i * 4, 2 + i * 4, 1 + i * 4, 0 + i * 4];
          break;
        case 'down':
          b = [i + 3 * 4, i + 2 * 4, i + 1 * 4, i + 0 * 4];
          break;
        case 'left':
          b = [0 + i * 4, 1 + i * 4, 2 + i * 4, 3 + i * 4];
          break;
      }
      for (let j = 1, k = 0; j < 4; j++) {
        /* 找出k后面第一个不为空的项，下标为j，之后分三种情况 */
        if (databus.table[b[j]] > 0) {
          if (databus.table[b[k]] == databus.table[b[j]]) {//P1情况
            databus.table[b[k]] = 2 * databus.table[b[k]];
            databus.table[b[j]] = 0;
            changes[b[k]] = 1;
            k = k + 1;
            isAddNum = true;
          } else if (databus.table[b[k]] == 0) { //P2情况 
            databus.table[b[k]] = databus.table[b[j]];
            databus.table[b[j]] = 0;
            isAddNum = true;
          } else {// P3情况
            databus.table[b[k + 1]] = databus.table[b[j]];
            /* 原先两数不挨着 */
            if (j != k + 1) {
              databus.table[b[j]] = 0;
              isAddNum = true;
            }
            k = k + 1;
          }
        }
      }
    }

    //计算分数
    changes.forEach((value, index) => {
      if (value && 0 != value) {
        databus.score += databus.table[index];
      }
    });


    if (isAddNum) {
      this.addRandNum();
    }

    if (this.checkGameOver()) {
      databus.setBest(databus.score);
      databus.status = 'over';
      this.restart = false;
      setTimeout(_ => {
        this.restart = true;
      }, 1000);
    }
    //console.log(databus.table);
  }

  /*
   * 生成随机数
   */
  addRandNum() {
    let n = Math.floor(Math.random() * this.getNullCount());//生成随机位置
    databus.table.forEach((value, index) => {
      if (0 == value && 0 == n--) {
        databus.table[index] = Math.random() > .6 ? 2 : 4;//设定生成2的概率是4的概率的两倍
        databus.new = {
          index,
          scale: 0
        };
      }
    });
  }

  /*
   * 获取空位置数量
   */
  getNullCount() {
    return databus.table.filter(value => 0 == value).length;
  }

  /**
   * 检查游戏是否结束
   */
  checkGameOver() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (0 == databus.table
          || databus.table[i + 4 * j] == databus.table[i + 4 * (j + 1)]
          || databus.table[j + 4 * i] == databus.table[j + 1 + 4 * i]) {
          return false;
        }
      }
    }
    return true;
  }
}
