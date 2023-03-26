/* 计算器集合

let timer = new Timer((id) => {});

timer.setTimeout('ID', TIME);
timer.setInterval('ID', TIME);

timer.clear('ID');
timer.clearAll();

*/

let Timer = class {
  constructor(public run: Function) {}

  private timers = {};

  setTimeout = (id, timeout: number) => {
    let { run, set } = this;

    let timer = setTimeout(() => run(id), timeout);
    set(id, timer);
  };
  setInterval = (id, interval: number) => {
    let { run, set } = this;

    let timer = setInterval(() => run(id), interval);
    set(id, timer);
  };
  private set = (id, timer) => {
    let { timers, clear } = this;

    let _timer = timers[id];
    if (_timer) clear(id);

    timers[id] = timer;
  };

  /**移除指定计时器 */
  clear = (id) => {
    let { timers } = this;

    let timer = timers[id];
    clearTimeout(timer);
    clearInterval(timer);

    timers[id] = null;
  };
  /**移除所有计时器 */
  clearAll = () => {
    let { timers, clear } = this;

    let keys = Object.keys(timers);
    keys.forEach(clear);

    timers = {};
  };
};

module.exports = Timer;

// let timer = new Timer((id) => {
//   console.log(id);
// });
// timer.setTimeout('a', 3000);
// timer.setTimeout('b', 4000);
// timer.setTimeout('c', 5000);
