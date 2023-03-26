import React, { memo, CSSProperties } from 'react';

import Taro, { FC } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';

let rpx2rem = (rpx: number, design = 750) => Taro.pxTransform(rpx, design);

let css: {
  [key: string]: CSSProperties;
} = {
  wrap: {
    position: 'relative',
    display: 'inline-block',
  },
  logo: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
  },
};

const Comp: FC<{
  src: string;
  size?: number;
  logo?: string;
  logoSize?: number;
}> = (props) => {
  let { src, size = 214, logo, logoSize } = props;
  if (!src) return null;

  let width = rpx2rem(size);

  if (!logoSize) logoSize = size * 0.3;
  let logoWidth = rpx2rem(logoSize);

  return (
    <View style={css.wrap}>
      <Image
        style={{
          width: width,
          height: width,
        }}
        src={src}
        mode='aspectFit'
      />

      {logo && (
        <Image
          style={{
            ...css.logo,
            width: logoWidth,
            height: logoWidth,
          }}
          src={logo}
          mode='aspectFit'
        />
      )}
    </View>
  );
};

export default memo(Comp);
