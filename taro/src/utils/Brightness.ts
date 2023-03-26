import Taro from '@tarojs/taro';

let cache: Promise<number> = Promise.resolve(NaN);

export default class {
  constructor() {
    cache.then((value) => {
      if (Number.isNaN(value)) cache = this.get();
    });
  }

  get() {
    return new Promise<number>((resolve, reject) => {
      Taro.getScreenBrightness({
        success: (res) => {
          resolve(res.value);
        },
        fail: reject,
      });
    });
  }
  set(value: number) {
    return new Promise((resolve, reject) => {
      Taro.setScreenBrightness({
        value,
        success: resolve,
        fail: reject,
      });
    });
  }
  reset() {
    cache.then((value) => {
      if (Number.isNaN(value)) return;
      this.set(value);
    });
  }
}
