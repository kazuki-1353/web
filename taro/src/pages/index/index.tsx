import React, { PureComponent } from 'react';
// import { connect } from 'react-redux';

import Taro from '@tarojs/taro';
import { Block, View, Text, Image } from '@tarojs/components';

// import api from '../../api';

import css from './index.module.scss';

type StateProps = {};
type DispatchProps = {};
type OwnProps = {};
type OwnState = {
  data: any;
};

class Comp extends PureComponent<
  OwnProps & StateProps & DispatchProps,
  OwnState
> {
  state: OwnState = {
    data: {},
  };

  // onLoad(options) {}
  // componentDidMount() {}
  componentDidShow() {
    let instance = Taro.getCurrentInstance();
    let TabBar = instance.page?.getTabBar?.();
    if (TabBar) {
      let currentPath = 'pages/index/index';
      TabBar.setData?.({ currentPath });
    }
  }

  render() {
    let { data } = this.state;
    if (!data) return null;

    return <View className={css.wrap}></View>;
  }
}

export default Comp;
// export default connect<StateProps, DispatchProps, OwnProps, any>(
//   (state) => ({}),
//   (dispatch) => ({}),
// )(Comp);
