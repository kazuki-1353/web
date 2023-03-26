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
  ReactNode,
  memo,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

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

  let css = useMemo(() => {
    return StyleSheet.create({
      wrap: {
        display: 'flex',
        flexDirection: 'column',
        height: fill ? '100%' : 'auto',
      },

      contain: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: fill ? '100%' : 'auto',
        borderRadius: +rpx2rem(borderRadius),
      },
    });
  }, [fill]);

  let _locations = useMemo(() => {
    if (!locations) return;

    if (locations.length === colors.length) {
      return locations;
    } else {
      console.error(new Error('locations 与 colors 的长度不一致'));
      return;
    }
  }, [colors, locations]);

  return (
    <View style={css.wrap}>
      <LinearGradient
        style={css.contain}
        colors={colors}
        start={{
          x: startX,
          y: startY,
        }}
        end={{
          x: endX,
          y: endY,
        }}
        locations={_locations}
      >
        {children}
      </LinearGradient>
    </View>
  );
});

export default Comp;
