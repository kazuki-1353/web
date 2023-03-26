/*

import LinearGradient from '../../../components/LinearGradient';

<LinearGradient colors={[]}></LinearGradient>

startX={}
startY={}
endX={}
endY={}

locations={[]}
fill

*/

import React, {
  FC,
  CSSProperties,
  ReactNode,
  memo,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';

import Taro from '@tarojs/taro';
import { Block, View, Text, Image } from '@tarojs/components';

export const rpx2rem = (rpx: number, design = 750) => {
  return Taro.pxTransform(rpx, design);
};

const Comp: FC<{
  children: ReactNode | ReactNode[];
  colors: string[];

  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  locations?: number[];

  borderRadius?: number;
  fill?: boolean;
}> = memo((props) => {
  let {
    children,
    colors,

    startX = 0,
    startY = 0,
    endX = 0,
    endY = 1,
    locations,

    borderRadius = 0,
    fill,
  } = props;

  let css = useMemo<Record<string, CSSProperties>>(() => {
    if (locations) {
      if (locations.length === colors.length) {
        colors = colors.map((v, k) => {
          let i = locations ? locations[k] : 0;
          return `${v} ${i * 100}%`;
        });
      } else {
        console.error('locations 与 colors 的长度不一致');
      }
    }

    let diffX = Math.abs(endX - startX);
    let diffY = Math.abs(endY - startY);
    let atan = Math.atan(diffY / diffX);
    let deg = Math.round((atan * 360) / (2 * Math.PI));

    return {
      wrap: {
        display: 'flex',
        flexDirection: 'column',
        height: fill ? '100%' : 'auto',
      },

      contain: {
        position: 'relative',
        height: fill ? '100%' : 'auto',
        borderRadius: rpx2rem(borderRadius),
        backgroundImage: `linear-gradient(${deg + 90}deg, ${colors.join(
          ', ',
        )})`,
      },
    };
  }, [colors, startX, startY, endX, endY, locations, fill]);

  return (
    <View style={css.wrap}>
      <View style={css.contain}>{children}</View>
    </View>
  );
});

export default Comp;
