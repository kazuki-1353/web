/*

import Menu, { MenuItem, MenuItemProps } from '../../components/Menu';

menu = [
  { id: '', name: '', icon: '', iconActive: '' },
];

MenuItem: MenuItem<Item> = (props) => {
  let { item, index, isCurrent } = props;

  return (
    <View
      className={[
        css.menu__item,
        isCurrent ? css.menu__itemCurrent : '',
      ].join(' ')}
    >
      <Image
        className={css.menu__icon}
        src={isCurrent ? item.iconActive : item.icon}
        mode='aspectFit'
      />
      <View className={css.menu__name}>{item.name}</View>
    </View>
  );
};

<View className={css.menu}>
  <Menu list={this.menu}>{this.MenuItem}</Menu>
</View>



// 选择菜单
onChange={this.onChangeMenu}
onChangeMenu = (e: MenuItemProps<Item>) => {
  let { item, index, isBlur } = e;
};



// 元素键
itemKey=''

// 当前选中
current={}

// 初始选中
initCurrent={}

// 是否铺满
fill

// 能否取消选中
allowBlur



// 简单请求
import Menu, { MenuItem, MenuRequest } from '../../components/Menu';

request={this.request}
request: MenuRequest<Item> = () => {
  return api().then((res) => {
    let { list, current } = res;
    return { list, current };
  });
};

*/

import React, {
  CSSProperties,
  ReactNode,
  memo,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';

import Taro, { FC } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';

export type MenuRequest<T = any> = () => Promise<{
  list: T[];
  current?: number;
}>;

export type MenuItemProps<T = any> = {
  item: T;
  index: number;
  isCurrent: boolean;
  isBlur?: boolean;
};

export type MenuItem<T = any> = (props: MenuItemProps<T>) => ReactNode;

export type MenuProps<T = any> = {
  children: MenuItem<T>;

  list?: T[];
  request?: MenuRequest<T>;
  itemKey?: string;

  /**当前选中 */ current?: null | number;
  /**初始选中 */ initCurrent?: null | number;

  /**是否铺满 */ fill?: boolean;
  /**能否取消选中 */ allowBlur?: boolean;

  onChange?: (e: MenuItemProps<T>) => void;
};
const Comp: FC<MenuProps> = (props) => {
  let {
    children,
    list: listProps = [],
    request,
    itemKey,

    current: propCurrent,
    initCurrent,

    fill,
    allowBlur,

    onChange,
  } = props;

  let [stateCurrent, setStateCurrent] = useState(() => {
    if (initCurrent) return initCurrent;
    if (propCurrent) return propCurrent;
    if (allowBlur) return null;

    return 0;
  });

  let current = useMemo(() => {
    if (allowBlur) {
      return propCurrent !== undefined ? propCurrent : stateCurrent;
    } else {
      return propCurrent ?? stateCurrent;
    }
  }, [propCurrent, stateCurrent, allowBlur]);

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

  let onClick = useCallback(
    (e) => {
      let { item, index, isCurrent } = e;
      if (!item) return;

      let isBlur: boolean;

      // 如果能取消选择
      if (allowBlur && index === current) {
        setStateCurrent(null);
        isBlur = true;
      } else {
        setStateCurrent(index);
        isBlur = false;
      }

      if (onChange) {
        onChange({
          item,
          index,
          isCurrent,
          isBlur,
        });
      }
    },
    [allowBlur, current, onChange],
  );

  let css = useMemo<Record<string, CSSProperties>>(() => {
    return {
      scroll: {
        height: '100%',
      },

      menu: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: fill ? 'space-between' : 'flex-start',
        alignItems: 'center',
        height: '100%',
      },
      menu__item: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: fill ? 'auto' : 'none',
        height: '100%',
        textAlign: 'center',
      },
    };
  }, [fill]);

  if (!list.length) return null;

  return (
    <ScrollView style={css.scroll} scroll-x>
      <View style={css.menu}>
        {list.map((item, index) => {
          let key = itemKey ? item[itemKey] : index;
          let isCurrent = current === index;

          return (
            <View
              style={css.menu__item}
              key={key}
              onClick={onClick.bind(null, {
                item,
                index,
                isCurrent,
              })}
            >
              {children({
                item,
                index,
                isCurrent,
              })}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default memo(Comp);
