import Storage from './libs/storage';

let storage = new Storage();
let instance;

/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    if (instance)
      return instance;

    instance = this;

    this.reset();
  }

  reset() {
    this.status = 1 == storage.get('hadin') ? 'start' : 'help';
    this.restart = false;
    this.table = [...Array(16)].map(_ => 0);
    this.new = null;
    this.score = 0;
    this.best = storage.get('best') || 0;
  }

  setBest(value) {
    if (value > this.best) {
      this.best = value;
      storage.set('best', value);
    }
  }
}
