/* 

import Test from '../Test';

<Test state={this.state} setState={this.setState.bind(this)} />

*/

import React, { PureComponent, CSSProperties } from 'react';

import { View, Button, CheckboxGroup, Checkbox } from '@tarojs/components';

let css: {
  [key: string]: CSSProperties;
} = {
  wrap: {
    position: 'fixed',
    zIndex: 9999,
    top: '50px',
    padding: '6px',
    fontSize: '16px',
    color: '#fff',
    background: 'rgba(0,0,0,.5)',
  },
  input: {
    marginLeft: '6px',
    padding: '6px 0',
    borderBottom: '1px solid',
    cursor: 'pointer',
  },
  btn: {
    marginTop: '6px',
    width: '100%',
    cursor: 'pointer',
  },
};

type Opts = {
  [key: string]: boolean;
};

const Test = class extends PureComponent<
  {
    /**选项列表 */ state: { [key: string]: any };
    /**设置选项列表 */ setState: (opts) => void;

    /**键名 */ key: string;
    /**样式 */ style?: CSSProperties;
  },
  {}
> {
  static defaultProps = {
    key: 'devOpt',
  };

  state = {
    /**是否显示 */ isShow: true,
  };

  onChange = (e) => {
    let { state, setState, key } = this.props;

    let keys = Object.keys(state[key]);
    let opts: Opts = keys.reduce((p, k) => {
      return {
        ...p,
        [k]: false,
      };
    }, {});

    let { value } = e.detail;
    value.forEach((k) => {
      opts[k] = true;
    });

    setState({
      [key]: opts,
    });
  };

  onClose = () => {
    this.setState({
      isShow: false,
    });
  };

  render() {
    let { isShow } = this.state;
    if (!isShow) return null;

    let { state, key, style = {} } = this.props;

    let opts: Opts = state[key];

    if (!opts) return null;

    return (
      <View
        style={{
          ...css.wrap,
          ...style,
        }}
      >
        <View>DEV OPTS</View>

        <CheckboxGroup onChange={this.onChange}>
          {Object.entries(opts).map(([k, v], index) => (
            <View key={k} style={css.input}>
              <Checkbox value={k} checked={v}>
                {`${index + 1}. ${k}`}
              </Checkbox>
            </View>
          ))}
        </CheckboxGroup>

        <Button style={css.btn} onClick={this.onClose}>
          Ⅹ
        </Button>
      </View>
    );
  }
};

export default Test;
