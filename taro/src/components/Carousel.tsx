/*

import Carousel, {
  CarouselItem,
  CarouselItemProps,
} from '../../components/Carousel';

CarouselItem: CarouselItem<Item> = (props) => {
  let { item, index, isCurrent } = props;
  return <View className={css.carousel}></View>
};

<View className={css.menu}>
  <Carousel list={}>{this.CarouselItem}</Carousel>
</View>



// 当前选中
current={}

// 初始选中
initCurrent={}

// 选择菜单
onChange={this.onChangeCarousel}
onChangeCarousel = (e: CarouselItemProps<CarouselItem>) => {
  let { item, index } = e;
};

*/

import React, {
  CSSProperties,
  ReactNode,
  memo,
  useState,
  useCallback,
  useMemo,
} from 'react';

import Taro, { FC } from '@tarojs/taro';
import { View, Swiper, SwiperItem, SwiperProps } from '@tarojs/components';

export type CarouselItemProps<T = any> = {
  item: T;
  index: number;
  isCurrent: boolean;
};
export type CarouselItem<T = any> = (props: CarouselItemProps<T>) => ReactNode;

export type CarouselProps<T = any> = Omit<SwiperProps, 'onChange'> & {
  children: CarouselItem<T>;
  list: T[];
  itemKey?: string;

  /**当前选中 */ current?: number;
  /**初始选中 */ initCurrent?: number;

  onChange?: (e: CarouselItemProps<T>) => void;
};
export const Comp: FC<CarouselProps> = memo((props) => {
  let {
    children,
    list,
    itemKey,

    current: propCurrent,
    initCurrent,

    onChange,
  } = props;

  let [stateCurrent, setStateCurrent] = useState(() => {
    if (initCurrent) return initCurrent;
    if (propCurrent) return propCurrent;

    return 0;
  });

  let current = propCurrent ?? stateCurrent;

  let onChangeSwiper = useCallback(
    (e) => {
      let { current: index } = e.detail;
      setStateCurrent(index);

      onChange?.({
        item: list[index],
        index,
        isCurrent: true,
      });
    },
    [list, onChange],
  );

  let css = useMemo<Record<string, CSSProperties>>(() => {
    return {
      carousel: {
        width: '100%',
        height: '100%',
      },
    };
  }, []);

  return list.length === 1 ? (
    <View style={css.carousel}>
      {children({
        item: list[0],
        index: 0,
        isCurrent: true,
      })}
    </View>
  ) : (
    <Swiper style={css.carousel} current={current} onChange={onChangeSwiper}>
      {list.map((item, index) => {
        let key = itemKey ? item[itemKey] : index;
        let isCurrent = current === index;

        return (
          <SwiperItem key={key}>
            {children({
              item,
              index,
              isCurrent,
            })}
          </SwiperItem>
        );
      })}
    </Swiper>
  );
});

export default Comp;
