/*

import CarouselVideo, { CarouselItem } from '../../../components/CarouselVideo';

CarouselVideoItem: CarouselItem<Item> = (props) => {
  let { item, index, isCurrent } = props;
  if (!isCurrent) return null;

  return <View></View>;
};

<CarouselVideo list={list}>
  {this.CarouselVideoItem}
</CarouselVideo>

itemKey=''
itemSrc=''
itemPoster=''
itemTitle=''



import CarouselVideo, {
  CarouselItem,
  CarouselRequest,
} from '../../components/CarouselVideo';

current={current}
onChange={this.onChange}
onChange: CarouselRequest<Item> = (e) => {
  let { list, data, current } = e;
};

onToUpper={this.onMore.bind(this, 'up')}
onToLower={this.onMore.bind(this, 'down')}
onMore = (mode: 'up' | 'down', e) => {
  let { list, data, current } = e;
};



import CarouselVideo, {
  CarouselItem,
  CarouselRequest,
} from '../../components/CarouselVideo';

request={this.request}
request: CarouselRequest<Item> = (e) => {
  let { mode, list, data, current } = e;

  return api({data})
    .then((res) => {
      let { list, pageSize, current } = res;

      return {
        mode,
        current: mode === 'init' ? current : null,
        list,
        pageSize,
      };
    });
};

*/

import React, {
  CSSProperties,
  memo,
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from 'react';

import Taro, { FC } from '@tarojs/taro';
import { Block, View, Image, Video, VideoProps } from '@tarojs/components';

import Carousel, {
  CarouselProps,
  CarouselItem,
  CarouselItemProps,
  CarouselRequest,
  CarouselEvent,
} from './Carousel.v2';
export type { CarouselItem, CarouselRequest, CarouselEvent };

export type CarouselVideoItemProps<T = any> = CarouselItemProps<T> &
  Omit<VideoProps, 'src'> & {
    children: CarouselItem<T>;

    /**元素键 */ itemKey?: string;
    /**视频地址键 */ srcKey?: string;
    /**视频封面键 */ posterKey?: string;
    /**视频标题键 */ titleKey?: string;
  };
const CarouselVideoItem: FC<CarouselVideoItemProps> = memo((props) => {
  let {
    children,

    item,
    index,
    isCurrent,

    itemKey = 'id',
    srcKey = 'src',
    posterKey = 'poster',
    titleKey = 'title',

    ...videoProps
  } = props;

  let id = `CarouselVideoItem__${item[itemKey] ?? index}`;

  let css = useMemo<Record<string, CSSProperties>>(() => {
    let fill: CSSProperties = {
      width: '100%',
      height: '100%',
    };
    let center: CSSProperties = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    };
    let absolute: CSSProperties = {
      position: 'absolute',
      zIndex: 1,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    };

    return {
      item: {
        position: 'relative',
        ...fill,
        ...center,
      },

      poster: {
        opacity: isCurrent ? '0' : '0.5',
        transition: 'opacity 0.5s',
        pointerEvents: 'none',
        ...absolute,
        ...fill,
        ...center, //H5图片居中
      },

      main: {
        position: 'relative',
        opacity: isCurrent ? '1' : '0',
        transition: 'opacity 0.5s',
        ...fill,
      },

      video: fill,

      cover: {
        pointerEvents: 'none',
        ...absolute,
        ...fill,
      },

      test: {
        position: 'absolute',
        top: '50%',
        right: 0,
        color: 'yellow',
      },
    };
  }, [isCurrent]);

  return (
    <View style={css.item} id={id}>
      <Image style={css.poster} src={item[posterKey]} mode='aspectFit' />

      {/* 添加中间层, 修复苹果往上滚动不显示问题 */}
      <View style={css.cover}>
        {children({
          item,
          index,
          isCurrent,
        })}
      </View>

      <View style={css.main}>
        {isCurrent && (
          <Video
            style={css.video}
            src={item[srcKey]}
            // poster={item[posterKey]}
            title={item[titleKey]}
            // initialTime={0}
            autoplay
            loop
            // muted
            // showMuteBtn
            controls={false}
            showProgress={false}
            showPlayBtn={false}
            showFullscreenBtn={false}
            // showScreenLockButton
            // vslideGestureInFullscreen={false}
            // enablePlayGesture
            // enableProgressGesture={false}
            // pictureInPictureMode={['push', 'pop']}
            {...videoProps}
          />
        )}
      </View>

      {process.env.NODE_ENV === 'development' && (
        <View style={css.test}>
          <View>id: {item[itemKey]}</View>
          <View>index: {index}</View>
          <View>isCurrent: {isCurrent + ''}</View>
        </View>
      )}
    </View>
  );
});

export type CarouselVideoProps<T = any> = CarouselProps<T> &
  Omit<VideoProps, 'src'> & {
    /**视频地址键 */ srcKey?: string;
    /**视频封面键 */ posterKey?: string;
    /**视频标题键 */ titleKey?: string;
  };
const CarouselVideo: FC<CarouselVideoProps> = memo((props) => {
  return (
    <Carousel vertical circular indicatorDots={false} slice={5} {...props}>
      {(itemProps) => <CarouselVideoItem {...itemProps} {...props} />}
    </Carousel>
  );
});

export default CarouselVideo;
