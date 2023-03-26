/* 

import debugWXMP from '../../../utils/debugWXMP';

debugWXMP()
let enable=debugWXMP();

*/

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
  if (enable) return;

  setTimeout(s); /* 在5秒内有效 */
  count += 1; /* 点击10次后触发 */
  if (count < n) return;

  wx.setEnableDebug({
    enableDebug: true,
    success: () => {
      enable = true;
    },
  });
};
