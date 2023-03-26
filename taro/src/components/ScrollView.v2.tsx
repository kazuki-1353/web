/*

import ScrollView from './ScrollView';

<ScrollView></ScrollView>

// 底部
footer={}

*/

/* 固定

import ScrollView, {
  ScrollFixed,
} from '../../components/ScrollView';

scrollFixed: ScrollFixed = (props) => {
  let { height, top, isShow } = props;
  return (
    <View style={{ height }}></View>
  );
};

fixed={{
  template: this.scrollFixed,
  height: 100,
  top: 0,
}}

*/

/* 滚动

// 滚动到顶部按钮
intoViewBtn={this.ScrollIntoViewBtn}
IntoViewBtn = () => {}



// 滚动到指定ID
ref={this.scrollRef}
scrollRef = React.createRef<ScrollView>();

let ref = this.scrollRef.current;
ref && ref.intoView();
ref && ref.intoView('bottom');



// 列表滚动到指定ID
ref={(ele) => ele && (this.scrollRef[k] = ele)}
scrollRef: ScrollView[] = [];

this.scrollRef.forEach((ref) => ref.intoView('top'));

*/

/* 列表

import ScrollView, {
  ScrollItem,
} from '../../components/ScrollView';

scrollItem: ScrollItem<ListItem> = (props) => {
  let { item, index } = props;
  return <View></View>;
};

item={this.scrollItem}
itemKey=''



// 样式
itemFill
listStyle={{
  marginLeft: rpx2rem(20),
  marginRight: rpx2rem(20),
}}



// 占位
placeholder={}



// 点击元素
onSelect={this.onScrollSelect}

onScrollSelect = (e: ScrollItemProps<ListItem>) => {
  let { item, index } = e;
};

*/

/* 触底请求更多

state = {
  scrollList: [],
  hasScrollMore: false,
};

scrollPage = 1;
isLoading = false;

getScrollList = () => {
  this.isLoading = true;
  Taro.showLoading({
    title: '加载中',
    mask: true,
  });

  api({page: this.scrollPage})
    .then((res) => {
      let { list, pageSize } = res;

      this.setState(
        (state) => {
          return {
            // 如果为分页则插入到末尾
            scrollList:
              this.scrollPage > 1 ? [...state.scrollList, ...list] : list,

            // 根据每次请求返回的数组长度判断是否还有更多数据
            hasScrollMore: list.length >= pageSize,
          };
        },
        () => {
          this.scrollPage += 1;
          this.isLoading = false;
          Taro.hideLoading();
        },
      );
    })
    .catch((err) => {
      this.isLoading = false;
      Taro.hideLoading();
      throw err;
    });
}
onScrollMore = () => {
  if (this.isLoading) return;
  this.getScrollList();
};

list={this.state.scrollList}
hasMore={this.state.hasScrollMore}
onMore={this.onScrollMore}

*/

/* 简单请求模式

import ScrollView, {
  ScrollItem,
  ScrollRequest,
} from '../../components/ScrollView';

scrollRequest: ScrollRequest<ListItem> = (page) => {
  return api({ page }).then((res) => {
    let { list, pageSize } = res;
    return { list, pageSize };
  });
};

request={this.scrollRequest}

*/

import React, { ReactNode, CSSProperties, PureComponent } from 'react';

import Taro from '@tarojs/taro';
import { Block, View, ScrollView } from '@tarojs/components';
import { ScrollViewProps } from '@tarojs/components/types/ScrollView';

export const rpx2rem = (rpx, design = 750) => {
  let isNumber = Number(rpx);
  let rem = isNumber ? Taro.pxTransform(rpx, design) : rpx;
  return rem ?? 0;
};

let css: {
  [key: string]: CSSProperties;
} = {
  wrap: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },

  scroll: {
    width: '100%',
    height: '100%',
  },

  main: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },

  content: {
    flex: process.env.TARO_ENV === 'rn' ? 0 : 'none',
  },

  list: {
    flex: process.env.TARO_ENV === 'rn' ? 0 : 'none',
    display: 'flex',
  },
  listWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'flex-start',
  },
  listColumn: {
    flexDirection: 'column',
  },

  item: {
    position: 'relative',
  },

  more: {
    flex: process.env.TARO_ENV === 'rn' ? 0 : 'none',
    margin: rpx2rem(30),
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
  },

  placeholder: {
    flex: process.env.TARO_ENV === 'rn' ? 1 : 'auto',
  },

  fixed: {
    flex: process.env.TARO_ENV === 'rn' ? 0 : 'none',
    position: 'fixed',
    zIndex: 2,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },

  icon: {
    position: 'absolute',
    zIndex: 1,
    bottom: rpx2rem(20),
    right: rpx2rem(20),
    transitionProperty: 'visibility,opacity',
    transitionDuration: '.5s',
  },

  stopPropagation: {
    pointerEvents: 'none',
  },
};

