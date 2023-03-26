/*

import SwiperPlus, { SwiperPlusItem } from '../../components/SwiperPlus';

SwiperPlusItem: SwiperPlusItem<Item> = (props) => {
  let { item, index, isShow } = props;
  if (!isShow) return null;

  return <View></View>;
};

<SwiperPlus list={list}>
  {this.SwiperPlusItem}
</SwiperPlus>

itemKey=''



import SwiperPlus, {
  SwiperPlusItem,
  SwiperPlusEvent,
} from '../../components/SwiperPlus';

current={current}
onChange={this.onChange}
onChange: SwiperPlusEvent<Item> = (e) => {
  let { list, data, current } = e;
};

onToUpper={this.onMore.bind(this, 'up')}
onToLower={this.onMore.bind(this, 'down')}
onMore = (mode: 'up' | 'down', e) => {
  let { list, data, current } = e;
};



import SwiperPlus, {
  SwiperPlusItem,
  SwiperPlusRequest,
} from '../../components/SwiperPlus';

request={this.request}
request: SwiperPlusRequest<Item> = (e) => {
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
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

import Taro, { FC } from '@tarojs/taro';
import { Block, View, Swiper, SwiperItem } from '@tarojs/components';
import { SwiperProps } from '@tarojs/components/types/Swiper';

export type SwiperPlusEvent<T = any> = (e: {
  list: T[];
  data: T;
  current: number;
}) => void;
export type SwiperPlusRequest<T = any> = (
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

export type SwiperPlusItem<T = any> = (props: {
  item: T;
  index: number;
  isShow: boolean;
}) => React.ReactElement | null;

export type SwiperPlusProps<T = any> = {
  children: SwiperPlusItem<T>;

  list?: T[];
  /**请求接口 */ request?: SwiperPlusRequest<T>;
  /**切片列表长度, 非正奇数时不切片 */ slice?: number;
  /**元素键 */ itemKey?: string;

  /**切换事件 */ onChange?: SwiperPlusEvent<T>;
  /**触顶事件 */ onToUpper?: SwiperPlusEvent<T>;
  /**触底事件 */ onToLower?: SwiperPlusEvent<T>;
} & Omit<SwiperProps, 'onChange'>;

const Comp: FC<SwiperPlusProps> = (props) => {
  let {
    children,

    current = 0,
    list,
    request,
    slice,

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
        let { list: _list, current: _current, hasMore: _hasMore } = e;
        setHasMore(_hasMore);

        if (_list?.length) setFullList(_list);
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
                setHasMore(res.hasMore);

                let { length } = res.list;
                if (!length) return;

                setFullList((_list) => {
                  setListCurrent(length);
                  return [...res.list, ..._list];
                });
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
                setHasMore(res.hasMore);

                let { length } = res.list;
                if (!length) return;

                setFullList((_list) => {
                  setListCurrent(index);
                  return [..._list, ...res.list];
                });
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
      return children({
        item: fullList[0],
        index: 0,
        isShow: true,
      });

    default:
      return (
        <View style={css.wrap} catchMove>
          <Swiper
            style={css.swiper}
            {...swiperProps}
            current={sliceCurrent}
            onChange={onSwiperChange}
          >
            {sliceList.map((v, k) => {
              let { data, index } = v;
              let isShow = listCurrent === index;

              return (
                <SwiperItem key={k}>
                  {children({
                    item: data,
                    index,
                    isShow,
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
