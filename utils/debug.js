/* 

import debug from '../../../utils/debug';

debug()
let enable=debug();

*/

import eruda from 'eruda';

let enable = false;
let count = 0;
let timer;

let setTimeout = (s) => {
  if (timer) return;

  timer = setTimeout(() => {
    count = 0;
    timer = null;
  }, s * 1000);
};

export default (e, s = 5, n = 10) => {
  if (enable) {
    return eruda;
  } else {
    setTimeout(s); /* 在5秒内有效 */
    count += 1; /* 点击10次后触发 */
    if (count < n) return;

    enable = true;
    return eruda.init();
  }
};
