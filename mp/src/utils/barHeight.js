/* 

import barHeight from '../utils/bar-height';

barHeight()

 */

export default () => {
  let height;
  const info = wx.getSystemInfoSync();

  switch (true) {
    case info.model.indexOf('iPhone X') !== -1: {
      height = 176; // (44+44)*2
      break;
    }
    // case info.brand === 'iPhone': {
    // }
    case info.platform === 'ios': {
      height = 128; // (44+20)*2
      break;
    }
    // case info.platform === 'android': {
    //   height = 136; // (48+20)*2
    //   break;
    // }
    case info.platform === 'devtools': {
      height = 128; // (44+20)*2
      break;
    }
    default: {
      height = 96 + info.statusBarHeight * 2; // 48+?*2
      break;
    }
  }

  return height;
};
