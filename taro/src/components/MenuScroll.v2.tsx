/*

import MenuScroll, {
  MenuItem,
  MenuItemProps,
  MenuRequest,
  ScrollItemProps,
  ScrollRequest,
} from '../../components/MenuScroll.v2';



<MenuScroll
  menuItem={this.MenuItem}
  menuRequest={this.menuRequest}
  menuProps={{}}
  scrollItem={this.ScrollItem}
  scrollRequest={this.scrollRequest}
  scrollProps={{}}
/>



// 菜单栏
type MenuData = {};

menuRequest: MenuRequest<MenuData> = () => {
  return api().then((res) => {
    return res;
  });
};
MenuItem: MenuItem<MenuData> = (props) => {
  let { item, isCurrent } = props;

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



// 滚动列表
type ScrollData = {};

scrollRequest: ScrollRequest<ScrollData, MenuData> = (e, page) => {
  return api({ page })
    .then((res) => {
      let { list, limit } = res;
      return {
        list,
        hasMore: list.length >= limit, //根据每次请求返回的数组长度判断是否还有更多数据
      };
    });
};
ScrollItem = (props: ScrollItemProps<ScrollData>) => {
  let { item, index } = props;

  return (
    <View className={css.scrollItem}></View>
  );
};

onScrollSelect = (e: ScrollItemProps<ListItem>) => {
  let { item, index } = e;
};
onScrollSelect={this.onScrollSelect}



initCurrent={}
current={}

onMenuChange={this.onMenuChange}
onMenuChange = (current: number) => {};



header={this.Header}
Header = () => {return <View></View>};

footer={this.Footer}
Footer = () => {return <View></View>};

section={this.Section}
Section = () => {return <View></View>};

placeholder={this.placeholder}
placeholder = () => {return <View></View>};

*/

import React, { CSSProperties, ReactNode, PureComponent } from 'react';

import Taro from '@tarojs/taro';
import { View, Swiper, SwiperItem } from '@tarojs/components';

import MenuBar from './MenuBar';
import type { MenuProps, MenuItem, MenuItemProps } from './MenuBar';

import Scroll from './ScrollView.private';
import type {
  ScrollProps,
  ScrollItem,
  ScrollItemProps,
} from './ScrollView.private';

export type { MenuItemProps, ScrollItemProps };

let css: {
  [key: string]: CSSProperties;
} = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },

  menu: {
    flex: 'none',
  },
  swiper: {
    flex: 'auto',
  },

  header: {
    flex: 'none',
  },
  section: {
    flex: 'none',
  },
  footer: {
    flex: 'none',
  },
};

export type MenuRequest<T = Record<string, any>> = () => Promise<T[]>;

export type ScrollRequest<S, M> = (
  e: M,
  page: number,
) => Promise<{
  list: S[];
  hasMore: boolean;
}>;

type OwnProps<S = any, M = any> = {
  menuItem: MenuItem<M>;
  menuRequest: MenuRequest<M>;
  menuProps?: Omit<MenuProps<M>, 'list'>;
  onMenuChange?: (current: number) => void;

  scrollItem: ScrollItem<S>;
  scrollRequest: ScrollRequest<S, M>;
  scrollProps?: Omit<ScrollProps<S>, 'list' | 'request'>;
  onScrollSelect?: (e: ScrollItemProps<S>) => void;

  /**当前选中 */ current?: null | number;
  /**初始选中 */ initCurrent?: null | number;

  header?: () => ReactNode;
  footer?: () => ReactNode;
  section?: () => ReactNode;
  placeholder?: () => ReactNode;
};
type OwnState = {
  menuList: any[];

  scrollList: {
    list: any[];
    page: number;
    hasMore: boolean;
  }[];

  current: null | number;
};

class Comp extends PureComponent<OwnProps, OwnState> {
  // static defaultProps = {};

  state = {
    menuList: [] as any[],
    scrollList: [] as any[],
    current: 0,
  };

  componentDidMount() {
    let { menuRequest } = this.props;
    if (!menuRequest) return;

    menuRequest().then((res) => {
      this.setState(
        {
          menuList: res,
        },
        () => this.init(),
      );
    });
  }
  // componentWillUnmount() {}

  isLoading = false;
  proms = {};

