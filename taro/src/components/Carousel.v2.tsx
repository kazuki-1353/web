/*

import Carousel, { CarouselItem } from '../../components/Carousel.v2';

CarouselItem: CarouselItem<Item> = (props) => {
  let { item, index, isCurrent } = props;
  if (!isCurrent) return null;

  return <View></View>;
};

<Carousel list={list}>
  {this.CarouselItem}
</Carousel>

itemKey=''



import Carousel, {
  CarouselItem,
  CarouselEvent,
} from '../../components/Carousel.v2';

current={current}
onChange={this.onChange}
onChange: CarouselEvent<Item> = (e) => {
  let { list, data, current } = e;
};

onToUpper={this.onMore.bind(this, 'up')}
onToLower={this.onMore.bind(this, 'down')}
onMore = (mode: 'up' | 'down', e) => {
  let { list, data, current } = e;
};



// 简单请求
import Carousel, {
  CarouselItem,
  CarouselRequest,
} from '../../components/Carousel.v2';

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
  ReactNode,
  memo,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

import Taro, { FC } from '@tarojs/taro';
import {
  Block,
  View,
  Swiper,
  SwiperItem,
  SwiperProps,
} from '@tarojs/components';

export type CarouselEvent<T = any> = (e: {
  list: T[];
  data: T;
  current: number;
}) => void;
export type CarouselRequest<T = any> = (
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
  pageSize?: number;
  hasMore?: boolean;
}>;

export type CarouselItemProps<T = any> = {
  item: T;
  index: number;
  isCurrent: boolean;
};
export type CarouselItem<T = any> = (props: CarouselItemProps<T>) => ReactNode;

export type CarouselProps<T = any> = Omit<SwiperProps, 'onChange'> & {
  children: CarouselItem<T>;

  list?: T[];
  /**请求接口 */ request?: CarouselRequest<T>;
  /**切片列表长度, 非正奇数时不切片 */ slice?: number;
  /**元素键 */ itemKey?: string;

  /**切换事件 */ onChange?: CarouselEvent<T>;
  /**触顶事件 */ onToUpper?: CarouselEvent<T>;
  /**触底事件 */ onToLower?: CarouselEvent<T>;
};

