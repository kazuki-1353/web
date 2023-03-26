let easeout = (...arg) => {
  let [cb, num = 100, end = 0, frequency = 10] = arg;

  let current = num - end;
  num -= current / frequency;

  let isRun = Math.abs(current) > 1;
  if (isRun) {
    cb(num, false);
    setTimeout(() => easeout(cb, num, end, frequency), 16.6);
  } else {
    cb(end, true);
  }
};

module.exports = easeout;
