const STORAGE_KEY = 'HSUNA_STORAGE_WXMAPP';

const storage = window.localStorage;
let instance;

/**
 * storage管理器
 */
export default class Storage {
  constructor() {
    if (instance) {
      return instance;
    }
    if (!storage.getItem(STORAGE_KEY)) {
      this.init();
    }
    instance = this;
  }

  //初始化
  init() {
    storage.setItem(STORAGE_KEY, '{}');
  }

  //设置
  set(key, value) {
    let data = storage.getItem(STORAGE_KEY);
    data = JSON.parse(data);
    data[key] = value;
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }

  //读取
  get(key) {
    let data = storage.getItem(STORAGE_KEY);
    data = JSON.parse(data);
    return data[key];
  }

  //删除
  remove(key) {
    let data = storage.getItem(STORAGE_KEY);
    data = JSON.parse(data);
    delete data[key];
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }

  //清除
  clear() {
    storage.removeItem(STORAGE_KEY);
  }
}