/*

import Movable, {
  MovableLists,
  MovableItem,
} from '../../components/Movable';

onMovableChange = (lists: MovableLists<Data>) => {
  this.setState((state) => {
    if (lists === state.lists) {
      return { lists: [...lists] };
    } else {
      let list = lists.reduce<List>((p, v, k) => {
        return [...p, ...v.list];
      }, []);

      return { lists };
    }
  });
};

MovableItem: MovableItem<Data> = (props) => {
  let { data, index } = props;
  if (!data) return null;

  return (
    <View></View>
  );
};

let lists = list.reduce<MovableLists<Data>>((p, i) => {
  let [top, bottom] = p;
  let topList = top?.list || [];
  let bottomList = bottom?.list || [];

  if (i.isTop) {
    return [
      {
        x: x,
        y: y1,
        list: [...topList, i],
      },
      {
        x: x,
        y: y2,
        list: bottomList,
      },
    ];
  } else {
    return [
      {
        x: x,
        y: y1,
        list: topList,
      },
      {
        x: x,
        y: y2,
        list: [...bottomList, i],
      },
    ];
  }
}, []);

// 目前只支持在页面最顶层引用
<Movable
  lists={lists}
  item={this.MovableItem}
  itemKey={}
  itemWidth={}
  itemHeight={}
  columns={}
  gapCol={}
  gapRow={}
  autoSize='vertical'
  onChange={this.onMovableChange}
>
  {(MovableAreas) => {
    let [Top, Bottom] = MovableAreas;

    return (
      <View className='wrap'>
        <Top />
        <View>间隔</View>
        <Bottom />
      </View>
    );
  }}
</Movable>

*/

