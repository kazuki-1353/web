/*

import MenuScroll, {
  Menu,
  MenuItem,
  MenuItemProps,
  MenuRequest,

  CarouselScroll,
  CarouselScrollItem,
  CarouselScrollRequest,
} from '../../components/MenuScroll.v3';

menuRequest: MenuRequest = () => {
  return api().then((res) => {
    let { list, current } = res;
    return { list, current };
  });
};
MenuItem: MenuItem = (props) => {
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

carouselScrollRequest: CarouselScrollRequest = (page, menu, state) => {
  return api({ page }).then((res) => {
    let { list, pageSize } = res;
    return { list, pageSize };
  });
};
CarouselScrollItem: CarouselScrollItem = (props) => {
  let {
    menuItem,
    menuIndex,
    scrollItem,
    scrollIndex,
    state,
  } = props;

  return <View className={css.carousel__item}></View>
};

<MenuScroll
  menuRequest={this.menuRequest}
  scrollRequest={this.carouselScrollRequest}
>
  <View className={css.menu}>
    <Menu>{this.MenuItem}</Menu>
  </View>
  <View className={css.carousel}>
    <CarouselScroll>{this.CarouselScrollItem}</CarouselScroll>
  </View>
</MenuScroll>



// 当前选中
current={}

// 初始选中
initCurrent={}

// 选择菜单
onChange={this.onChangeMenuCarousel}
onChangeMenuCarousel = (e: MenuItemProps<MenuItem>) => {
  let { item, index } = e;
};



// 简单请求
import MenuScroll, {
  Menu,
  CarouselScroll,
  MenuItem,
  MenuItemProps,
  MenuCarouselRequest,
} from '../../components/MenuScroll';

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
  FC,
  ReactNode,
  Ref,
  memo,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  useContext,
  createContext,
} from 'react';

import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

import MenuComp, { MenuRequest } from './Menu';
import Carousel, {
  CarouselItem,
  CarouselItemProps,
  CarouselEvent,
} from './Carousel.v2';
import Scroll, { ScrollPrototype, ScrollProps } from './ScrollView.private';

let Context = createContext<{
  menuList: any[];
  scrollRequest: CarouselScrollRequest;

  current: number;
  onChangeMenu: (props: MenuItemProps) => void;
} | null>(null);

export type { MenuRequest } from './Menu';
export type MenuItemProps<T = any, S = Record<string, any>> = {
  item: T;
  index: number;
  isCurrent: boolean;
  state: S;
};
export type MenuItem<T = any> = (props: MenuItemProps<T>) => ReactNode;

export const Menu: FC<{
  children: MenuItem;
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

  let { menuList, current, onChangeMenu } = context;

  return (
    <MenuComp
      list={menuList}
      itemKey={itemKey}
      fill={fill}
      current={current}
      onChange={onChangeMenu}
    >
      {Item}
    </MenuComp>
  );
});

export type CarouselScrollRequest<
  T = Record<string, any>,
  M = any,
  S = Record<string, any>
> = (
  page: number,
  menu: CarouselItemProps<M>,
  state: S,
) => Promise<{
  list: T[];
  pageSize?: number;
  hasMore?: boolean;
}>;

export type CarouselScrollItem<
  T = Record<string, any>,
  M = any,
  S = Record<string, any>
> = (props: {
  menuItem: M;
  menuIndex: number;
  scrollItem: T;
  scrollIndex: number;
  state: S;
}) => ReactNode;

export const CarouselScroll: FC<Omit<ScrollProps, 'ref'> & {
  children: CarouselScrollItem;
  itemKey?: string;
  /**依赖状态 */ state?: Record<string, any>;
  ref?: Ref<ScrollPrototype>;
}> = memo((props) => {
  let { children, itemKey, state = {}, ...scrollProps } = props;
  let context = useContext(Context);
  let isLoad = useRef<Record<number, boolean>>({});

  let Item = useCallback<CarouselItem>(
    (carouselItemProps) => {
      let { index, isCurrent } = carouselItemProps;

      /* 切换到该标签时才请求接口 */
      if (!isLoad.current[index]) {
        if (isCurrent) {
          isLoad.current[index] = true;
        } else {
          return null;
        }
      }

      return (
        <Scroll
          {...scrollProps}
          request={(page) => {
            if (context) {
              return context.scrollRequest(page, carouselItemProps, state);
            } else {
              return Promise.reject();
            }
          }}
          item={(scrollItemProps) => {
            return children({
              menuItem: carouselItemProps.item,
              menuIndex: carouselItemProps.index,
              scrollItem: scrollItemProps.item,
              scrollIndex: scrollItemProps.index,
              state,
            });
          }}
        >
          {null}
        </Scroll>
      );
    },
    [children, state, scrollProps, context],
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
  let { menuList, current } = context;

  return (
    <Carousel
      list={menuList}
      itemKey={itemKey}
      current={current}
      onChange={onChange}
    >
      {Item}
    </Carousel>
  );
});

export type MenuScrollProps<S = Record<string, any>, M = any> = {
  children: ReactNode | ReactNode[];

  menuRequest: MenuRequest<M>;
  scrollRequest: CarouselScrollRequest<S>;

  /**当前选中 */ current?: null | number;
  /**初始选中 */ initCurrent?: null | number;
  /**切换元素 */ onChange?: (e: MenuItemProps) => void;
};

const Comp: FC<MenuScrollProps> = memo((props) => {
  let {
    children,

    menuRequest,
    scrollRequest,

    current: propCurrent,
    initCurrent,
    onChange,
  } = props;

  let [stateCurrent, setStateCurrent] = useState(
    initCurrent ?? propCurrent ?? 0,
  );

  let current = propCurrent ?? stateCurrent;

  let [menuList, setMenuList] = useState<any[]>([]);
  useEffect(() => {
    menuRequest().then((e) => {
      let { list = [], current: _current } = e;
      if (list.length) setMenuList(list);
      if (_current !== undefined) setStateCurrent(_current);
    });
  }, [menuRequest]);

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
      menuList,
      scrollRequest,
      current,
      onChangeMenu,
    };
  }, [menuList, scrollRequest, current, onChangeMenu]);

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

  if (!menuList.length) return null;

  return (
    <Context.Provider value={value}>
      <View style={css.wrap}>{children}</View>
    </Context.Provider>
  );
});

export default Comp;
