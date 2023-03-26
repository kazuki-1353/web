/*

import navigate from '../../utils/navigate';

<button data-to="index" onClick="navigate">跳转</button>

navigate('')
navigate({
  to:'',
  subpackage:'',
  query:{name:val},

  mode:'redirect',
  mode:'tab',
  mode:'launch',
})
navigate({
  mode:'back',
  delta:2,
})

*/

import Taro from '@tarojs/taro';

/** 对象转为查询字串
 * @param {object} obj 格式: {name:val}
 * @param {boolean} isURI 是否对所有非标准字符进行编码
 * @returns string
 */
export function obj2query(obj?: Record<string, any>, isURI?: boolean) {
  if (obj) {
    if (typeof obj === 'string') {
      return `?${obj}`;
    } else {
      const keys = Object.keys(obj);

      /** 获取名值对数组 */
      const querys = keys.reduce((p, key) => {
        let val = obj[key];

        // 过滤空值
        if (val === undefined || val === '') {
          return p;
        } else {
          switch (val.constructor) {
            case Array:
            case Object:
              val = JSON.stringify(val);
              break;

            default:
              break;
          }
        }

        let item = '';

        // 是否对所有非标准字符进行编码
        if (isURI) {
          item = `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
        } else {
          item = `${key}=${val}`;
        }

        return [...p, item];
      }, []);

      /** 合并生成查询字串 */
      if (querys.length) return `?${querys.join('&')}`;
    }
  }

  return '';
}

/** 获取小程序配置 */
export function getConfig() {
  let config = import('../app.config');
  return config.then((res) => {
    return res.default || res;
  });
}

/** 返回首页
 * @param {object} query 格式: {name:val}
 * @param {string} mode 跳转模式, 默认为reLaunch
 */
export function toIndex(query = {}, mode: Option['mode'] = 'reLaunch') {
  getConfig().then((config: Taro.Config) => {
    let page = config.pages?.[0];
    let match = page?.match(/^pages\/(.+)\/index$/);
    let index = match?.[1] || 'index';

    /* 如果处于首页则终止 */
    let { router } = Taro.getCurrentInstance();
    let path = router?.path;
    let isIndex = path?.includes(`pages/${index}`);
    if (isIndex) return;

    let pages = Taro.getCurrentPages();
    let _path = pages[0].route;

    if (pages.length === 2 && _path?.includes(`pages/${index}`)) {
      /* 如果历史栈为两页并且上一页为首页则直接后退 */
      Taro.navigateBack();
    } else {
      navigate({
        to: index,
        mode,
        query,
      });
    }
  });
}

/** 返回上一页 */
export function toBack() {
  const pages = Taro.getCurrentPages();
  if (pages.length === 1) {
    toIndex();
  } else {
    Taro.navigateBack();
  }
}

/** 用于 switchTab 参数 */
export const query: Record<string, any> = {};

type Option = {
  to: string;
  subpackage?: string;
  delta?: number;
  query?: Record<string, any>;

  mode?:
    | 'back'
    | 'navigateBack'
    | 'tab'
    | 'switchTab'
    | 'launch'
    | 'reLaunch'
    | 'redirect'
    | 'redirectTo';
};
type Resolve = ReturnType<typeof Taro.navigateTo>;

/** 页面导航
 * @param {object} arg 复杂跳转
 * @param {string} [arg.to] 跳转地址
 * @param {string} [arg.subpackage] 分包名称
 * @param {string} [arg.mode] 跳转模式
 * @param {number} [arg.delta] 回退的层数
 * @param {object} [arg.query] 查询对象
 * @returns {Promise}
 */
function navigate(arg: string): Promise<Resolve>;
function navigate(arg: Taro.MpEvent): Promise<Resolve>;
function navigate(arg: Option): Promise<Resolve>;
function navigate(arg) {
  // 简单跳转
  if (typeof arg === 'string') {
    return Taro.navigateTo({ url: `/pages/${arg}/index` });
  } else {
    let opt: Option;
    if ('currentTarget' in arg) {
      opt = arg.currentTarget.dataset as Option;
    } else {
      opt = arg;
    }

    let mode;
    switch (opt.mode) {
      case 'back':
      case 'navigateBack':
        return Taro.navigateBack({
          delta: opt.delta,
        });

      case 'tab':
      case 'switchTab':
        query[opt.to] = opt.query; // 缓存查询对象
        mode = 'switchTab';
        break;

      case 'launch':
      case 'reLaunch':
        mode = 'reLaunch';
        break;

      case 'redirect':
      case 'redirectTo':
        mode = 'redirectTo';
        break;

      default:
        mode = 'navigateTo';
        break;
    }

    /** 分包目录 */
    const subPackage = opt.subpackage ? `/${opt.subpackage}` : '';

    const url = `${subPackage}/pages/${opt.to}/index${obj2query(
      opt.query,
      true,
    )}`;

    return Taro[mode]({ url }).catch(() => {
      query[opt.to] = opt.query; // 缓存查询对象
      return Taro.switchTab({ url });
    });
  }
}

export default navigate;