  /** 初始化 */
  init() {
    if (this.isLoading) return;

    let { menuList, current: stateCurrent } = this.state;
    if (!menuList.length) return;

    let { scrollRequest, current: propsCurrent, initCurrent } = this.props;
    if (!scrollRequest) return;

    let current = initCurrent ?? propsCurrent ?? stateCurrent;
    if (this.proms[current]) return; // 如果正在请求则终止

    this.isLoading = true;
    Taro.showLoading({
      title: '加载中',
      mask: true,
    });

    // 初始化列表数组
    let menuItem = menuList[current];
    if (!menuItem) {
      current = 0;
      menuItem = menuList[0];
    }

    let prom = scrollRequest(menuItem, 1);
    this.proms[current] = prom;

    prom
      .then((res) => {
        let _scrollList = menuList.map((v, k) => {
          if (k === current) {
            return {
              page: 1,
              list: res.list,
              hasMore: res.hasMore,
            };
          } else {
            return {
              page: 0,
              list: [],
              hasMore: true,
            };
          }
        });

        this.setState(
          {
            current,
            scrollList: _scrollList,
          },
          () => {
            this.proms[current] = null;
            this.isLoading = false;
            Taro.hideLoading();
          },
        );
      })
      .catch((err) => {
        this.proms[current] = null;
        this.isLoading = false;
        Taro.hideLoading();
        throw err;
      });
  }

  /** 请求接口 */
  request(current: number) {
    // 如果正在请求则终止
    if (this.isLoading) return;

    let hasProm = Boolean(this.proms[current]);
    if (hasProm) return;

    let { menuList, scrollList } = this.state;
    if (!menuList.length) return;

    let { scrollRequest } = this.props;
    if (!scrollRequest) return;

    let scrollItem = scrollList[current];
    let { list, page } = scrollItem;

    this.isLoading = true;
    Taro.showLoading({
      title: '加载中',
      mask: true,
    });

    let menuItem = menuList[current];
    let prom = scrollRequest(menuItem, page + 1);
    this.proms[current] = prom;

    prom
      .then((res) => {
        let _list = [...list, ...res.list];

        let _scrollList = [
          ...scrollList.slice(0, current),
          {
            page: page + 1,
            list: _list,
            hasMore: res.hasMore,
          },
          ...scrollList.slice(current + 1),
        ];

        this.setState(
          {
            scrollList: _scrollList,
            current,
          },
          () => {
            this.proms[current] = null;
            this.isLoading = false;
            Taro.hideLoading();
          },
        );
      })
      .catch((err) => {
        this.proms[current] = null;
        this.isLoading = false;
        Taro.hideLoading();
        throw err;
      });
  }

  onSwiperChange = (e) => {
    let { current } = e.detail;
    this.onMenuChange(current);
  };
  onMenuSelect = (e: MenuItemProps) => {
    let { item, index } = e;
    this.onMenuChange(index);
  };
  onMenuChange = (current: number) => {
    this.setState((state) => {
      let { current: preCurrent, scrollList } = state;
      if (preCurrent === current) {
        return { current };
      } else {
        let { onMenuChange } = this.props;
        onMenuChange?.(current);

        let scrollItem = scrollList[current];
        if (!scrollItem?.list.length) this.request(current); // 如果没有数据则请求接口

        return {
          current,
        };
      }
    });
  };

  render() {
    let {
      menuItem,
      menuProps,

      scrollItem,
      scrollProps,
      onScrollSelect,

      current: propsCurrent,

      header,
      footer,
      section,
      placeholder = () => null,
    } = this.props;

    let { menuList, scrollList, current: stateCurrent } = this.state;
    if (!menuList.length) return placeholder();

    let current = 0;
    if (scrollList.length) current = propsCurrent ?? stateCurrent;

    return (
      <View style={css.wrap}>
        <View style={css.header}>{header?.()}</View>

        <View style={css.menu}>
          <MenuBar
            {...menuProps}
            list={menuList}
            current={current}
            onSelect={this.onMenuSelect}
          >
            {menuItem}
          </MenuBar>
        </View>

        <View style={css.section}>{section?.()}</View>

        <Swiper
          style={css.swiper}
          current={current}
          onChange={this.onSwiperChange}
        >
          {scrollList.map((v, k) => {
            return (
              <SwiperItem key={k}>
                {v?.list?.length ? (
                  <Scroll
                    {...scrollProps}
                    list={v.list}
                    item={scrollItem}
                    placeholder={placeholder}
                    hasMore={v.hasMore}
                    onMore={this.request.bind(this, k)}
                    onSelect={onScrollSelect}
                  >
                    {null}
                  </Scroll>
                ) : null}
              </SwiperItem>
            );
          })}
        </Swiper>

        <View style={css.footer}>{footer?.()}</View>
      </View>
    );
  }
}

export default Comp;