const Comp: FC<CarouselProps> = (props) => {
  let {
    children,

    current = 0,
    list,
    request,
    slice,
    itemKey,

    onChange,
    onToUpper,
    onToLower,

    ...swiperProps
  } = props;

  let [hasMore, setHasMore] = useState(false);

  /**完整列表 */
  let [fullList, setFullList] = useState<any[]>([]);
  useEffect(() => {
    if (list?.length) {
      setFullList(list);
    }

    if (request) {
      request({
        mode: 'init',
      }).then((e) => {
        let {
          list: _list = [],
          current: _current,
          pageSize,
          hasMore: _hasMore = false,
        } = e;

        setHasMore(pageSize ? _list.length >= pageSize : _hasMore);

        if (_list.length) setFullList(_list);
        if (typeof _current === 'number') setListCurrent(_current);
      });
    }
  }, [list, request]);
  useEffect(() => {
    console.log('完整列表:', fullList);
  }, [fullList]);

  /**数组索引 */
  let [listCurrent, setListCurrent] = useState<number | null>(null);
  useEffect(() => {
    if (current === null) return;
    setListCurrent(current);
  }, [current]);

  /**切片列表 */
  let [sliceList, setSliceList] = useState<
    {
      data: any;
      index: number;
    }[]
  >([]);

  /**切片列表的长度 */
  let sliceLength = useMemo(() => {
    if (!Number.isInteger(slice)) return NaN;
    if (!slice) return NaN;
    if (slice < 1) return NaN;
    if ((slice & 1) === 0) return NaN;

    return slice;
  }, [slice]);

  /**切片索引 */
  let [sliceCurrent, setSliceCurrent] = useState<number>(current);

  /**切片逻辑 */
  useEffect(() => {
    let listLength = fullList.length;
    if (!listLength) return;
    if (listCurrent === null) return;

    /* 数组是否需要切片 */
    if (listLength > sliceLength) {
      let _list = Array.from(
        {
          length: sliceLength,
        },
        (v, k) => {
          /**前后元素数量 */
          let bothNumber = Math.floor(sliceLength / 2);

          /**偏移量 */
          let offset = k - sliceCurrent;
          if (offset < -bothNumber) offset += sliceLength;
          if (offset > bothNumber) offset -= sliceLength;

          /**索引 */
          let index = listCurrent ? listCurrent + offset : offset;
          if (index < 0) index += listLength;
          if (index >= listLength) index %= listLength;

          return {
            data: fullList[index],
            index,
          };
        },
      );

      // console.log('切片列表:', _list);
      setSliceList(_list);
    } else {
      let _list = fullList.map((data, index) => {
        return {
          data,
          index,
        };
      });

      setSliceList(_list);
      setSliceCurrent(listCurrent);
    }

    console.log('当前元素', listCurrent, fullList[listCurrent]);
  }, [sliceLength, fullList, listCurrent, sliceCurrent]);

  let onSwiperChange = useCallback(
    (e) => {
      let _sliceCurrent: number = e.detail.current;
      setSliceCurrent(_sliceCurrent);

      let { data, index } = sliceList[_sliceCurrent];
      // setListCurrent(index); //会闪一下
      setListCurrent(null); //异步渲染, 避免闪烁

      let eventProps = {
        current: index,
        list: fullList,
        data,
      };

      if (onChange) {
        onChange(eventProps);
      }

      let isUp = listCurrent === 1 && index === 0;
      let isDown =
        listCurrent === fullList.length - 2 && index === fullList.length - 1;

      switch (true) {
        /**触顶 */
        case isUp: {
          console.log('滑块触顶');

          if (onToUpper) {
            onToUpper(eventProps);
          }

          if (request && hasMore) {
            request({
              mode: 'up',
              ...eventProps,
            })
              .then((res) => {
                let { length } = res.list;
                setHasMore(
                  res.pageSize ? length >= res.pageSize : res.hasMore || false,
                );

                if (length) {
                  setListCurrent(length);
                  setFullList((_list) => [...res.list, ..._list]);
                }
              })
              .catch(() => {
                setListCurrent(index);
              });
          } else {
            setListCurrent(index);
          }
          break;
        }

        /**触底 */
        case isDown: {
          console.log('滑块触底');

          if (onToLower) {
            onToLower(eventProps);
          }

          if (request && hasMore) {
            request({
              mode: 'down',
              ...eventProps,
            })
              .then((res) => {
                let { length } = res.list;
                setHasMore(
                  res.pageSize ? length >= res.pageSize : res.hasMore || false,
                );

                if (length) {
                  setListCurrent(length);
                  setFullList((_list) => [..._list, ...res.list]);
                }
              })
              .catch(() => {
                setListCurrent(index);
              });
          } else {
            setListCurrent(index);
          }
          break;
        }

        default: {
          setListCurrent(index);
          break;
        }
      }
    },
    [
      request,
      hasMore,
      fullList,
      listCurrent,
      sliceList,
      onChange,
      onToUpper,
      onToLower,
    ],
  );

  let css = useMemo<Record<string, CSSProperties>>(() => {
    return {
      wrap: {
        width: '100%',
        height: '100%',
      },
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
        <View style={css.wrap}>
          {children({
            item: fullList[0],
            index: 0,
            isCurrent: true,
          })}
        </View>
      );

    default:
      return (
        <View style={css.wrap} catchMove>
          <Swiper
            style={css.swiper}
            {...swiperProps}
            current={sliceCurrent}
            onChange={onSwiperChange}
          >
            {sliceList.map((i) => {
              let { data, index } = i;
              let key = itemKey ? data[itemKey] : index;
              let isCurrent = listCurrent === index;

              return (
                <SwiperItem key={key}>
                  {children({
                    item: data,
                    index,
                    isCurrent,
                  })}
                </SwiperItem>
              );
            })}
          </Swiper>
        </View>
      );
  }
};

export default memo(Comp);
