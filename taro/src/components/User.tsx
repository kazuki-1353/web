import React, { memo, useMemo } from 'react';

import Taro, { FC } from '@tarojs/taro';
import { View, Image, OpenData } from '@tarojs/components';

let rpx2rem = (rpx, design = 750) => Taro.pxTransform(rpx, design);

let css: {
  [key: string]: React.CSSProperties;
} = {
  wrap: {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: rpx2rem(225),
  },
  avatar: {
    overflow: 'hidden',
    margin: 'auto',
    width: rpx2rem(150),
    height: rpx2rem(150),
    borderRadius: '50%',
  },
  name: {
    overflow: 'hidden',
    width: '100%',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
};

const Comp: FC<{
  data?: Partial<Taro.UserInfo>;
  size?: number;
  style?: React.CSSProperties;
}> = (props) => {
  let { data, size, style } = props;

  let wrapCSS = useMemo(() => {
    return size
      ? {
          ...css.wrap,
          width: rpx2rem(size * 1.5),
        }
      : css.wrap;
  }, [size]);

  let avatarCSS = useMemo(() => {
    return size
      ? {
          ...css.avatar,
          width: rpx2rem(size),
          height: rpx2rem(size),
        }
      : css.avatar;
  }, [size]);

  if (style) {
    avatarCSS = {
      ...avatarCSS,
      ...style,
    };
  }

  return (
    <View style={wrapCSS}>
      {data?.avatarUrl ? (
        <Image style={avatarCSS} src={data.avatarUrl} mode='aspectFill' />
      ) : (
        <View style={avatarCSS}>
          <OpenData type='userAvatarUrl' />
        </View>
      )}

      <View style={css.name}>
        {data?.nickName ? data.nickName : <OpenData type='userNickName' />}
      </View>
    </View>
  );
};

export default memo(Comp);
