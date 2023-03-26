import React, { CSSProperties, PureComponent } from 'react';

import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

let style: CSSProperties = {
  transitionProperty: 'transform',
  transitionDuration: '60ms',
  transitionTimingFunction: 'ease-in-out',
};

type OwnProps = {
  children: React.ReactChild;

  base: number;
  max: number;

  x: boolean;
  y: boolean;
};
type OwnState = {
  x: number;
  y: number;
  z: number;
};

class Comp extends PureComponent<OwnProps, OwnState> {
  static defaultProps = {
    base: 100,
    max: 100,

    x: true,
    y: true,
  };

  state = {
    x: 0,
    y: 0,
    z: 0,
  };

  componentDidMount() {
    let { base, max, x, y } = this.props;

    Taro.startAccelerometer({
      // interval: 'ui',
    });
    Taro.onAccelerometerChange((res) => {
      this.setState({
        x: x ? this.numMax(res.x * base, max) : 0,
        y: y ? this.numMax(res.y * -base, max) : 0,
        z: this.numMax(res.z * base, max),
      });
    });
  }

  numMax = (num, max) => {
    switch (true) {
      case num > max:
        return max;

      case num < max * -1:
        return max * -1;

      default:
        return Math.round(num);
    }
  };

  render() {
    let { children } = this.props;
    let { x, y, z } = this.state;

    return (
      <View
        style={{
          ...style,
          transform: `translate3d(${x}px,${y}px,${z}px)`,
        }}
      >
        {children}
      </View>
    );
  }
}

export default Comp;
