/*

import Background from '../../../components/Background';

<Background image=''></Background>
imageMode='cover'
imageMode='contain'
imageMode='auto'

imagePosition=''
imagePosition='center'
imagePosition='left'
imagePosition='right'
imagePosition='top'
imagePosition='bottom'
imagePosition='leftTop'
imagePosition='leftBottom'
imagePosition='rightTop'
imagePosition='rightBottom'

imageWidth='100%'
imageHeight='100%'

fill
borderRadius={8}
color='#fff'

*/

import React, { FC, CSSProperties, ReactNode, memo, useMemo } from 'react';
import { Property } from 'csstype';

import Taro from '@tarojs/taro';
import { Block, View, Image, ImageProps } from '@tarojs/components';

export const rpx2rem = (rpx: number, design = 750) => {
  return Taro.pxTransform(rpx, design);
};

let imageModes = {
  /**填充容器缩放 */ cover: 'aspectFill',
  /**完整图片缩放 */ contain: 'aspectFit',
  /**指定宽度缩放 */ auto: 'widthFix',
};

type Position =
  | 'center'
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'leftTop'
  | 'leftBottom'
  | 'rightTop'
  | 'rightBottom';
let getPosition = (position: Position) => {
  let style = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
  };

  switch (position) {
    case 'left':
      return { ...style, right: 'auto' };

    case 'right':
      return { ...style, left: 'auto' };

    case 'top':
      return { ...style, bottom: 'auto' };

    case 'bottom':
      return { ...style, top: 'auto' };

    case 'leftTop':
      return { ...style, bottom: 'auto', right: 'auto' };

    case 'leftBottom':
      return { ...style, top: 'auto', right: 'auto' };

    case 'rightTop':
      return { ...style, bottom: 'auto', left: 'auto' };

    case 'rightBottom':
      return { ...style, top: 'auto', left: 'auto' };

    default:
      return style;
  }
};

const Comp: FC<{
  children?: ReactNode | ReactNode[];

  image?: string;
  imageMode?: keyof typeof imageModes;
  imageWidth?: number | string;
  imageHeight?: number | string;
  imagePosition?: Position;

  fill?: boolean;
  borderRadius?: number;
  color?: Property.Color;
}> = memo((props) => {
  let {
    children,

    image,
    imageMode = 'cover',
    imageWidth = '100%',
    imageHeight = '100%',
    imagePosition = 'center',

    fill = false,
    borderRadius = 0,
    color,
  } = props;

  let css = useMemo<Record<string, CSSProperties>>(() => {
    let _verticalAlign =
      process.env.TARO_ENV === 'rn'
        ? {}
        : {
            verticalAlign: 'middle',
          };

    return {
      wrap: {
        display: 'flex',
        flexDirection: 'column',
        height: fill ? '100%' : 'auto',
      },

      contain: {
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: color,
        height: fill ? '100%' : 'auto',
        borderRadius: rpx2rem(borderRadius),
      },

      img: {
        position: 'absolute',
        zIndex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: imageWidth,
        height: imageHeight,
        ..._verticalAlign,
        ...getPosition(imagePosition),
      },

      children: {
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        height: fill ? '100%' : 'auto',
      },
    };
  }, [children, imageWidth, imageHeight, imagePosition, color]);

  return (
    <View style={css.wrap}>
      <View style={css.contain}>
        {image && (
          <Image style={css.img} src={image} mode={imageModes[imageMode]} />
        )}
        {children && <View style={css.children}>{children}</View>}
      </View>
    </View>
  );
});

export default Comp;
