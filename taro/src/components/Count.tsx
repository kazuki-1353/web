/* 

import Count from '../components/Count';

let count: number;
const getCount = (res: number) => {
  count = res;
};

<Count getCount={getCount} />

*/

import React, { FC, CSSProperties, memo, useState } from 'react';

import Taro from '@tarojs/taro';
import { View, Input, Block } from '@tarojs/components';

const rpx2rem = (rpx: number, design = 750) => {
  let isNumber = Number(rpx);
  let rem = isNumber ? Taro.pxTransform(rpx, design) : rpx;
  return rem ?? 0;
};

const height: CSSProperties = {
  height: rpx2rem(72),
  lineHeight: rpx2rem(72),
};
const css: { [key: string]: CSSProperties } = {
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
  },

  icon: {
    position: 'relative',
    paddingLeft: 10,
    paddingRight: 10,
    width: 30,
  },

  symbol: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,

    margin: 'auto',
    background: '#000',
  },
  symbolX: {
    width: 9,
    height: 1,
  },
  symbolY: {
    width: 1,
    height: 9,
  },

  input: {
    ...height,

    width: rpx2rem(120),
    borderStyle: 'solid',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    textAlign: 'center',
  },
};

/**管道函数 */
const pipe = (...funs) => (arg) => funs.reduce((p, v) => v(p), arg);

const Comp: FC<{
  getCount: (number) => void;

  type?: 'number' | 'digit';

  /**初始值 */ init?: number;
  /**最小值 */ min?: number;
  /**最大值 */ max?: number;

  /**数值前的插入字串 */ before?: string;
  /**数值后的插入字串 */ after?: string;

  /**是否使用fa库 */ fontawesome?: boolean;
  /**边框颜色 */ border?: string;

  /**输入内容颜色 */ color?: string;
  /**输入框背景 */ bg?: string;
}> = (props) => {
  const {
    getCount,

    type = 'number',
    init = 1,
    min = 0,
    max = Number.MAX_VALUE,

    before = '',
    after = '',

    border = 'transparent',
    color = '',
    bg = '',
    fontawesome = false,
  } = props;

  const [count, setCount] = useState(init);

  /**检查范围 */
  const checkRange = (newCount: number) => {
    switch (true) {
      case newCount < min:
        return min;

      case newCount > max:
        return max;

      default:
        return newCount;
    }
  };
  /**检查类型 */
  const checkType = (newCount: number) => {
    switch (type) {
      case 'number':
        return Math.round(newCount);

      case 'digit':
        return Math.round(newCount * 100) / 100;

      default:
        throw new Error('输入框类型错误');
    }
  };
  const onChange = (e) => {
    let newCount: number;

    const target = e.currentTarget;
    const { mode } = target.dataset;
    switch (mode) {
      case 'minus': {
        newCount = count - 1;
        break;
      }

      case 'plus': {
        newCount = count + 1;
        break;
      }

      case 'blur': {
        const { value } = e.detail;
        newCount = +value;

        // 移除插入字串
        if (before) newCount = +value.replace(new RegExp('^' + before), '');
        if (after) newCount = +value.replace(new RegExp(after + '$'), '');

        // 非数值时重置
        if (Number.isNaN(newCount)) newCount = init;
        break;
      }

      default:
        newCount = count;
        break;
    }

    const setNewCount = pipe(checkType, checkRange, setCount);
    setNewCount(newCount);
  };

  getCount && getCount(count);

  return (
    <View
      style={{
        ...css.wrap,
        borderColor: border,
      }}
    >
      <View
        style={{
          ...height,
          ...css.icon,
          opacity: count <= min ? 0.5 : 1,
        }}
        data-mode='minus'
        onClick={onChange}
      >
        {fontawesome ? (
          <View className='fa fa-minus' />
        ) : (
          <Block>
            <View style={{ ...css.symbol, ...css.symbolX }} />
          </Block>
        )}
      </View>

      <Input
        style={{
          ...css.input,
          borderColor: border,
          color,
          background: bg,
        }}
        alwaysEmbed
        type={type}
        value={before + count + after}
        data-mode='blur'
        onBlur={onChange}
      />

      <View
        style={{
          ...height,
          ...css.icon,
          opacity: count >= max ? 0.5 : 1,
        }}
        data-mode='plus'
        onClick={onChange}
      >
        {fontawesome ? (
          <View className='fa fa-plus' />
        ) : (
          <Block>
            <View style={{ ...css.symbol, ...css.symbolX }} />
            <View style={{ ...css.symbol, ...css.symbolY }} />
          </Block>
        )}
      </View>
    </View>
  );
};

export default memo(Comp);
