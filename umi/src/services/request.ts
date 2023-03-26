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

import { request, getDvaApp } from 'umi';
import type { RequestOptionsInit } from 'umi-request';
import { message } from 'antd';
import { Toast, Modal} from 'antd-mobile';

/**解析对象的值, 如果为函数则替换为函数结果 */
export const objValue = (obj: Record<string, any>): Promise<typeof obj> => {
  const keys = Object.keys(obj);
  const proms = keys.map((k) => {
    const item = obj[k];
    if (typeof item === 'function') {
      return item() as Promise<any>;
    } else {
      return Promise.resolve(item);
    }
  });

  return Promise.all(proms).then((res) => {
    return res.reduce((p, v, k) => {
      const key = keys[k];
      p[key] = v;
      return p;
    }, {});
  });
};

/**移除对象中的无效值 */
export const removeVoid = (data: Record<string, any>): Record<string, NonNullable<any>> => {
  if (!data) return {};

  const keys = Object.keys(data);
  return keys.reduce((p, key) => {
    const val = data[key];

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
  method?: string;
  debug?: boolean;

  reducer?:
    | string
    | ((res: T) => {
        type: string;
        payload: any;
      });
};

export type Option = {
  message?: boolean | string;
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
  const retryAPI: {
    arg: Arg;
    resolve: any;
    reject: any;
  }[] = [];

  const api = <R = Res>(arg: Arg, option: Option = {}) => {
    const prom = new Promise<R>((resolve, reject) => {
      if (option.message) {
        const content = typeof option.message === 'string' ? option.message : '加载中…';
        message.loading(content, 0);
      }
      if (option.toast) {
        const content = typeof option.toast === 'string' ? option.toast : '加载中…';
        Toast.loading(content, 0);
      }

      objValue({
        'content-type': 'application/x-www-form-urlencoded',
        ...opt.header,
      })
        /* 获取参数 */
        .then((header) => {
          const req: RequestOptionsInit = {
            header,
            headers: header,
          };

          const data = removeVoid({
            ...opt.data,
            ...arg.data,
          });

          switch (arg.method) {
            case undefined:
            case '':
            case 'get':
            case 'GET':
              req.method = 'get';
              req.params = data;
              break;

            case 'post':
            case 'POST':
              req.method = 'post';
              req.data = data;
              break;

            default:
              req.method = arg.method;
              break;
          }

          return req;
        })

        /* 请求接口 */
        .then((req) => {
          const url = (opt.domain || '') + arg.url;
          return Promise.all([req, request(url, req)]);
        })

        /* 请求成功 */
        .then(([req, res]) => {
          if (arg.debug || option.debug) {
            console.log('接口', arg.url, {
              请求: req.data || req.params,
              响应: res.data,
              状态: res.code,
              信息: res.msg,
            });
          }

          switch (res.code) {
            case 0: {
              if (option.message) message.destroy();
              if (option.toast) Toast.hide();

              if (opt.success) {
                resolve(opt.success(res));
              } else {
                resolve(res);
              }

              break;
            }

            /* 重新登录 */
            case 401:
            case 402: {
              const retry = () => {
                if (!opt.retry) return;

                retryAPI.push({
                  arg,
                  resolve,
                  reject,
                });

                /* 只重试一遍 */
                if (retryAPI.length > 1) return;

                opt
                  .retry(res)
                  .then(() => {
                    retryCount -= 1;
                    while (retryAPI.length) {
                      const i = retryAPI.shift();
                      if (i) api<R>(i.arg).then(i.resolve).catch(i.reject);
                    }
                  })
                  .catch((err) => {
                    retryCount -= 1;
                    while (retryAPI.length) {
                      const i = retryAPI.shift();
                      if (i) i.reject(err);
                    }
                  });
              };

              if (retryCount) {
                retry();
              } else {
                message.destroy();
                Toast.hide();

                Modal.alert('登录失败', '登录态已经失效', [
                  {
                    text: '取消',
                    onPress: () => {
                      throw res;
                    },
                  },
                  { text: '重新登录', onPress: () => retry() },
                ]);
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

          message.destroy();
          Toast.hide();

          const res: any = opt.fail?.(err);
          if (res?.code === 0) {
            resolve(res);
          } else {
            let title: string;
            const { code, msg } = err;
            if (msg) {
              title = code === undefined ? msg : `${code} - ${msg}`;
            } else {
              title = err.toString();
            }

            message.error(title || '后台发生错误');
            // Toast.fail(title || '后台发生错误');

            setTimeout(() => {
              reject(err);
            }, 2000);
          }
        });
    });

    /* 状态管理 */
    prom.then((res: R) => {
      const { reducer } = arg;
      if (reducer) {
        const app = getDvaApp();
        const store = app._store;

        switch (typeof reducer) {
          case 'string': {
            store.dispatch({
              type: reducer,
              payload: res,
            });
            break;
          }

          case 'function': {
            const action = reducer(res);
            if (action?.payload) store.dispatch(action);
            break;
          }

          default:
            break;
        }
      }
    });

    return prom;
  };

  return api;
};
