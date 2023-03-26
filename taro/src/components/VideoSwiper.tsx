/*

import VideoSwiper, { VideoSwiperContent } from '../../../components/VideoSwiper';

VideoSwiperContent: VideoSwiperContent<Item> = (props) => {
  let { item, index, isShow } = props;
  if (!isShow) return null;

  return <View></View>;
};

<VideoSwiper list={list}>
  {this.VideoSwiperItem}
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

export type VideoSwiperEvent<T> = (e: {
  list: T[];
  data: T;
  current: number;
}) => void;
export type VideoSwiperRequest<T> = (
  e:
    | {
        mode: 'init';
      }
    | {
        mode: 'up' | 'down';
        list: T[];
        data: T;
        current: number;
      },
) => Promise<{
  mode: 'init' | 'up' | 'down';
  current: number | null;
  list: T[];
  hasMore: boolean;
}>;
export type VideoSwiperContent<T = any> = (props: {
  item: T;
  index: number;
  isShow: boolean;
}) => React.ReactElement | null;

export type VideoSwiperItemProps<T = any> = {
  children: VideoSwiperContent<T>;

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
    <View style={css.item}>
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
  children: VideoSwiperContent<T>;

  list?: T[];
  /**请求接口 */ request?: VideoSwiperRequest<T>;
  /**切片模式 */ slice?: boolean;

  /**元素键 */ itemKey?: string;
  /**视频地址键 */ srcKey?: string;
  /**视频封面键 */ posterKey?: string;
  /**视频标题键 */ titleKey?: string;

  /**切换事件 */ onChange?: VideoSwiperEvent<T>;
  /**触顶事件 */ onToUpper?: VideoSwiperEvent<T>;
  /**触底事件 */ onToLower?: VideoSwiperEvent<T>;
} & (Omit<SwiperProps, 'onChange'> & Omit<VideoProps, 'src'>);
const VideoSwiper: FC<VideoSwiperProps> = memo((props) => {
  let {
    children,
    list,
    request,
    itemKey = 'id',
    current = 0,
    onChange,
    onToUpper,
    onToLower,
    ...videoSwiperProps
  } = props;

  let [hasMore, setHasMore] = useState(false);

  /**完整列表 */
  let [fullList, setFullList] = useState<any[]>([]);
  useEffect(() => {
    console.log('VideoSwiper:', fullList);
  }, [fullList]);
  useEffect(() => {
    if (list?.length) {
      setFullList(list);
    }

    if (request) {
      request({
        mode: 'init',
      }).then((e) => {
        let { list: _list, current: _current, hasMore: _hasMore } = e;
        if (!_list.length) return;

        setFullList(_list);
        setHasMore(_hasMore);

        if (typeof _current === 'number') {
          setSwiperCurrent(_current);
          setShowCurrent(_current);
        }
      });
    }
  }, [list, request]);

  /**切片列表 */
  // let sliceList = useMemo(() => {
  //   return fullList.filter((i) => {
  //     return;
  //   });
  // }, [fullList]);

  /* 滑块索引 */
  let [swiperCurrent, setSwiperCurrent] = useState<number>(current);
  useEffect(() => {
    if (current === null) return;
    setSwiperCurrent(current);
    setShowCurrent(current);
  }, [current]);

  /**显示索引 */
  let [showCurrent, setShowCurrent] = useState<number | null>(current);
  useEffect(() => {
    if (showCurrent === null) return;

    let item = fullList?.[showCurrent];
    if (!item) return;

    console.log('VideoSwiper:', showCurrent, item);
  }, [fullList, showCurrent]);

  let onSwiperChange = useCallback(
    (e) => {
      let _current: number = e.detail.current;
      setSwiperCurrent(_current);

      let eventProps = {
        list: fullList,
        data: fullList[_current],
        current: _current,
      };

      if (onChange) {
        onChange(eventProps);
      }

      let isUp = swiperCurrent === 1 && _current === 0;
      let isDown =
        swiperCurrent === fullList.length - 2 &&
        _current === fullList.length - 1;

      switch (true) {
        /**触顶 */
        case isUp: {
          console.log('VideoSwiper:', 'toUpper');

          if (onToUpper) {
            onToUpper(eventProps);
          }

          if (request && hasMore) {
            setShowCurrent(null); //先隐藏元素

            request({
              mode: 'up',
              ...eventProps,
            }).then((res) => {
              let { length } = res.list;
              setShowCurrent(length);
              setHasMore(res.hasMore);
              if (length) setFullList((state) => [...res.list, ...state]);
            });
          } else {
            setShowCurrent(_current);
          }
          break;
        }

        /**触底 */
        case isDown: {
          console.log('VideoSwiper:', 'toLower');

          if (onToLower) {
            onToLower(eventProps);
          }

          if (request && hasMore) {
            setShowCurrent(null); //先隐藏元素

            request({
              mode: 'down',
              ...eventProps,
            }).then((res) => {
              let { length } = res.list;
              setShowCurrent(_current);
              setHasMore(res.hasMore);
              if (length) setFullList((state) => [...state, ...res.list]);
            });
          } else {
            setShowCurrent(_current);
          }
          break;
        }

        default: {
          setShowCurrent(_current);
          break;
        }
      }
    },
    [fullList, swiperCurrent, request, hasMore, onChange, onToUpper, onToLower],
  );

  let css = useMemo<Record<string, CSSProperties>>(() => {
    return {
      swiper: {
        width: '100%',
        height: '100%',
      },
    };
  }, []);

  switch (fullList.length) {
    case 0:
      return null;

    case 1:
      return (
        <VideoSwiperItem
          item={fullList[0]}
          index={0}
          isShow
          {...videoSwiperProps}
        >
          {children}
        </VideoSwiperItem>
      );

    default:
      return (
        <Swiper
          style={css.swiper}
          vertical
          indicatorDots={false}
          {...videoSwiperProps}
          circular={hasMore ? false : true}
          current={swiperCurrent}
          onChange={onSwiperChange}
        >
          {fullList.map((v, k) => {
            let id = `VideoSwiperItem__${v[itemKey] ?? k}`;
            let isShow = k === showCurrent;

            return (
              <SwiperItem key={id} itemId={id}>
                <VideoSwiperItem
                  isShow={isShow}
                  index={k}
                  item={v}
                  itemKey={itemKey}
                  {...videoSwiperProps}
                >
                  {children}
                </VideoSwiperItem>
              </SwiperItem>
            );
          })}
        </Swiper>
      );
  }
});

export default VideoSwiper;
