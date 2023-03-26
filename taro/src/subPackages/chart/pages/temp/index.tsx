import React, { PureComponent } from 'react';
// import { connect } from 'react-redux';

import Taro from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';

import ECcanvas, { Option } from '../../components/ECcanvas';

// import api from '../../api';

import css from './index.module.scss';

type StateProps = {};
type DispatchProps = {};
type OwnProps = {};
type OwnState = {
  options: Option | null;
};

class Comp extends PureComponent<
  OwnProps & StateProps & DispatchProps,
  OwnState
> {
  state = {
    options: null as OwnState['options'],
  };

  // onLoad(options) {}
  // componentDidMount() {}
  // componentWillUnmount() {}

  render() {
    let { options } = this.state;
    if (!options) return null;

    return <ECcanvas options={options} />;
  }
}

export default Comp;
// export default connect<StateProps, DispatchProps, OwnProps, any>(
//   (state) => ({}),
//   (dispatch) => ({}),
// )(Comp);