export type ScrollItemProps<T = Record<string, any>> = {
  item: T;
  index: number;
};

/**元素 */
export type ScrollItem<T = Record<string, any>> = (
  props: ScrollItemProps<T>,
) => ReactNode;

/**固定 */
export type ScrollFixed = {
  height: number | string;
  top?: number | string;

  template: (props: {
    height: number | string;
    top: number | string;
    isShow: boolean;
  }) => ReactNode;
};

/**简单请求方法 */
export type ScrollRequest<T = Record<string, any>> = (
  page: number,
) => Promise<{
  list: T[];
  pageSize?: number;
  hasMore?: boolean;
}>;

export type ScrollProps<T = Record<string, any>> = ScrollViewProps & {
  children?: ReactNode | ReactNode[];

  /**滚动模式 */ mode?: 'down' | 'up';
  /**滚动动画 */ animation?: boolean;
  /**滚动到指定ID */ intoView?: (id?: string) => void;
  /**滚动到顶部按钮 */ intoViewBtn?: () => ReactNode;
  /**滚动事件 */ onScroll?: (e) => void;

  /**底部 */ footer?: (hasMore: boolean) => ReactNode;
  /**占位 */ placeholder?: () => ReactNode;
  /**固定 */ fixed?: ScrollFixed;

  /**滚动到底部事件 */ onScrollToLower?: () => void;
  /**滚动到顶部事件 */ onScrollToUpper?: () => void;

  item?: ScrollItem<T>;
  /**元素键 */ itemKey?: string;
  /**是否铺满 */ itemFill?: boolean;
  /**点击事件 */ onSelect?: (e: ScrollItemProps<T>) => void;

  list?: T[];
  /**列表样式 */ listStyle?: CSSProperties;

  /**是否拥有更多数据 */ hasMore?: boolean;
  /**加载更多事件 */ onMore?: () => void;
  /**请求方法 */ request?: ScrollRequest<T>;
};

type ScrollState<T = Record<string, any>> = {
  list: T[];
  hasMore: boolean;

  intoViewState: string;
  showIntoViewBtn: boolean;
  showFixed: boolean;
};
class Comp<T = Record<string, any>> extends PureComponent<
  ScrollProps<T>,
  ScrollState<T>
