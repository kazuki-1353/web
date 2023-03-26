/*

import SwiperPlus, { SwiperProps } from '../../../components/SwiperPlus';

SwiperPlusItem: SwiperPlusItem<Item> = (props) => {
  let { item, index } = props;
  return <View></View>;
};

<SwiperPlus list={}>
  {this.SwiperPlusItem}
</SwiperPlus>

*/

import React, { CSSProperties, memo } from 'react';

import Taro, { FC } from '@tarojs/taro';
import { Block, View, Swiper, SwiperItem } from '@tarojs/components';
import { SwiperProps } from '@tarojs/components/types/Swiper';

let fill: CSSProperties = {
  width: '100%',
  height: '100%',
};

export type SwiperPlusItem<T = any> = (props: {
  item: T;
  index: number;
}) => React.ReactElement;

const Comp: FC<{
  children: SwiperPlusItem<any>;
  list: any[];
  itemKey?: string;
} & SwiperProps> = (props) => {
  let { children, list, itemKey = 'id', ...swiperProps } = props;

  return list.length === 1 ? (
    children({
      item: list[0],
      index: 0,
    })
  ) : (
    <Swiper style={fill} {...swiperProps}>
      {list.map((item, index) => {
        let id = item[itemKey] ?? index;
        return (
          <SwiperItem key={id} itemId={id}>
            {children({
              item,
              index,
            })}
          </SwiperItem>
        );
      })}
    </Swiper>
  );
};

export default memo(Comp);
