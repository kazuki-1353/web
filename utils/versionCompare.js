/* 版本对比

import versionCompare from '../utils/versionCompare';

switch (versionCompare(目前版本, 目标版本)) {
  // 目前版本比目标版本高
  case 1:
    break;

  // 目前版本比目标版本低
  case -1:
    break;

  default:
    break;
}

*/

let reg = new RegExp('\\d+(\\.\\d+)*');
let str2arr = (arg) => {
  let str = `${arg}`;
  let match = str.match(reg)[0];
  return match.split('.');
};

let fun = (v1, v2) => {
  let v1arr = str2arr(v1);
  let v2arr = str2arr(v2);

  let len = Math.max(v1arr.length, v2arr.length);

  for (let i = 0; i < len; i += 1) {
    let v1num = +v1arr[i] || 0;
    let v2num = +v2arr[i] || 0;

    if (v1num > v2num) return 1;
    if (v1num < v2num) return -1;
  }

  return 0;
};

module.exports = fun;

/* 测试 */
// console.log(fun('1.1.1', '2.2.2'));
// console.log(fun('1.1.1', '1.1.1'));
// console.log(fun('2.2.2', '1.1.1'));
/* 测试 */
