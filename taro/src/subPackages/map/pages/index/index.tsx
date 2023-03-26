import React, { PureComponent } from 'react';
// import { connect } from 'react-redux';

import Taro from '@tarojs/taro';
import { Block, View, Text, Image } from '@tarojs/components';

// import api from '../../services';
import MapPlus from '../../components/MapPlus';

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
  state = {
    data: {},
  };

  componentDidMount() {}
  onLoad(options) {}

  render() {
    let { data } = this.state;
    if (!data) return null;

    return (
      <View className={css.wrap}>
        <MapPlus name='aaa' longitude={113.32452} latitude={23.099994} />
      </View>
    );
  }
}

export default Comp;
// export default connect<StateProps, DispatchProps, OwnProps, any>(
//   (state) => ({}),
//   (dispatch) => ({}),
// )(Comp);
