import React, {
  CSSProperties,
  memo,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { FC } from '@tarojs/taro';
import { View } from '@tarojs/components';

let startX: number;
let startY: number;
let isScrollX = false;
let isScrollY = false;
let isAnime = false;

let css: {
  [key: string]: CSSProperties;
} = {
  wrap: {
    position: 'relative',
    width: '100%',
    height: '100%',
    whiteSpace: 'nowrap',
  },
  swipe: {
    width: '100%',
    height: '100%',
  },
  item: {
    position: 'relative',
    display: 'inline-block',
    width: '100%',
    height: '100%',
  },
};

const Comp: FC<{
  items: JSX.Element[];
  current: number;
}> = (props) => {
  let { items, current } = props;
  let [maxCurrent] = useState(items.length - 1);
  let [currentIndex, setCurrentIndex] = useState(current);
  let [into, setInto] = useState(-100 * current + '%');

  useEffect(() => {
    if (items.constructor !== Array) throw new Error('请传入JSX数组');
  }, [items.constructor]);

  let reset = useCallback(() => {
    setInto(-100 * currentIndex + '%');
  }, [currentIndex]);

  let onTouchStart = useCallback((e) => {
    let [touch] = e.changedTouches;
    let { pageX, pageY } = touch;
    startX = pageX;
    startY = pageY;

    isAnime = false;
  }, []);

  let onTouchMove = useCallback(
    (e) => {
      let [touch] = e.changedTouches;
      let { pageX, pageY } = touch;

      let diffX = pageX - startX;
      if (isScrollX && !isScrollY) {
        setInto(-100 * currentIndex + '% + ' + diffX + 'px');
      } else {
        let diffY = pageY - startY;
        if (Math.abs(diffY) > 20) isScrollY = true;
        if (Math.abs(diffX) > 20) isScrollX = true;
      }
    },
    [currentIndex],
  );

  let onTouchEnd = useCallback(
    (e) => {
      isAnime = true;

      if (isScrollX && !isScrollY) {
        let [touch] = e.changedTouches;
        let { pageX } = touch;

        let diff = pageX - startX;
        switch (true) {
          // 向左拖拽
          case diff < -50:
            setCurrentIndex((state) => {
              // 是否还能向右滚动
              if (state < maxCurrent) {
                let index = state + 1;
                setInto(-100 * index + '%');
                return index;
              } else {
                reset();
                return state;
              }
            });
            break;

          // 向右拖拽
          case diff > 50:
            setCurrentIndex((state) => {
              // 是否还能向左滚动
              if (state > 0) {
                let index = state - 1;
                setInto(-100 * index + '%');
                return index;
              } else {
                reset();
                return state;
              }
            });
            break;

          default:
            reset();
            break;
        }
      }

      isScrollY = false;
      isScrollX = false;
    },
    [maxCurrent, reset],
  );

  return (
    <View
      style={css.wrap}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <View
        style={{
          ...css.swipe,
          transform: `translate(calc(${into}))`,
          transition: `${isAnime ? 'transform .5s' : 'none'}`,
        }}
      >
        {items.map((v, k) => {
          return (
            <View style={css.item} key={k}>
              {v}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default memo(Comp);
