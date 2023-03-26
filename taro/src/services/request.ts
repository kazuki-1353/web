/*

import request from './utils/request';

let api = request({
  domain: '',
  header: {},
  data: {},
  success(res){return res;},
  fail(err){return;},
  retry(err){},
  retryCount: 5,
});

api({
  url: '',
  data: {},
  method: 'POST',
  debug: true,
  reducer: '', // 状态管理
}, {
  message: '',
  toast: '',
  debug: true,
})

.then(res=>{});

*/

import Taro from '@tarojs/taro';
import store from '../store';

/**解析对象的值, 如果为函数则替换为函数结果 */
export const objValue = (obj: Record<string, any>): Promise<typeof obj> => {
  let keys = Object.keys(obj);
  let proms = keys.map((k) => {
    let item = obj[k];
    if (typeof item === 'function') {
      return item() as Promise<any>;
    } else {
      return Promise.resolve(item);
    }
  });

  return Promise.all(proms).then((res) => {
    return res.reduce((p, v, k) => {
      let key = keys[k];
      p[key] = v;
      return p;
    }, {});
  });
};

/**移除对象中的无效值 */
export const removeVoid = (
  data: Record<string, any>,
): Record<string, NonNullable<any>> => {
  if (!data) return {};

  let keys = Object.keys(data);
  return keys.reduce((p, key) => {
    let val = data[key];

    if (val instanceof Array) {
      if (val.length) {
        return {
          ...p,
          [key]: val,
        };
      } else {
        return p;
      }
    }

    if (val instanceof Object) {
      if (!Object.keys(val).length) return p;
    }

    /* 移除无效值 */
    switch (val) {
      case undefined:
      case null:
      case '':
        return p;

      default:
        return {
          ...p,
          [key]: val,
        };
    }
  }, {});
};

type Opt = {
  domain?: string;
  header?: Record<string, any>;
  data?: Record<string, any>;

  success?: <T>(res: T) => T;
  fail?: <T>(err: T) => T;

  /**失败重试 */ retry?: (err: Res) => Promise<void | boolean>;
  /**失败重试次数 */ retryCount?: number;
};

type Arg<T = Record<string, any>> = {
  url: string;
  data?: Record<string, any>;
  method?: keyof Taro.request.method;
  debug?: boolean;

  reducer?:
    | string
    | ((res: T) => {
        type: string;
        payload: any;
      });
};

export type Option = {
  toast?: boolean | string;
  debug?: boolean;
};

type Res = {
  code?: number;
  msg?: string;
  data?: Record<string, any>;
};

export default (opt: Opt = {}) => {
  let { retryCount = 1 } = opt;

  let api = <R = Res>(arg: Arg, option: Option = {}) => {
    let prom = new Promise<R>((resolve, reject) => {
      if (option.toast) {
        let title = typeof option.toast === 'string' ? option.toast : '加载中…';
        Taro.showLoading({
          title,
          mask: true,
        });
      }

      objValue({
        'content-type': 'application/x-www-form-urlencoded',
        ...opt.header,
      })
        /* 请求接口 */
        .then((header) => {
          let requestOpt: Taro.request.Option = {
            header,
            method: arg.method || 'GET',
            url: opt.domain + arg.url,
            data: removeVoid({
              ...opt.data,
              ...arg.data,
            }),
          };

          return Taro.request(requestOpt);
        })

        /* 接口回调 */
        .then((res) => {
          switch (res.statusCode) {
            case 200:
              return res.data;

            default:
              throw res;
          }
        })

        /* 请求成功 */
        .then((res) => {
          if (arg.debug || option.debug) {
            console.log('接口', arg.url, {
              请求: arg.data,
              响应: res.data,
              状态: res.code,
              信息: res.msg,
            });
          }

          switch (res.code) {
            case 0: {
              if (option.toast) Taro.hideLoading();

              if (opt.success) {
                resolve(opt.success(res));
              } else {
                resolve(res);
              }

              break;
            }

            /* 重新登录 */
            case 401: {
              let retry = () => {
                if (!opt.retry) return;

                let isStop = opt.retry(res);
                if (isStop) return;

                api<R>(arg).then(resolve).catch(reject);
              };

              retryCount -= 1;
              if (retryCount < 0) {
                Taro.hideLoading();
                Taro.showModal({
                  title: '登录失败',
                  content: '登录态已经失效',
                  confirmText: '重新登录',
                }).then(({ confirm }) => {
                  if (confirm) {
                    retry();
                  } else {
                    throw res;
                  }
                });
              } else {
                retry();
              }

              break;
            }

            default:
              throw res;
          }
        })

        /* 请求失败 */
        .catch((err) => {
          // let { trace } = console;
          // if (trace) trace('请求失败');

          Taro.hideLoading();

          let res: any = opt.fail?.(err);
          if (res?.code === 0) {
            resolve(res);
          } else {
            let title: string;
            let { code, msg } = err;
            if (msg) {
              title = code === undefined ? msg : `${code} - ${msg}`;
            } else {
              title = err.toString();
            }

            Taro.showToast({
              title: title || '后台发生错误',
              icon: 'none',
              mask: true,
            });

            setTimeout(() => {
              reject(err);
            }, 1500);
          }
        });

      /* 状态管理 */
      prom.then((res: R) => {
        let { reducer } = arg;

        switch (typeof reducer) {
          case 'string': {
            store.dispatch({
              type: reducer,
              payload: res,
            });
            break;
          }

          case 'function': {
            let action = reducer(res);
            if (action?.payload) store.dispatch(action);
            break;
          }

          default:
            break;
        }

        return res;
      });

      return prom;
    });
  };

  return api;
};
