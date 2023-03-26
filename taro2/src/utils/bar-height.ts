/* 

import barHeight from '../utils/bar-height';

barHeight()

 */

import Taro from '@tarojs/taro';

export default () => {
  const info = Taro.getSystemInfoSync();
  const { model, system, statusBarHeight } = info;

  // 是否为小程序
  if (model) {
    const ios = system.toLowerCase().search('ios') + 1;
    if (ios) {
      return (statusBarHeight + 44) * 2;
    } else {
      return (statusBarHeight + 48) * 2;
    }
  } else {
    return 64;
  }
};
