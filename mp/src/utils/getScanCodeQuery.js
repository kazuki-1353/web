/* 获取扫码进入小程序时的参数

import getScanCodeQuery from '../../utils/getScanCodeQuery';

onLoad(options) {
  let query = getScanCodeQuery(options);
}

*/

export const query2obj = (arg) => {
  if (typeof arg !== 'string') return arg;

  let arr = arg.split('&');
  let obj = arr.reduce((p, i) => {
    let [key, val] = i.split('=');

    // 判断是否重复
    let repeat = p[key];
    if (repeat) {
      val = Array.isArray(repeat) ? [...repeat, val] : [repeat, val];
    }

    return {
      ...p,
      [key]: val,
    };
  }, {});

  return obj;
};

export default (options = {}) => {
  let { scene, q } = options;

  /* 菊花码 */
  if (scene) {
    let query = decodeURIComponent(scene);
    return query2obj(query);
  }

  /* 二维码 */
  if (q) {
    let url = decodeURIComponent(q);
    let [, query] = url.split('?');
    return query2obj(query);
  }

  return options;
};
