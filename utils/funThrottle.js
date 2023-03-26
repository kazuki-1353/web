/**节流, 先调用一次, 在指定时间后允许再次调用 */
let throttle = (fun, interval = 16.7) => {
  let first = true;
  let firstTimer;
  let timer;

  return (...arg) => {
    if (first) {
      // 首次调用
      fun(...arg);
      first = false;
    } else {
      if (!timer) {
        timer = setTimeout(() => {
          // 再次调用
          fun(...arg);
          timer = undefined;
        }, interval);
      }

      // 指定时间后重置
      clearTimeout(firstTimer);
      firstTimer = setTimeout(() => {
        first = true;
        firstTimer = undefined;
      }, interval);
    }
  };
};

module.exports = throttle;