import React, {
  FC,
  ReactNode,
  CSSProperties,
  memo,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';

import Taro, { NodesRef } from '@tarojs/taro';
import { Block, View, Text } from '@tarojs/components';

export const MovableItemName = 'MovableItemName';

export const slice = (arr: any[], index: number, newItem?, isInsert?) => {
  let left = arr.slice(0, index);
  let right = arr.slice(index + (isInsert ? 0 : 1));
  if (newItem === undefined) {
    return [...left, ...right];
  } else {
    return [...left, newItem, ...right];
  }
};

export const systemInfo = Taro.getSystemInfoSync();
export const rpx2px = (rpx: number) => {
  let windowWidth =
    process.env.TARO_ENV === 'h5'
      ? document.body.scrollWidth
      : systemInfo.windowWidth;

  let pxRatio = windowWidth / 750;
  let px = Math.round(rpx * pxRatio);
  return px;
};
export const rpx2rem = (rpx: number | string, design = 750): string => {
  let num = Number(rpx);
  if (Number.isNaN(num)) {
    return `${rpx}`;
  } else {
    return Taro.pxTransform(num, design);
  }
};

/**获取元素坐标 */
export const getRects = (selector: string) => {
  return new Promise<NodesRef.BoundingClientRectCallbackResult[]>((resolve) => {
    let query = Taro.createSelectorQuery();
    let element = query.selectAll(selector);
    element
      .boundingClientRect((rect) => {
        if (Array.isArray(rect)) {
          resolve(rect);
        } else {
          resolve([]);
        }
      })
      .exec();
  });
};

const PlaceHolder: FC = memo(() => {
  let css = useMemo<Record<string, CSSProperties>>(() => {
    return {
      wrap: {
        position: 'relative',
        overflow: 'hidden',
        display: 'block',
        width: '100%',
        height: '100%',
        borderRadius: '10px',
        background: '#e5e5e5',
      },
      before: {
        position: 'absolute',
        top: '45%',
        left: '30%',
        width: '40%',
        height: '10%',
        borderRadius: '25%',
        background: '#fff',
      },
      after: {
        position: 'absolute',
        top: '30%',
        left: '45%',
        width: '10%',
        height: '40%',
        borderRadius: '25%',
        background: '#fff',
      },
    };
  }, []);

  return (
    <View style={css.wrap}>
      <View style={css.before} />
      <View style={css.after} />
    </View>
  );
});

type MovableAreaProps<T> = {
  list: T[];
} & MovableProps<T>;
const MovableArea: FC<MovableAreaProps<Record<string, any>>> = memo((props) => {
  let {
    list,

    itemHeight,
    columns = 1,
    gapRow = 0,
  } = props;

  let style = useMemo<CSSProperties>(() => {
    let row = Math.ceil((list.length + 1) / columns);
    let height = row * (itemHeight + gapRow);

    return {
      height: rpx2px(height) + 'px',
    };
  }, [list, itemHeight, columns, gapRow]);

  return <View style={style} />;
});

export type ListMergeItem<T> = {
  data: T | null;
  index: number;
  position: number;
  x: string;
  y: string;
  width: string;
  height: string;
  opacity: string;
};

export type MovableViewProps<T> = {
  children: ReactNode | null;
  isSelect: boolean;
} & ListMergeItem<T>;
const MovableView: FC<MovableViewProps<Record<string, any>>> = memo((props) => {
  let {
    children,
    isSelect,

    x,
    y,

    width,
    height,
    opacity,
  } = props;

  let style = useMemo<CSSProperties>(() => {
    return {
      position: 'absolute',
      zIndex: isSelect ? 2 : 1,
      left: x,
      top: y,

      width,
      height,
      opacity,

      transitionProperty: isSelect ? 'none' : 'left, top, opacity',
      transitionDuration: '0.5s',
    };
  }, [isSelect, x, y, width, height, opacity]);

  return (
    <View className={MovableItemName} style={style}>
      {children}
    </View>
  );
});

export type MovableLists<T> = {
  list: T[];
  x: number;
  y: number;
}[];

export type MovableItem<T> = (props: {
  data: T | null;
  index: number;
}) => ReactNode | null;

export type MovableProps<T> = {
  children: (MovableAreas: FC[]) => ReactNode;

  lists: MovableLists<T>;
  item: MovableItem<T>;
  placeholder?: () => ReactNode;

  itemKey?: string;
  itemWidth: number;
  itemHeight: number;

  /**列数 */ columns?: number;
  /**列距 */ gapCol?: number;
  /**行距 */ gapRow?: number;
  /**宽高是否自增 */ autoSize?: 'none' | 'vertical' | 'horizontal';

  debug?: boolean;

  onChange: (lists: MovableLists<T>) => void;
};

const Movable: FC<MovableProps<Record<string, any>>> = (props) => {
  let {
    children,
    lists = [],

    item,
    placeholder,

    itemKey = 'id',
    itemWidth = 50,
    itemHeight = 50,

    columns = 1,
    gapRow = 0,
    gapCol = 0,
    autoSize = 'none',

    debug,

    onChange,
  } = props;

  let width = useMemo(() => rpx2rem(itemWidth), [itemWidth]);
  let height = useMemo(() => rpx2rem(itemHeight), [itemHeight]);

  let wrap = useRef<Element>();
  let rects = useRef<NodesRef.BoundingClientRectCallbackResult[]>([]);
  let source = useRef<number | null>(null);
  let target = useRef<number | null>(null);

  let getStyle = useCallback(
    (index: number, position: number) => {
      let { x, y } = lists[position];

      let offset = 0;
      if (autoSize === 'vertical') {
        for (let i = 0; i < position; i++) {
          let { list } = lists[i];
          offset += Math.floor(list.length / columns);
        }
      }

      let col = index % columns;
      let colLeft = col * (itemWidth + gapCol);
      let left = rpx2rem(colLeft + x);

      let row = Math.floor(index / columns) + offset;
      let rowTop = row * (itemHeight + gapRow);
      let top = rpx2rem(rowTop + y);

      return {
        x: left,
        y: top,
      };
    },
    [lists, itemHeight, itemWidth, columns, gapCol, gapRow, autoSize],
  );

  let [listMerge, setListMerge] = useState<
    ListMergeItem<Record<string, any>>[]
  >([]);
  useEffect(() => {
    let _listMerge = lists.reduce((p, i, position) => {
      if (!i) return p;

      let list = [...i.list, null].map((data, index) => {
        let style = getStyle(index, position);
        let { x, y } = style;

        return {
          data: data || null,
          index,
          position,
          x,
          y,
          width,
          height,
          opacity: '1',
        };
      });

      return [...p, ...list];
    }, []);

    setListMerge(_listMerge);
  }, [getStyle, lists, width, height]);

  let onTouchStart = useCallback((index: number) => {
    source.current = index;

    getRects(`.${MovableItemName.toString()}`).then((res) => {
      // console.log('坐标', res);
      rects.current = res;
    });
  }, []);
  let onTouchMove = useCallback(
    (e) => {
      if (source.current === null) return;

      e.preventDefault();
      e.stopPropagation();

      let [touche] = e.touches;
      let { pageX, pageY, clientX, clientY } = touche;

      if (process.env.TARO_ENV === 'h5' && wrap.current) {
        pageX += wrap.current.scrollLeft;
        pageY += wrap.current.scrollTop;
      }
      // if (wrap.current) {
      //   let x = 0;
      //   let y = 0;

      //   switch (process.env.TARO_ENV) {
      //     case 'h5':
      //       x = wrap.current.scrollLeft;
      //       y = wrap.current.scrollTop;
      //       break;

      //     default:
      //       break;
      //   }

      //   pageX += x;
      //   pageY += y;
      // }

      let _width = rpx2px(itemWidth / 2);
      let _height = rpx2px(itemHeight / 2);

      target.current = rects.current.findIndex((i) => {
        let isFindX = clientX - _width < i.left + _width;
        let isFindY = clientY - _height < i.top + _height;
        let isFind = isFindX && isFindY;
        return isFind;
      });

      setListMerge((state) => {
        let sourceObj: ListMergeItem<Record<string, any>>;
        let targetObj: ListMergeItem<Record<string, any>>;

        let _list = state.map((v, k) => {
          /* 拖拽动画 */
          if (source.current === k) {
            sourceObj = v;
            return {
              ...v,
              x: pageX - _width + 'px',
              y: pageY - _height + 'px',
            };
          }

          /* 列表动画 */
          if (target.current !== null && target.current !== -1) {
            let offset = 0;
            let opacity = '1';
            targetObj = state[target.current];

            let selectBlock = sourceObj?.position === v.position;
            let targetBlock = targetObj?.position === v.position;

            /**占位元素 */
            if (targetBlock && !v.data) opacity = '0';

            /* 非占位元素 */
            if (targetObj.data) {
              if (selectBlock && sourceObj?.index < v.index) offset--;
              if (targetBlock && targetObj?.index <= v.index) offset++;
              if (targetBlock && selectBlock && targetObj?.index === v.index)
                offset--;
            }

            let style = getStyle(v.index + offset, v.position);
            return {
              ...v,
              x: style.x,
              y: style.y,
              opacity,
            };
          }

          return v;
        });

        return _list;
      });
    },
    [getStyle, itemHeight, itemWidth],
  );
  let onTouchEnd = useCallback(() => {
    let _lists = lists;

    if (
      source.current !== target.current &&
      source.current !== null &&
      target.current !== null &&
      target.current !== -1
    ) {
      let sourceObj = listMerge[source.current];
      let targetObj = listMerge[target.current];
      if (!sourceObj.data) return;

      _lists = _lists.map((i, index) => {
        if (index === sourceObj.position) {
          return {
            ...i,
            list: slice(i.list, sourceObj.index),
          };
        } else {
          return i;
        }
      });
      _lists = _lists.map((i, index) => {
        if (index === targetObj.position) {
          return {
            ...i,
            list: slice(i.list, targetObj.index, sourceObj.data, true),
          };
        } else {
          return i;
        }
      });

      if (debug) {
        console.log('拖拽源头', sourceObj.data);
        console.log('拖拽目标', targetObj.data);
        console.log('拖拽列表', lists);
      }
    }

    onChange(_lists);

    source.current = null;
    target.current = null;
  }, [debug, listMerge, lists, onChange]);

  let css = useMemo<Record<string, CSSProperties>>(() => {
    return {
      wrap: {
        position: 'relative',
        overflow: 'auto',
        width: '100%',
        height: '100%',
        maxWidth: process.env.TARO_ENV === 'h5' ? '100vw' : '',
        maxHeight: process.env.TARO_ENV === 'h5' ? '100vh' : '',
      },
      fill: {
        position: 'relative',
        width: '100%',
        height: '100%',
      },
    };
  }, []);

  return (
    <View style={css.wrap} ref={wrap}>
      {/* 元素列表 */}
      <View
        style={css.fill}
        catchMove
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {listMerge.map((i, index) => {
          let { data } = i;
          let isSelect = source.current === index;

          if (data) {
            return (
              <View
                key={data[itemKey]}
                onTouchStart={onTouchStart.bind(null, index)}
              >
                <MovableView isSelect={isSelect} {...i}>
                  {item({
                    data,
                    index,
                  })}
                </MovableView>
              </View>
            );
          } else {
            return (
              <View key={`placeholder-${index}`}>
                <MovableView isSelect={isSelect} {...i}>
                  {placeholder ? placeholder() : <PlaceHolder />}
                </MovableView>
              </View>
            );
          }
        })}
      </View>

      {/* 区域列表 */}
      <View style={css.fill}>
        {children(
          lists.map((i, position) => {
            return () => {
              if (!i) return null;

              let { list } = i;
              return <MovableArea key={position} list={list} {...props} />;
            };
          }),
        )}
      </View>
    </View>
  );
};

export default Movable;
