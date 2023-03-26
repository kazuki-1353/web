import React, { ComponentClass } from 'react';

import Taro, { RouterInfo, getCurrentInstance } from '@tarojs/taro';
import { Block } from '@tarojs/components';

import appConfig from '../app.config';
import api, { Salesman } from '../api';
import store from '../store';
import config from '../config';
import { obj2query, toIndex } from './navigate';

type StateProps = {
  api: {
    salesman?: Salesman;
    config?: PromiseType<typeof api.getConfig>['data'];
  };
};

/**公共方法 */
interface Method {
  (Parent: { new (props: any): any }): any;
}
export interface Child {
  getSalesman: () => string;
  getCustomer: () => string;
  getStore: () => StateProps;
  toIndex: (opt: {}) => void;
}
const Method: Method = (Parent) => {
  class Comp extends Parent implements Child {
    constructor(props: { dispatch? } = {}) {
      super(props);

      /**分享 */
      Taro.showShareMenu({ withShareTicket: true });

      // 如果为函数组件时
      if (this.componentType === 'FunctionComponent') {
        Taro.useShareAppMessage(
          this.onShareAppMessage.bind(Object.assign(this, props)),
        );
      }
    }

    /**分享 */
    onShareAppMessage() {
      let { sharePath } = this;
      if (sharePath) {
        if (sharePath[0] !== '/') throw new Error('分享地址必须以 / 开头');
      } else {
        let current = getCurrentInstance();

        let { router } = current;
        if (router) {
          let params = obj2query(router.params, false);
          sharePath = router.path + params;
        } else {
          let home = appConfig.pages?.[0];
          sharePath = `/${home}`;
        }
      }

      const customer = `customer=${this.getCustomer()}`;
      const path = sharePath.includes('?')
        ? `${sharePath}&${customer}`
        : `${sharePath}?${customer}`;

      console.log('分享地址', path);

      return {
        path,
        title: this.shareTitle || config.shareTitle,
        imageUrl: this.shareImg || '',
      };
    }

    /**获取当前主播信息 */
    getSalesman() {
      if (this.params.salesman) {
        return this.params.salesman;
      } else {
        const state: StateProps = store.getState();
        const { salesman } = state.api;

        if (salesman) {
          return salesman.GUID;
        } else {
          return '';
        }
      }
    }

    /**获取当前用户信息 */
    getCustomer() {
      if (this.params.customer) {
        return this.params.customer;
      } else {
        const customer = Taro.getStorageSync('customer');
        return customer;
      }
    }

    getStore() {
      const state: StateProps = store.getState();
      return state;
    }

    toIndex(opt = {}) {
      toIndex({
        salesman: this.getSalesman(),
        ...opt,
      });
    }
  }

  return Comp;
};

/* 函数组件

import LoginArgument from '../../../utils/LoginArgument';

let loginArgument; // 在函数外声明

loginArgument = new LoginArgument(); // 在函数顶层调用
loginArgument = new LoginArgument({
  sharePath: '', // 分享地址
  shareTitle: '', // 分享标题
  shareImg: '', // 分享图片
});

loginArgument.toIndex();
loginArgument.toIndex({NAME:VAL});//额外参数

let salesman = loginArgument.getSalesman()
let customer = loginArgument.getCustomer()
let store = loginArgument.getStore()

*/
class FunctionComp {
  componentType = 'FunctionComponent';
  params = {} as RouterInfo['params'];

  constructor() {
    /**路由 */
    const router = Taro.useRouter();
    this.params = router.params;
  }
}
export default Method(FunctionComp);

/* 类组件

import { withLoginArgument, Child } from '../../utils/LoginArgument';

interface Comp extends Child {
   sharePath: string; //设置分享地址
   shareTitle: string; //设置分享标题
   shareImg: string; //设置分享图片
}

@withLoginArgument

this.sharePath = '';
this.shareTitle = '';
this.shareImg = '';

this.toIndex();
this.toIndex({NAME:VAL});//额外参数

let salesman = this.getSalesman();
let customer = this.getCustomer();
let store = this.getStore();

*/
export const withLoginArgument = (Comp: ComponentClass) => {
  class ClassComp extends Comp {
    componentType = 'ClassComponent';
    params = {} as RouterInfo['params'];

    onLoad(options) {
      this.params = options;
      super.onLoad && super.onLoad(options);
    }

    render() {
      return <Block>{super.render()}</Block>;
    }
  }

  return Method(ClassComp);
};
