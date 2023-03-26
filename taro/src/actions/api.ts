import Taro from '@tarojs/taro';
import { Action, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import api from '../services';
import system from '../utils/system';

/** 小程序登录 */
export const login = (arg) => {
  return (put: Dispatch) => {
    return system
      .getToken((code) => {
        /* 跳过登录 */
        // return Promise.resolve('test');

        return api
          .login({
            code,
            ...arg,
          })
          .then((res) => {
            let { token } = res.data;
            return token;
          });
      })
      .then((token) => {
        // 每次调用接口都提交一遍
        put({
          type: 'token',
          payload: token,
        });

        return token;
      });
  };
};

/** 小程序登录重试 */
export const loginRetry = () => {
  return (put: Dispatch) => {
    return system.delToken().then(() => {
      put({
        type: 'token',
        payload: '',
      });
    });
  };
};

export const temp = (arg) => {
  return (put: Dispatch) => {
    return api.temp(arg).then((res) => {
      let payload = res.data;

      put({
        type: '',
        payload,
      });

      return payload;
    });
  };
};

export default {
  login,
  loginRetry,
};
