/*

import Progress from '../../../components/Progress';

<Progress percent={percent}></Progress>

width=''
height=''
radius={30}

backColor=''
frontColor=''

showInfo='inside'
infoStyle={{}}

animation

*/

import React, { FC, CSSProperties, memo, useMemo } from 'react';

import Taro from '@tarojs/taro';
import { Block, View } from '@tarojs/components';

import { Property } from 'csstype';

let rpx2rem = (rpx, design = 750) => {
  let isNumber = Number(rpx);
  let rem = isNumber ? Taro.pxTransform(rpx, design) : rpx;
  return rem ?? 0;
};

const Comp: FC<{
  percent: number;

  width?: number | string;
  height?: number | string;
  radius?: number | string;

  /**后景色 */ backColor?: Property.Color;
  /**前景色 */ frontColor?: Property.Color;

  /**百分比 */ children?: React.ReactChild | React.ReactChild[];
  /**百分比类型 */ showInfo?: 'none' | 'inside' | 'outside';
  /**百分比样式 */ infoStyle?: CSSProperties;

  /**是否有渐变动画 */ animation?: boolean;
}> = (props) => {
  let {
    percent,
    children,

    width = '100%',
    height = '100%',
    radius = 0,

    backColor = '#EBEBEB',
    frontColor = '#09BB07',

    showInfo = 'none',
    infoStyle,

    animation = true,
  } = props;

  let css = useMemo<Record<string, CSSProperties>>(
    () => ({
      wrap: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      },
      back: {
        position: 'relative',
        overflow: 'hidden',
        width: rpx2rem(width),
        height: rpx2rem(height),
        borderRadius: rpx2rem(radius),
        backgroundColor: backColor,
      },
      front: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: rpx2rem(radius),
        backgroundColor: frontColor,
        transition: animation ? 'transform 0.5s' : 'none',
      },
      textInside: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: rpx2rem(16),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        ...infoStyle,
      },
      textOutside: {
        marginLeft: rpx2rem(16),
        marginRight: rpx2rem(16),
        ...infoStyle,
      },
    }),
    [width, height, radius, backColor, frontColor, infoStyle, animation],
  );

  let front = useMemo<CSSProperties>(() => {
    if (process.env.TARO_ENV === 'rn') {
      return {
        ...css.front,
        left: `-${100 - percent}%`,
      };
    } else {
      return {
        ...css.front,
        transform: `translate(-${100 - percent}%)`,
      };
    }
  }, [css, percent]);

  return (
    <View style={css.wrap}>
      <View style={css.back}>
        <View style={front} />

        {showInfo === 'inside' && (
          <View style={css.textInside}>{children ?? percent + '%'}</View>
        )}
      </View>

      {showInfo === 'outside' && (
        <View style={css.textOutside}>{children ?? percent + '%'}</View>
      )}
    </View>
  );
};

export default memo(Comp);
