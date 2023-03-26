/*

import VideoSwiper, { VideoSwiperContent } from '../../../components/VideoSwiper';

VideoSwiperContent: VideoSwiperContent<Item> = (props) => {
  let { item, index, isShow } = props;
  if (!isShow) return null;

  return <View></View>;
};

<VideoSwiper list={list}>
  {this.VideoSwiperContent}
</VideoSwiper>

itemKey=''
itemSrc=''
itemPoster=''
itemTitle=''



import VideoSwiper, {
  VideoSwiperContent,
  VideoSwiperEvent,
} from '../../components/VideoSwiper';

current={current}
onChange={this.onChange}
onChange: VideoSwiperEvent<Item> = (e) => {
  let { list, data, current } = e;
};

onToUpper={this.onMore.bind(this, 'up')}
onToLower={this.onMore.bind(this, 'down')}
onMore = (mode: 'up' | 'down', e) => {
  let { list, data, current } = e;
};



import VideoSwiper, {
  VideoSwiperContent,
  VideoSwiperRequest,
} from '../../components/VideoSwiper';

request={this.request}
request: VideoSwiperRequest<Item> = (e) => {
  let { mode, list, data, current } = e;

  return api({data})
    .then((res) => {
      let { list, limit, current } = res;

      // 根据每次请求返回的数组长度判断是否还有更多数据
      let hasMore = list?.length >= limit;

      return {
        mode,
        current: mode === 'init' ? current : null,
        list,
        hasMore,
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
import {
  Block,
  View,
  Image,
  Swiper,
  SwiperItem,
  Video,
} from '@tarojs/components';
import { SwiperProps } from '@tarojs/components/types/Swiper';
import { VideoProps } from '@tarojs/components/types/Video';

import SwiperPlus, {
  SwiperPlusProps,
  SwiperPlusItem,
  SwiperPlusEvent,
  SwiperPlusRequest,
} from './SwiperPlus.v2';

export type VideoSwiperItemProps<T = any> = {
  children: SwiperPlusItem<T>;

  item: T;
  index: number;
  isShow: boolean;

  /**元素键 */ itemKey?: string;
  /**视频地址键 */ srcKey?: string;
  /**视频封面键 */ posterKey?: string;
  /**视频标题键 */ titleKey?: string;
} & Omit<VideoProps, 'src'>;
export const VideoSwiperItem: FC<VideoSwiperItemProps> = memo((props) => {
  let {
    children,
    isShow,
    index,
    item,

    itemKey = 'id',
    srcKey = 'src',
    posterKey = 'poster',
    titleKey = 'title',

    ...videoSwiperProps
  } = props;

  let id = `VideoSwiperItem__${item[itemKey] ?? index}`;

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
        opacity: isShow ? '0' : '0.5',
        transition: 'opacity 0.5s',
        pointerEvents: 'none',
        ...absolute,
        ...fill,
        ...center, //H5图片居中
      },

      main: {
        position: 'relative',
        opacity: isShow ? '1' : '0',
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
  }, [isShow]);

  return (
    <View style={css.item} id={id}>
      <Image style={css.poster} src={item[posterKey]} mode='aspectFit' />

      {/* 添加中间层, 修复苹果往上滚动不显示问题 */}
      <View style={css.cover}>
        {children({
          item,
          index,
          isShow,
        })}
      </View>

      <View style={css.main}>
        {isShow && (
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
            {...videoSwiperProps}
          />
        )}
      </View>

      {process.env.NODE_ENV === 'development' && (
        <View style={css.test}>
          <View>id: {item[itemKey]}</View>
          <View>index: {index}</View>
          <View>isShow: {isShow + ''}</View>
        </View>
      )}
    </View>
  );
});

export type VideoSwiperProps<T = any> = {
  /**视频地址键 */ srcKey?: string;
  /**视频封面键 */ posterKey?: string;
  /**视频标题键 */ titleKey?: string;
} & SwiperPlusProps<T> &
  Omit<VideoProps, 'src'>;
const VideoSwiper: FC<VideoSwiperProps> = memo((props) => {
  return (
    <SwiperPlus vertical circular indicatorDots={false} slice={5} {...props}>
      {(itemProps) => <VideoSwiperItem {...itemProps} {...props} />}
    </SwiperPlus>
  );
});

export default VideoSwiper;
export type VideoSwiperContent<T> = SwiperPlusItem<T>;
export type VideoSwiperEvent<T> = SwiperPlusEvent<T>;
export type VideoSwiperRequest<T> = SwiperPlusRequest<T>;
