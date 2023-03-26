import React, { PureComponent } from 'react';

import Taro from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';

import ECcanvas, { Option } from '../../components/ECcanvas';

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

  onLoad(options) {
    this.setOption([
      {
        value: 55,
        name: '北京',
      },
      {
        value: 20,
        name: '武汉',
      },
      {
        value: 10,
        name: '杭州',
      },
      {
        value: 20,
        name: '广州',
      },
      {
        value: 38,
        name: '上海',
      },
    ]);
  }
  // componentDidMount() {}
  // componentWillUnmount() {}

  setOption(data) {
    let options = {
      backgroundColor: '#ffffff',

      legend: {
        type: 'scroll',
        orient: 'vertical',
        bottom: 20,
      },

      series: [
        {
          type: 'pie',

          // center: ['50%', '50%'],
          // radius: '50%',
          center: ['50%', 150],
          radius: [50, 100],

          label: {
            normal: {
              fontSize: 14,
            },
          },

          data,
        },
      ],
    };

    this.setState({ options });
  }

  render() {
    let { options } = this.state;
    if (!options) return null;

    return <ECcanvas options={options} />;
  }
}

export default Comp;
