/* 数值过度

import NumGradient from '../../../utils/NumGradient';

let numGradient = new NumGradient(0); // 初始数
let numGradient = new NumGradient(0, 10); // 步进数

numGradient.update(100, (num) => {});
numGradient.interval((num) => { return num + 1; });

numGradient.clear();

*/

type CB = (num: number, done: boolean) => void;
let NumGradient = class {
  constructor(public source: number, public step?: number) {}

  private _timer?: NodeJS.Timer;
  clear() {
    global.clearInterval(this._timer);
  }

  /**过度到指定数值 */
  update(target: number, cb: CB) {
    this.clear();

    switch (true) {
      // 递增
      case this.source < target:
        return this._update('add', target, cb);

      // 递减
      case this.source > target:
        return this._update('subtract', target, cb);

      default:
        return Promise.resolve();
    }
  }
  private _update(type: 'add' | 'subtract', target: number, cb: CB) {
    return new Promise<void>((resolve) => {
      let step = this.step || this._getStep(target);
      let current = this.source;

      this._timer = global.setInterval(() => {
        switch (type) {
          /**递增 */
          case 'add':
            current += step;
            if (current < target) {
              cb(current, false);
              return;
            }
            break;

          /**递减 */
          case 'subtract':
            current -= step;
            if (current > target) {
              cb(current, false);
              return;
            }
            break;

          default:
            break;
        }

        this.clear();
        current = target;

        cb(target, true);
        resolve();
      }, 17);
    });
  }

  /**获取步进数 */
  private _getStep(target: number) {
    let differ = Math.abs(this.source - target);
    switch (true) {
      case differ < 200:
        return 1;

      case differ < 2000:
        return 10;

      case differ < 20000:
        return 100;

      default:
        return Math.floor(differ / 20);
    }
  }

  /**持续更新数值 */
  interval(cb: (num: number) => number, time = 17) {
    this.clear();
    let target = cb(this.source);

    this._timer = global.setInterval(() => {
      let _target = cb(target);
      if (target === _target) {
        this.clear(); //如果数值不变则终止
      } else {
        target = _target;
      }
    }, time);
  }
};

export default NumGradient;

/* 测试 */

// let numGradient = new NumGradient(0);
// numGradient.update(100, (num) => {
//   console.log(num);
// });
// let numGradient = new NumGradient(100);
// numGradient.update(0, (num) => {
//   console.log(num);
// });

// let numGradient = new NumGradient(0);
// numGradient.interval((num) => {
//   console.log(num);
//   if (num >= 1000) {
//     return num;
//   } else {
//     return num + 100;
//   }
// });

/* 测试 */
