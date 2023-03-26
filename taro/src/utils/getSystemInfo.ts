/*

import systemInfo from '../../utils/getSystemInfo';
import systemInfo, {
  px2rpx,
  rpx2px,
  rpx2rem,
  getNavBarSize,
  getSafeBottom,
} from '../../utils/getSystemInfo';

*/

import Taro from '@tarojs/taro';

const info = Taro.getSystemInfoSync();

if (process.env.TARO_ENV === 'h5') {
  // 修复PC端的尺寸问题
  info.windowWidth = document.body.scrollWidth;
}

let pxRatio: number;
let rpxRatio: number;
let getRatio = (ratio, dom?) => {
  if (!pxRatio || !rpxRatio) {
    let windowWidth = dom ? dom.clientWidth : info.windowWidth;

    pxRatio = windowWidth / 750;
    rpxRatio = 750 / windowWidth;
  }

  switch (ratio) {
    case 'pxRatio':
      return pxRatio;

    case 'rpxRatio':
      return rpxRatio;

    default:
      throw new Error('参数错误');
  }
};

/** px换算rpx */
export const px2rpx = (px: number, dom?: HTMLElement) => {
  let ratio = getRatio('rpxRatio', dom);
  let rpx = Math.round(px * ratio);
  return rpx;
};

/** rpx换算px */
export const rpx2px = (rpx: number, dom?: HTMLElement) => {
  let ratio = getRatio('pxRatio', dom);
  let px = Math.round(rpx * ratio);
  return px;
};

/** rpx转换rem */
export const rpx2rem = (arg, design = 750) => {
  if (!arg) return arg;

  switch (arg.constructor) {
    case Number: {
      let rem = Taro.pxTransform(arg, design);
      return rem;
    }

    case String: {
      let isNumber = Number(arg);
      if (isNumber) {
        return Taro.pxTransform(arg, design);
      } else {
        return arg;
      }
    }

    case Object: {
      let entries = Object.entries(arg);
      let obj = entries.reduce(
        (p, [k, v]) => ({
          ...p,
          [k]: rpx2rem(v, design),
        }),
        {},
      );
      return obj;
    }

    case Array: {
      let arr = arg.map((i) => rpx2rem(i, design));
      return arr;
    }

    default: {
      return arg;
    }
  }
};

let navBarSize: {
  /**导航栏顶部 */ navBarTop: number;
  /**导航栏底部 */ navBarBottom: number;
  /**导航栏宽度 */ navBarWidth: number;
  /**导航栏高度 */ navBarHeight: number;

  /**菜单高度 */ menuHeight: number;
  /**菜单宽度两边 */ menuWidthBetween: number;
  /**菜单宽度中间 */ menuWidthCentre: number;

  /**整体高度 */ height: number;
};

/** 获取导航栏相关尺寸 */
export const getNavBarSize = () => {
  if (navBarSize) return navBarSize;

  navBarSize = {
    navBarTop: info.statusBarHeight || 0,
    navBarBottom: 6,
    navBarWidth: info.screenWidth,
    navBarHeight: 44,

    menuHeight: 44,
    menuWidthBetween: 0,
    menuWidthCentre: 0,

    height: 50,
  };

  /* 是否为小程序 */
  if ('getMenuButtonBoundingClientRect' in Taro) {
    let rect = Taro.getMenuButtonBoundingClientRect();

    /**菜单按钮与状态栏的间距 */
    let marginTop = rect.top - navBarSize.navBarTop;

    /**菜单按钮与右边界的间距 */
    let marginRight = info.screenWidth - rect.right;

    navBarSize.navBarWidth = rect.left - marginRight * 2;
    navBarSize.navBarHeight = rect.bottom + marginTop;

    navBarSize.menuHeight = navBarSize.navBarHeight - navBarSize.navBarTop;
    navBarSize.menuWidthBetween = rect.width + marginRight * 2;
    navBarSize.menuWidthCentre =
      info.screenWidth - navBarSize.menuWidthBetween * 2;

    navBarSize.height = navBarSize.navBarHeight + navBarSize.navBarBottom;
  }

  return navBarSize;
};

let safeBottom;

/** 获取安全底部高度 */
export const getSafeBottom = () => {
  if (safeBottom !== undefined) return safeBottom;

  let isIOS = info.platform === 'ios';
  if (!isIOS) return 0;
  if (!info?.safeArea) return 0;

  let { bottom, height } = info.safeArea;
  safeBottom = rpx2rem(bottom - height);
  return safeBottom;
};

export default info;
