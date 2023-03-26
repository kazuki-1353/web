/*

import Count from '../components/Count.v2';

let [count, setCount] = useState();
let onChange = useCallback((num: number) => {
  setCount();
});
<Count onChange={onChange} />

type="digit"

initValue={}
min={}
max={}

before=""
after=""

style={{}}

width={}
height={}
bg=""

borderWidth={}
borderColor=""
iconSize={}

*/

import React, {
  FC,
  CSSProperties,
  memo,
  useState,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
} from 'react';

import Taro from '@tarojs/taro';
import { Block, View, Input } from '@tarojs/components';

import { Property } from 'csstype';

export const rpx2rem = (rpx, design = 750) => {
  let isNumber = Number(rpx);
  let rem = isNumber ? Taro.pxTransform(rpx, design) : rpx;
  return rem ?? 0;
};

/**返回数值与小数点 */
export const getNumStr = (str: string) => {
  let reg = /(\d+\.?\d*)/;
  let match = str.match(reg);
  return match ? match[0] : null;
};

/**管道函数 */
export const pipe = (...funs) => (arg) => funs.reduce((p, v) => v(p), arg);

let iconParent: CSSProperties = {
  position: 'relative',
  boxSizing: 'content-box',
  overflow: 'hidden',
  display: 'inline-block',
  width: '1em',
  height: '1em',
  borderWidth: '0',
  borderStyle: 'solid',
  borderColor: 'currentcolor',
  verticalAlign: 'middle',
};
let iconChild: CSSProperties = {
  position: 'absolute',
  boxSizing: 'content-box',
  display: 'block',
  width: 0,
  height: 0,
  borderWidth: '0',
  borderStyle: 'solid',
  borderColor: 'currentcolor',
};

/**加号 */
export const Plus: FC = memo(() => {
  let css = useMemo<Record<string, CSSProperties>>(() => {
    let child = {
      ...iconChild,
      borderRadius: '0.25em',
      background: 'currentColor',
    };

    return {
      parent: iconParent,
      child1: {
        ...child,
        top: '0.4em',
        width: '1em',
        height: '0.2em',
      },
      child2: {
        ...child,
        top: '0',
        left: '0.4em',
        width: '0.2em',
        height: '1em',
      },
    };
  }, []);

  return (
    <View style={css.parent}>
      <View style={css.child1} />
      <View style={css.child2} />
    </View>
  );
});

/**减号 */
export const Minus: FC = memo(() => {
  let css = useMemo<Record<string, CSSProperties>>(() => {
    return {
      parent: iconParent,
      child: {
        ...iconChild,
        top: '0.4em',
        width: '1em',
        height: '0.2em',
        borderRadius: '0.25em',
        background: 'currentColor',
      },
    };
  }, []);

  return (
    <View style={css.parent}>
      <View style={css.child} />
    </View>
  );
});

const Comp: FC<{
  onChange: (num: number) => void;

  type?: 'number' | 'digit';
  value?: number;
  /**初始值 */ initValue?: number;
  /**最小值 */ min?: number;
  /**最大值 */ max?: number;

  /**数值前插入字串 */ before?: string;
  /**数值后插入字串 */ after?: string;

  /**样式 */ style?: CSSProperties;
  /**输入框宽度 */ width?: string | number;
  /**输入框高度 */ height?: string | number;
  /**输入框背景 */ bg?: Property.Background;
  /**边框宽度 */ borderWidth?: Property.BorderWidth;
  /**边框颜色 */ borderColor?: Property.BorderColor;
  /**图标尺寸 */ iconSize?: string | number;
}> = memo((props) => {
  let {
    onChange,

    type = 'number',
    value,
    initValue = 1,
    min = 0,
    max = Number.MAX_VALUE,

    before = '',
    after = '',

    style,
    width = 52,
    height = 52,
    bg = 'transparent',
    borderWidth = 1,
    borderColor = 'transparent',
    iconSize = 'unset',
  } = props;

  let [count, setCount] = useState<string>(`${value ?? initValue}`);
  useEffect(() => {
    if (value !== undefined) setCount(value + '');
  }, [value]);

  /**检查范围 */
  let checkRange = useCallback(
    (num: number) => {
      switch (true) {
        case num < min:
          return min;

        case num > max:
          return max;

        default:
          return num;
      }
    },
    [min, max],
  );

  /**检查类型 */
  let checkType = useCallback(
    (num: number) => {
      switch (type) {
        case 'number':
          return Math.round(num);

        case 'digit':
          return Math.round(num * 100) / 100;

        default:
          throw new Error('输入框类型错误');
      }
    },
    [type],
  );

  let onClick = useCallback(
    (e) => {
      let num = +count;

      let target = e.currentTarget;
      let { mode } = target.dataset;
      switch (mode) {
        case 'minus': {
          num--;
          break;
        }

        case 'plus': {
          num++;
          break;
        }

        case 'blur': {
          let { value: _value } = e.detail;
          let str = getNumStr(_value);
          num = str ? +str : initValue;
          break;
        }

        default:
          break;
      }

      let newCount = pipe(checkType, checkRange)(num);
      if (newCount !== num) return;

      setCount(newCount + '');
      onChange(newCount);
    },
    [onChange, initValue, checkRange, checkType, count],
  );

  let [, forceUpdate] = useReducer((n) => n + 1, 0);
  let onInput = useCallback((e) => {
    let { value: _value } = e.detail;
    let newCount = getNumStr(_value);
    if (newCount) setCount(newCount);

    forceUpdate(); //强制刷新, 避免相同数据无法更新
  }, []);

  let css = useMemo<Record<string, CSSProperties>>(() => {
    let icon: CSSProperties = {
      paddingLeft: 10,
      paddingRight: 10,
      fontSize: rpx2rem(iconSize),
    };

    return {
      wrap: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',

        height: rpx2rem(height),
        lineHeight: rpx2rem(height),

        borderStyle: 'solid',
        borderWidth: rpx2rem(borderWidth),
        borderRadius: rpx2rem(height),
        borderColor,
        ...style,
      },

      minus: {
        ...icon,
        opacity: +count <= min ? 0.5 : 1,
      },
      plus: {
        ...icon,
        opacity: +count >= max ? 0.5 : 1,
      },

      input: {
        width: rpx2rem(width),
        height: '100%',
        borderWidth: rpx2rem(borderWidth),
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderStyle: 'solid',
        borderColor,
        textAlign: 'center',
        background: bg,
      },
    };
  }, [
    count,
    max,
    min,
    style,
    width,
    height,
    bg,
    borderWidth,
    borderColor,
    iconSize,
  ]);

  return (
    <View style={css.wrap}>
      <View style={css.minus} data-mode='minus' onClick={onClick}>
        <Minus />
      </View>

      <Input
        style={css.input}
        alwaysEmbed
        type={type}
        value={before + count + after}
        data-mode='blur'
        onInput={onInput}
        onBlur={onClick}
      />

      <View style={css.plus} data-mode='plus' onClick={onClick}>
        <Plus />
      </View>
    </View>
  );
});

export default Comp;