> {
  static defaultProps = {
    /**滚动模式 */ mode: 'down',
  };

  state = {
    list: [] as T[],
    hasMore: false,

    intoViewState: 'null',
    showIntoViewBtn: false,
    showFixed: true,
  };

  componentDidMount() {
    let { request } = this.props;
    if (request) setTimeout(this.getList); // 等待子元素渲染后再请求接口
  }

  scrollTop: number;
  onScroll = (e) => {
    let { onScroll, intoViewBtn, fixed } = this.props;
    onScroll?.(e);

    let { detail } = e;
    let isFarTop = detail.scrollTop > 1000;

    /* 如果有滚动到顶部按钮 */
    if (intoViewBtn) {
      if (isFarTop) {
        this.setState({ showIntoViewBtn: true });
      } else {
        this.setState({ showIntoViewBtn: false });
      }
    }

    /* 如果有固定内容 */
    if (fixed?.height) {
      /* 如果向下滚动 */
      if (isFarTop && this.scrollTop < detail.scrollTop) {
        this.setState({ showFixed: false });
      } else {
        this.setState({ showFixed: true });
      }
    }

    this.scrollTop = detail.scrollTop;
  };

  /* 简单请求模式 */
  page = 0;
  isLoading = false;
  getList = () => {
    let { request } = this.props;
    if (!request) return Promise.reject(new Error('缺失请求函数'));

    this.isLoading = true;
    this.page += 1;

    Taro.showLoading({
      title: '加载中',
      mask: true,
    });

    return request(this.page)
      .then((res) => {
        let { list = [], pageSize, hasMore = false } = res;

        this.setState(
          (state) => {
            return {
              // 如果为分页则插入到末尾
              list: this.page > 1 ? [...state.list, ...list] : list,
              hasMore: pageSize ? list.length >= pageSize : hasMore,
            };
          },
          () => {
            this.isLoading = false;
            Taro.hideLoading();
          },
        );
      })
      .catch((err) => {
        this.page -= 1;
        this.isLoading = false;
        Taro.hideLoading();
        throw err;
      });
  };

  /**获取更多 */
  onScrollToEnd = (direction) => {
    let {
      mode,
      request,
      onMore,
      onScrollToLower,
      onScrollToUpper,
    } = this.props;

    if (direction === 'down') onScrollToLower?.();
    if (direction === 'up') onScrollToUpper?.();
    if (direction !== mode) return;

    if (request) {
      if (!this.state.hasMore) return console.log('已无法获取更多');
      if (this.isLoading) return;

      this.getList();
    } else {
      if (!this.props.hasMore) return console.log('已无法获取更多');
      if (!onMore) throw new Error('缺失 onMore 方法');

      onMore();
    }
  };

  /**点击元素 */
  onSelect = (e) => {
    let { request, onSelect } = this.props;
    if (!onSelect) return;

    let list = request ? this.state.list : this.props.list;
    if (!list?.length) return;

    let { index } = e.target.dataset;
    let item = list[index];
    if (!item) return;

    onSelect({
      index,
      item,
    });
  };

  ids = {
    top: 'scrollUpper_' + Date.now(),
    bottom: 'scrollLower_' + Date.now(),
    up: 'scrollUpper_' + Date.now(),
    down: 'scrollLower_' + Date.now(),
  };

  /**滚动 */
  intoView = (id = 'top') => {
    return new Promise<void>((resolve) => {
      let intoViewState = this.ids[id] || id;
      this.setState({ intoViewState }, () => {
        setTimeout(() => {
          this.setState({ intoViewState: 'null' }, resolve);
        });
      });
    });
  };

  End = (mode: 'down' | 'up') => {
    let { request, footer } = this.props;
    let list = request ? this.state.list : this.props.list;
    let isMore = list?.length && mode === this.props.mode;

    if (isMore) {
      let hasMore = request ? this.state.hasMore : this.props.hasMore;

      return (
        <View id={this.ids[mode]}>
          {footer && <View style={css.more}>{footer(hasMore ?? false)}</View>}
        </View>
      );
    } else {
      return <View id={this.ids[mode]} />;
    }
  };

  /**固定 */
  Fixed = () => {
    let { fixed } = this.props;
    if (!fixed?.height) return null;

    let { showFixed } = this.state;

    let top = rpx2rem(fixed.top || 0);
    let height = rpx2rem(fixed.height);

    return (
      <Block>
        <View
          style={{
            flex: process.env.TARO_ENV === 'rn' ? 0 : 'none',
            height,
          }}
        />

        <View
          style={{
            ...css.fixed,
            top,
            height,
            pointerEvents: showFixed ? 'auto' : 'none',
          }}
        >
          <View
            style={{
              transform: `translate(0,-${showFixed ? 0 : 100}%)`,
              transition: 'transform 0.5s',
            }}
          >
            {fixed.template({
              height,
              top,
              isShow: showFixed,
            })}
          </View>
        </View>
      </Block>
    );
  };

  List = () => {
    let {
      item,
      itemKey = 'id',
      itemFill = false,
      request,
      listStyle,
      placeholder,
      onSelect,
    } = this.props;

    if (!item) return null;

    let list = request ? this.state.list : this.props.list;
    return list?.length ? (
      <View
        style={{
          ...css.list,
          ...listStyle,
          ...(itemFill ? css.listColumn : css.listWrap),
        }}
        onClick={onSelect && this.onSelect}
      >
        {list.map((v, k) => {
          if (!item) return null;

          let id = `ScrollItem__${v[itemKey] ?? k}`;
          let content = item({
            item: v,
            index: k,
          });

          return (
            <View style={css.item} key={id} id={id} data-index={k}>
              {onSelect ? (
                <View style={css.stopPropagation}>{content}</View>
              ) : (
                content
              )}
            </View>
          );
        })}
      </View>
    ) : (
      <View style={css.placeholder}>{placeholder?.()}</View>
    );
  };

  Content = () => {
    let { children } = this.props;
    return <View style={css.content}>{children}</View>;
  };

  render() {
    let { animation = true, intoViewBtn, ...scrollProps } = this.props;
    let { intoViewState, showIntoViewBtn } = this.state;

    return (
      <View style={css.wrap}>
        <ScrollView
          {...scrollProps}
          style={css.scroll}
          scrollY
          enableBackToTop
          scrollWithAnimation={animation}
          scrollIntoView={intoViewState}
          onScroll={this.onScroll}
          onScrollToLower={this.onScrollToEnd.bind(this, 'down')}
          onScrollToUpper={this.onScrollToEnd.bind(this, 'up')}
        >
          <View style={css.main}>
            {this.End('up')}

            {/* 固定 */}
            {this.Fixed()}

            {/* 内容 */}
            {this.Content()}

            {/* 列表 */}
            {this.List()}

            {this.End('down')}
          </View>
        </ScrollView>

        {intoViewBtn && (
          <View
            style={{
              ...css.icon,
              visibility: showIntoViewBtn ? 'visible' : 'hidden',
              opacity: showIntoViewBtn ? 1 : 0,
            }}
            onClick={this.intoView.bind(this, 'top')}
          >
            {intoViewBtn()}
          </View>
        )}
      </View>
    );
  }
}

export default Comp;
