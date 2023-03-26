import React, { memo, useRef, useEffect, CSSProperties } from 'react';

import Taro, { FC } from '@tarojs/taro';
import { View, Canvas } from '@tarojs/components';

import ThumbsUpAni from './canvas';

import css from './index.module.scss';

const width = 200;
const height = 600;
const style: { [key: string]: CSSProperties } = {
  wrap: {
    minWidth: width + 20 + 'rpx',
  },
  cvs: {
    width: width + 'rpx',
    height: height + 'rpx',
  },
};

const Comp: FC = (props) => {
  const canvasRef = useRef<any>();
  const thumbsUpAni = useRef<ThumbsUpAni>();
  const timeId = useRef<NodeJS.Timeout>();

  const start = () => {
    if (thumbsUpAni.current) thumbsUpAni.current.start();
  };
  const onTouchStart = () => {
    start();
    timeId.current = setInterval(start, 300);
  };
  const onTouchEnd = () => {
    if (timeId.current !== undefined) clearInterval(timeId.current);
  };

  useEffect(() => {
    setTimeout(() => {
      const query = Taro.createSelectorQuery();

      const { uid } = canvasRef.current;
      const ele = query.select(`#${uid}`);
      ele.node((res) => {
        let canvas = res.node;

        thumbsUpAni.current = new ThumbsUpAni({
          width,
          height,
          canvas,
          imgs: [
            '/static/fireworks-1.png',
            '/static/fireworks-2.png',
            '/static/fireworks-3.png',
            '/static/fireworks-4.png',
            '/static/fireworks-5.png',
            '/static/fireworks-6.png',
            '/static/fireworks-7.png',
            '/static/fireworks-8.png',
            '/static/fireworks-9.png',
            '/static/fireworks-10.png',
          ],
        });
      });
      query.exec();
    }, 1000);

    return onTouchEnd;
  }, []);

  return (
    <View className={css.wrap} style={style.wrap}>
      <Canvas className={css.cvs} style={style.cvs} ref={canvasRef} type='2d' />

      <View
        className={css.btn}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {props.children}
      </View>
    </View>
  );
};

export default memo(Comp);
