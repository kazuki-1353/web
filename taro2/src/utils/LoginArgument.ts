import Taro, { ComponentClass, RouterInfo } from '@tarojs/taro';
import { connect, useSelector } from '@tarojs/redux';

import system from './system';
import { Salesman } from '../api';

type StateProps = {
  api: {
    salesman?: Salesman
  }
};

/**公共方法 */
interface Method {
  (Parent: { new (props: any): any }): any
}
interface Child {
  getSalesman: () => string
  getCustomer: () => string
  toIndex: (opt: {}) => Promise<{}>
}
const Method: Method = (Parent) => {
  return class extends Parent implements Child {
    constructor(props: { dispatch? } = {}) {
      super(props);

      /**分享 */
      Taro.showShareMenu({ withShareTicket: true });
      // 如果非类组件时
      if (!props.dispatch) {
        Taro.useShareAppMessage(
          this.onShareAppMessage.bind(Object.assign(this, props)),
        );
      }
    }

    /**分享 */
    onShareAppMessage() {
      const customer = this.getCustomer();
      // const salesman = this.getSalesman();
      // const query = `customer=${customer}&salesman=${salesman}`;
      const query = `customer=${customer}`;

      const sharePath = this.sharePath || '/pages/index/index';
      if (sharePath[0] !== '/') throw new Error('分享地址必须以 / 开头');

      const path = sharePath.includes('?')
        ? `${sharePath}&${query}`
        : `${sharePath}?${query}`;

      console.log('分享地址', path);

      return {
        path,
        title: this.shareTitle || '麦芽萌',
        imageUrl: this.shareImg || '',
      };
    }

    /**获取当前主播信息 */
    getSalesman() {
      if (this.params.salesman) {
        return this.params.salesman;
      } else {
        const { salesman } = this.props.api;
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

    toIndex(opt = {}) {
      return system.toIndex(
        {
          salesman: this.getSalesman(),
          ...opt,
        },
        'redirectTo',
      );
    }
  };
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

loginArgument.getSalesman()
loginArgument.getCustomer()

loginArgument.toIndex();
loginArgument.toIndex({NAME:VAL});//额外参数

*/
class FunctionComp {
  params = {} as RouterInfo['params'];
  props = {
    api: {} as StateProps['api'],
  };

  constructor() {
    /**路由 */
    const router = Taro.useRouter();
    this.params = router.params;

    /**状态 */
    useSelector((state: StateProps) => {
      this.props.api = state.api;
    });
  }
}
export default Method(FunctionComp);

/* 类组件

import {withLoginArgument} from '../../../utils/LoginArgument';
@withLoginArgument

this.sharePath = ''; // 设置分享地址
this.shareTitle = ''; // 设置分享标题
this.shareImg = ''; // 设置分享图片

this.getSalesman()
this.getCustomer()

this.toIndex();
this.toIndex({NAME:VAL});//额外参数

*/
type withLoginArgument = (Component: ComponentClass) => any;
export const withLoginArgument: withLoginArgument = (Component) => {
  interface ClassComp extends Taro.Component {
    props: StateProps
  }
  @connect(({ api }) => ({ api }))
  class ClassComp extends Component {
    constructor(props: StateProps) {
      super(props);

      /**路由 */
      const router = this.$router;
      this.params = router.params;
    }

    // componentDidMount() {
    //   super.componentDidMount && super.componentDidMount();
    // }

    params = {} as RouterInfo['params'];

    render() {
      return super.render();
    }
  }

  return Method(ClassComp);
};
