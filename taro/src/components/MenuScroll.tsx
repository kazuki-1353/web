/* 

import MenuScroll, {
  MenuProps,
  MenuItemProps,
  ScrollProps,
  ScrollItmeProps,
} from '../../components/MenuScroll';


<MenuScroll
  menu={this.getMenu()}
  // menu={this.menuOption}
  scroll={this.scrollOption}
/>



// 菜单栏
type MenuData = {};
MenuItem(props: MenuItemProps<MenuData>) {
  let { item, isCurrent } = props;

  return (
    <View
      className={[css.menuItem, isCurrent ? css.menuItemCurrent : ''].join(
        ' ',
      )}
    >
      <View className={css.menuItem__border}>
        <Image
          className={css.menuItem__icon}
          src={item.icon}
          mode='aspectFit'
        />
      </View>
      <View className={css.menuItem__name}>{item.name}</View>
    </View>
  );
}
menuRequest: MenuRequest<MenuData> = () => {
  return api().then((res) => {
    return res;
  });
};
menuOption: MenuProps<MenuData> = {
  children: this.MenuItem,
  request: this.menuRequest,
};



// 滚动列表
type ScrollData = {};
ScrollItem = (props: ScrollItmeProps<ScrollData>) => {
  let { item, index } = props;

  return (
    <View className={css.scrollItem}></View>
  );
};
scrollRequest: ScrollRequest<ScrollData, MenuData> = (e, page) => {
  return api({ page })
    .then((res) => {
      let { list, limit } = res;
      return {
        list,
        hasScrollMore: list.length >= limit, //根据每次请求返回的数组长度判断是否还有更多数据
      };
    });
};
scrollOption: ScrollProps<ScrollData, MenuData> = {
  children: this.ScrollItem,
  request: this.scrollRequest,
};



// 默认索引
defaultCurrent={}



Header={this.Header}
Header = () => {return <View></View>};

Footer={this.Footer}
Footer = () => {return <View></View>};

Section={this.Section}
Section = () => {return <View></View>};

*/

import React, { CSSProperties, PureComponent } from 'react';

import Taro from '@tarojs/taro';
import { View, Swiper, SwiperItem } from '@tarojs/components';

import MenuBar, { MenuProps as _MenuProps, MenuItemProps } from './MenuBar';
import Scroll, {
  ScrollProps as _ScrollProps,
  ScrollItmeProps,
} from './Scroll.private';

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
    flex: 1,
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

export type MenuRequest<T> = () => Promise<T[]>;
export interface MenuProps<T> extends Omit<_MenuProps<T>, 'list'> {
  request: MenuRequest<T>;
}

export type ScrollRequest<S, M> = (
  e: M,
  page: number,
) => Promise<{
  list: S[];
  hasMore: boolean;
}>;
export interface ScrollProps<S, M>
  extends Omit<_ScrollProps<S>, 'list' | 'request'> {
  request: ScrollRequest<S, M>;
}

type OwnProps = {
  menu: MenuProps<any>;
  scroll: ScrollProps<any, any>;

  defaultCurrent?: number;

  Header?: () => React.ReactNode;
  Footer?: () => React.ReactNode;
  Section?: () => React.ReactNode;
};
type OwnState = {
  menuList: any[];

  scrollList: {
    list: any[];
    page: number;
    hasMore: boolean;
  }[];

  current: number;
};

class Comp extends PureComponent<OwnProps, OwnState> {
  // static defaultProps = {};

  state = {
    menuList: [] as any[],
    scrollList: [] as any[],
    current: 0,
  };

  componentDidMount() {
    let { menu } = this.props;
    if (!menu) return;

    let prom = menu.request();
    prom.then((res) => {
      this.setState({ menuList: res }, () => this.init());
    });
  }
  // componentWillUnmount() {}

  isLoading = false;
  proms = {};

  /** 初始化 */
  init() {
    if (this.isLoading) return;

    let { menuList } = this.state;
    if (!menuList.length) return;

    let { scroll, defaultCurrent } = this.props;
    let current = defaultCurrent ?? this.state.current;

    // 如果正在请求则终止
    if (this.proms[current]) return;

    this.isLoading = true;
    Taro.showLoading({
      title: '加载中',
      mask: true,
    });

    // 初始化列表数组
    let menuItem = menuList[current];
    let prom = scroll.request(menuItem, 1);
    this.proms[current] = prom;

    prom
      .then((res) => {
        let _scrollList = menuList.map((v, k) => {
          if (k) {
            return {
              page: 0,
              list: [],
              hasMore: true,
            };
          } else {
            return {
              page: 1,
              list: res.list,
              hasMore: res.hasMore,
            };
          }
        });

        this.setState(
          {
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

    let scrollItem = scrollList[current];
    let { list, page } = scrollItem;

    this.isLoading = true;
    Taro.showLoading({
      title: '加载中',
      mask: true,
    });

    let { scroll } = this.props;
    let menuItem = menuList[current];
    let prom = scroll.request(menuItem, page + 1);
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

  onMenuSelect = (e: MenuItemProps<any>) => {
    let { item, index } = e;
    this.setState({ current: index });
  };
  onSwiperChange = (e) => {
    let { current } = e.detail;
    this.setState({ current });

    // 如果已有数据则终止
    let { scrollList } = this.state;
    let scrollItem = scrollList[current];
    let { list } = scrollItem;
    if (list.length) return;

    // 请求接口
    this.request(current);
  };

  render() {
    let { menu, scroll, Header, Footer, Section } = this.props;
    let { request, ...scrollProps } = scroll;

    let { menuList, scrollList, current } = this.state;
    if (!menuList.length) return null;

    return (
      <View style={css.wrap}>
        <View style={css.header}>{Header?.()}</View>

        <View style={css.menu}>
          <MenuBar
            list={menuList}
            current={current}
            onSelect={this.onMenuSelect}
          >
            {menu.children}
          </MenuBar>
        </View>

        <View style={css.section}>{Section?.()}</View>

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
                    {...(scrollProps as _ScrollProps<any>)}
                    list={v.list}
                    hasMore={v.hasMore}
                    onMore={this.request.bind(this, k)}
                  >
                    {scroll.children}
                  </Scroll>
                ) : null}
              </SwiperItem>
            );
          })}
        </Swiper>

        <View style={css.footer}>{Footer?.()}</View>
      </View>
    );
  }
}

export default Comp;
export { MenuItemProps, ScrollItmeProps };
