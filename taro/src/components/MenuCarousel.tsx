/*

import MenuCarousel, {
  MenuCarouselItem,
  MenuCarouselItemProps,
  Menu,
  Carousel,
} from '../../components/MenuCarousel';

menu = [
  { id: '', name: '' },
];

MenuItem: MenuCarouselItem<MenuItem> = (props) => {
  let { item, index, isCurrent, state } = props;

  return (
    <View
      className={[
        css.menu__item,
        isCurrent ? css.menu__itemCurrent : '',
      ].join(' ')}
    >
      <Image
        className={css.menu__icon}
        src={item.icon}
        mode='aspectFit'
      />
      <View className={css.menu__name}>{item.name}</View>
    </View>
  );
};

CarouselItem: MenuCarouselItem<MenuItem> = (props) => {
  let { item, index, isCurrent, state } = props;
  return <View className={css.carousel__item}></View>
};

<MenuCarousel list={this.menu}>
  <View className={css.menu}>
    <Menu>{this.MenuItem}</Menu>
  </View>
  <View className={css.carousel}>
    <Carousel>{this.CarouselItem}</Carousel>
  </View>
</MenuCarousel>



// 当前选中
current={}

// 初始选中
initCurrent={}

// 选择菜单
onChange={this.onChangeMenuCarousel}
onChangeMenuCarousel = (e: MenuCarouselItemProps<MenuItem>) => {
  let { item, index } = e;
};



// 简单请求
import MenuCarousel, {
  MenuCarouselItem,
  MenuCarouselItemProps,
  MenuCarouselRequest,
  Menu,
  Carousel,
} from '../../components/MenuCarousel';

request={this.request}
request: MenuCarouselRequest<Item> = () => {
  return api().then((res) => {
    let { list, current } = res;
    return { list, current };
  });
};

*/

import React, {
  CSSProperties,
  ReactNode,
  ReactNodeArray,
  memo,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useContext,
  createContext,
} from 'react';

import Taro, { FC } from '@tarojs/taro';
import { View } from '@tarojs/components';

import MenuComp, { MenuItem, MenuRequest } from './Menu';
import CarouselComp, { CarouselItem, CarouselEvent } from './Carousel.v2';

let Context = createContext<{
  list: any[];
  current: number;
  onChangeMenu: (props: MenuCarouselItemProps) => void;
} | null>(null);

export const Menu: FC<{
  children: MenuCarouselItem;
  itemKey?: string;
  fill?: boolean;
  /**依赖状态 */ state?: Record<string, any>;
}> = memo((props) => {
  let { children, itemKey, fill, state = {} } = props;

  let Item = useCallback<MenuItem>(
    (itemProps) => {
      return children({
        ...itemProps,
        state,
      });
    },
    [children, state],
  );

  let context = useContext(Context);
  if (!context) return null;

  let { list, current, onChangeMenu } = context;

  return (
    <MenuComp
      list={list}
      itemKey={itemKey}
      fill={fill}
      current={current}
      onChange={onChangeMenu}
    >
      {Item}
    </MenuComp>
  );
});

export const Carousel: FC<{
  children: MenuCarouselItem;
  itemKey?: string;
  /**依赖状态 */ state?: Record<string, any>;
}> = memo((props) => {
  let { children, itemKey, state = {} } = props;
  let context = useContext(Context);

  let Item = useCallback<CarouselItem>(
    (itemProps) => {
      return children({
        ...itemProps,
        state,
      });
    },
    [children, state],
  );

  let onChange: CarouselEvent = useCallback(
    (e) => {
      if (!context) return null;

      let { data, current: index } = e;
      context.onChangeMenu({
        item: data,
        index,
        isCurrent: true,
        state,
      });
    },
    [state, context],
  );

  if (!context) return null;
  let { list, current } = context;

  return (
    <CarouselComp
      list={list}
      itemKey={itemKey}
      current={current}
      onChange={onChange}
    >
      {Item}
    </CarouselComp>
  );
});

export type MenuCarouselRequest<T = any> = MenuRequest<T>;

export type MenuCarouselItemProps<T = any> = {
  item: T;
  index: number;
  isCurrent: boolean;
  state: Record<string, any>;
};
export type MenuCarouselItem<T = any> = (
  props: MenuCarouselItemProps<T>,
) => React.ReactNode;

export type MenuCarouselProps<T = any> = {
  children: ReactNode | ReactNodeArray;

  list?: any[];
  request?: MenuCarouselRequest<T>;

  /**当前选中 */ current?: null | number;
  /**初始选中 */ initCurrent?: null | number;
  /**切换元素 */ onChange?: (e: MenuCarouselItemProps) => void;
};

const Comp: FC<MenuCarouselProps> = memo((props) => {
  let {
    children,

    list: listProps = [],
    request,

    current: propCurrent,
    initCurrent,
    onChange,
  } = props;

  let [stateCurrent, setStateCurrent] = useState(
    initCurrent ?? propCurrent ?? 0,
  );

  let current = propCurrent ?? stateCurrent;

  let [list, setList] = useState<any[]>([]);
  useEffect(() => {
    if (listProps.length) {
      setList(listProps);
    }

    if (request) {
      request().then((e) => {
        let { list: _list = [], current: _current } = e;

        if (_list.length) setList(_list);
        if (_current !== undefined) setStateCurrent(_current);
      });
    }
  }, [listProps, request]);

  let onChangeMenu = useCallback(
    (e) => {
      let { item, index, isCurrent, state } = e;
      if (!item) return;

      setStateCurrent(index);

      if (onChange && index !== current) {
        onChange({
          item,
          index,
          isCurrent,
          state,
        });
      }
    },
    [current, onChange],
  );

  let value = useMemo(() => {
    return {
      list,
      current,
      onChangeMenu,
    };
  }, [list, current, onChangeMenu]);

  let css = useMemo<Record<string, CSSProperties>>(() => {
    return {
      wrap: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      },
    };
  }, []);

  if (!list.length) return null;

  return (
    <Context.Provider value={value}>
      <View style={css.wrap}>{children}</View>
    </Context.Provider>
  );
});

export default Comp;
