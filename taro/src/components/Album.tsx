/* 

import Album from '../../../components/Album';

<Album list={LIST} />
<Album list={LIST} indicator='custom' />

*/

import React, { FC, useState } from 'react';

import { View, Swiper, SwiperItem, Image } from '@tarojs/components';
import { ImageProps } from '@tarojs/components/types/Image';

import css from './Album.module.scss';

const Comp: FC<{
  list: string[];

  /**指示点模式 */ indicator?: 'white' | 'custom' | 'custom-white' | 'hide';
  /**指示点等待颜色 */ indicatorColor?: string;
  /**指示点激活颜色 */ indicatorActiveColor?: string;

  /**图片模式 */ imgMode?: keyof ImageProps.mode;
}> = (props) => {
  const { list = [], indicator = '', imgMode = 'aspectFit' } = props;
  let { indicatorColor = '', indicatorActiveColor = '' } = props;

  switch (indicator) {
    case 'white':
      indicatorColor = 'rgba(255,255,255,.5)';
      indicatorActiveColor = 'rgb(255,255,255)';
      break;

    default:
      break;
  }

  const isGroup = list.length > 1;

  const [current, setCurrent] = useState(0);
  const onChange = (e) => setCurrent(e.detail.current);

  return (
    <View className={css.body}>
      <Swiper
        className={css.swiper}
        circular={isGroup}
        autoplay={isGroup}
        indicator-dots={indicator === '' || indicator === 'white'}
        indicator-color={indicatorColor}
        indicator-active-color={indicatorActiveColor}
        onChange={onChange}
      >
        {list.map((v, k) => (
          <SwiperItem className={css.swiper__item} key={`${k}-${v}`}>
            <Image className={css.swiper__img} src={v} mode={imgMode}></Image>
          </SwiperItem>
        ))}
      </Swiper>

      {(indicator === 'custom' || indicator === 'custom-white') && (
        <View
          className={
            css.swiper__indicator +
            ` ${
              css[
                `swiper__indicator--${
                  indicator === 'custom' ? 'black' : 'white'
                }`
              ]
            }`
          }
        >
          {current + 1 + '/' + list.length}
        </View>
      )}
    </View>
  );
};

export default Comp;
