/*

import ScrollList, {
  ScrollItem,
} from '../../components/ScrollList';

scrollItem: ScrollItem<ListItem> = (props) => {
  let { item, index } = props;
  return <View></View>;
};

<ScrollList list={scrollList}>
  {this.scrollItem}
</ScrollList>



// 长列表
itemWidth={100}
itemHeight={100}
rowGap={10}

// 元素键
itemKey=''



// 样式
listStyle={{
  flexDirection: 'column',
  flexWrap: 'nowrap',
  marginLeft: rpx2rem(20),
  marginRight: rpx2rem(20),
}}



// 占位
placeholder={}

// 底部
footer={}



// 点击元素
onSelect={this.onScrollSelect}

onScrollSelect = (e: ScrollItemProps<ListItem>) => {
  let { item, index } = e;
};

*/

/* 固定

import ScrollList, {
  ScrollItem,
  ScrollFixed,
} from '../../components/ScrollList';

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

/* 插槽

import ScrollList, {
  ScrollItem,
  ScrollSlot,
} from '../../components/ScrollList';

scrollSlot: ScrollSlot = {
  height: 330,
  template: (props) => {
    let { height } = props;
    return <View style={{ height }}></View>;
  },
};

slot={this.scrollSlot}

*/

/* 滚动

// 滚动到顶部按钮
intoViewBtn={this.ScrollIntoViewBtn}
IntoViewBtn = () => {}



// 滚动到指定ID
ref={this.scrollRef}
scrollRef = React.createRef<ScrollList>();

let ref = this.scrollRef.current;
ref && ref.intoView();
ref && ref.intoView('bottom');



// 列表滚动到指定ID
ref={(ele) => ele && (this.scrollRef[k] = ele)}
scrollRef: ScrollList[] = [];

this.scrollRef.forEach((ref) => ref.intoView('top'));

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

import ScrollList, {
  ScrollItem,
  ScrollRequest,
} from '../../components/ScrollList';

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
    width: '100%',
    height: '100%',
  },

  scroll: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    height: '100%',
  },

  list: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'flex-start',
  },

  more: {
    margin: rpx2rem(30),
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
  },

  fixed: {
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

type Block<T = Record<string, any>> = null | {
  /**起始索引 */ start: number;
  /**区块列表 */ list: T[];
  /**定位 */ offset: number;
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
  height: number;
  top?: number;

  template: (props: {
    height: number;
    top: number;
    isShow: boolean;
  }) => ReactNode;
};

/**插槽 */
export type ScrollSlot = {
  height: number;
  template?: (props: { height: number }) => ReactNode;
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
  children: ScrollItem<T>;

  /**滚动模式 */ mode?: 'down' | 'up';
  /**滚动动画 */ animation?: boolean;
  /**滚动到指定ID */ intoView?: (id?: string) => void;
  /**滚动到顶部按钮 */ intoViewBtn?: () => ReactNode;
  /**滚动事件 */ onScroll?: (e) => void;

  /**底部 */ footer?: (hasMore: boolean) => ReactNode;
  /**占位 */ placeholder?: () => ReactNode;
  /**固定 */ fixed?: ScrollFixed;
  /**插槽 */ slot?: ScrollSlot;

  /**元素键 */ itemKey?: string;
  /**元素宽度 */ itemWidth?: number;
  /**元素高度 */ itemHeight?: number;
  /**行间距 */ rowGap?: number;
  /**点击事件 */ onSelect?: (e: ScrollItemProps<T>) => void;

  list?: T[];
  /**列表样式 */ listStyle?: CSSProperties;

  /**是否拥有更多数据 */ hasMore?: boolean;
  /**加载更多事件 */ onMore?: () => void;
  /**简单请求方法 */ request?: ScrollRequest<T>;
};

type ScrollState<T = Record<string, any>> = {
  block0: Block<T>;
  block1: Block<T>;
  block2: Block<T>;

  /**元素样式 */ itemStyle: CSSProperties;
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
    mode: 'down',
  };

  state = {
    list: [] as T[],
    hasMore: false,

    block0: null as Block<T>,
    block1: null as Block<T>,
    block2: null as Block<T>,

    itemStyle: {
      marginBottom: '0px',
      width: '100%',
      height: '100%',
    },

    intoViewState: 'null',
    showIntoViewBtn: false,
    showFixed: true,
  };

  componentDidMount() {
    let { request, itemWidth = 0, itemHeight = 0, rowGap = 0 } = this.props;
    let prom = request && this.getList();
    this.rowHeight = itemHeight + rowGap;

    this.getSystemInfo().then((res) => {
      this.px2rpx = (px) => {
        let rpxRatio = 750 / res.windowWidth;
        let rpx = Math.round(px * rpxRatio);
        return rpx;
      };

      this.rowShowCount = Math.ceil(
        this.px2rpx(res.windowHeight) / this.rowHeight,
      );
      this.colShowCount = itemWidth ? Math.floor(750 / itemWidth) : 1;
      this.itemShowCount = this.rowShowCount * this.colShowCount;
      this.blockHeight = this.rowShowCount * this.rowHeight;

      this.setState(
        {
          itemStyle: {
            marginBottom: rpx2rem(rowGap),
            width: itemWidth ? rpx2rem(itemWidth) : '100%',
            height: itemHeight ? rpx2rem(itemHeight) : '100%',
          },
        },
        () => {
          if (request) {
            prom && prom.then(() => this.setBlock(0));
          } else {
            this.setBlock(0);
          }
        },
      );
    });
  }

  componentDidUpdate(prevProps) {
    let { request } = this.props;
    if (request) return;

    let update = (key, fun) => {
      let prev = prevProps[key];
      let next = this.props[key];
      if (next !== prev) fun(next);
    };

    // 更新列表时手动渲染
    update('list', () => {
      this.setBlock(this.blockCurrent);
    });
  }

  /**当前行号 */ rowCurrent = 0;
  /**当前块号 */ blockCurrent = 0;
  /**每行高度 */ rowHeight: number;
  /**区块高度 */ blockHeight: number;
  /**显示行数 */ rowShowCount: number;
  /**显示列数 */ colShowCount: number;
  /**显示个数 */ itemShowCount: number;
  /**px换算rpx */ px2rpx: (px: number) => number;

  /**获取屏幕尺寸 */
  getSystemInfo = () => {
    return new Promise<{
      windowWidth: number;
      windowHeight: number;
    }>((resolve, reject) => {
      Taro.getSystemInfo({
        success: (info) => {
          let windowWidth;
          if (process.env.TARO_ENV === 'h5') {
            let body = this.refContainer.current;
            if (body) {
              windowWidth = body.clientWidth;
            } else {
              windowWidth = document.body.scrollWidth;
            }
          } else {
            windowWidth = info.windowWidth;
          }

          resolve({
            windowWidth,
            windowHeight: info.windowHeight,
          });
        },
        fail: reject,
      });
    });
  };

  setBlock = (blockCurrent) => {
    if (blockCurrent === 0) {
      this.setState({
        block0: this.getBlock(0),
        block1: this.getBlock(1),
        block2: this.getBlock(2),
      });
    } else {
      let beforeBlock = this.getBlock(blockCurrent - 1);
      let centerBlock = this.getBlock(blockCurrent);
      let afterBlock = this.getBlock(blockCurrent + 1);

      switch (blockCurrent % 3) {
        case 0:
          this.setState({
            block2: beforeBlock,
            block0: centerBlock,
            block1: afterBlock,
          });
          break;

        case 1:
          this.setState({
            block0: beforeBlock,
            block1: centerBlock,
            block2: afterBlock,
          });
          break;

        case 2:
          this.setState({
            block1: beforeBlock,
            block2: centerBlock,
            block0: afterBlock,
          });
          break;

        default:
          break;
      }
    }
  };
  getBlock = (current) => {
    let { request, fixed, slot } = this.props;
    let list = request ? this.state.list : this.props.list;
    if (!list?.length) return null;

    let fixedHeight = fixed?.height || 0;
    let slotHeight = slot?.height || 0;

    if (current) {
      /* 正在滚动 */
      let start = current * this.itemShowCount;
      if (start >= 0) {
        return {
          start,
          list: list.slice(start, start + this.itemShowCount),
          offset: current * this.blockHeight + fixedHeight + slotHeight,
        };
      } else {
        return null;
      }
    } else {
      /* 初始化 */
      return {
        start: 0,
        list: list.slice(0, this.itemShowCount),
        offset: fixedHeight + slotHeight,
      };
    }
  };

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
    let scrollTop = this.px2rpx ? this.px2rpx(detail.scrollTop) : 0;

    let rowCurrent = Math.floor(scrollTop / this.rowHeight);
    if (rowCurrent === this.rowCurrent) return;
    this.rowCurrent = rowCurrent;

    let blockCurrent = Math.floor(rowCurrent / this.rowShowCount);
    if (blockCurrent === this.blockCurrent) return;
    this.blockCurrent = blockCurrent;

    this.setBlock(blockCurrent);
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
    let { mode, request, onMore } = this.props;
    if (direction !== mode) return;

    if (request) {
      if (!this.state.hasMore) return console.log('已无法获取更多');
      if (this.isLoading) return;

      this.getList().then(() => this.setBlock(this.blockCurrent));
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
    top: 'scrollUpper',
    bottom: 'scrollLower',
    up: 'scrollUpper',
    down: 'scrollLower',
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
          {footer ? (
            <View style={css.more}>{footer(hasMore ?? false)}</View>
          ) : (
            <View style={css.more}>
              {hasMore ? '正在加载数据......' : '---- 已经达到底部 ----'}
            </View>
          )}
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
        <View style={{ height }} />

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

  Scroll = (List) => {
    let { request, slot, placeholder } = this.props;
    let { block0, block1, block2 } = this.state;
    let list = request ? this.state.list : this.props.list;

    return (
      <Block>
        {block0 && List(block0)}
        {block1 && List(block1)}
        {block2 && List(block2)}

        {/* 占位  */}
        {list?.length ? (
          <View
            style={{
              height: `${rpx2rem(
                Math.ceil(list.length / this.colShowCount) * this.rowHeight,
              )}`,
            }}
          />
        ) : (
          <View
            style={{
              width: '100%',
              height: slot?.height
                ? `calc(100% - ${rpx2rem(slot.height)})`
                : '100%',
            }}
          >
            {placeholder?.()}
          </View>
        )}
      </Block>
    );
  };
  List = (block: Block<T>) => {
    if (!block?.list?.length) return null;

    let { children, itemKey = 'id', listStyle, onSelect } = this.props;
    let { itemStyle } = this.state;

    return (
      <View
        style={{
          ...css.list,
          ...listStyle,
          transform: `translate3d(0, ${rpx2rem(block.offset)}, 0)`,
        }}
        onClick={onSelect && this.onSelect}
      >
        {block.list.map((v, k) => {
          let index = block.start + k;
          let id = `ScrollItem__${v[itemKey] ?? index}`;
          let content = children({
            item: v,
            index,
          });

          return (
            <View style={itemStyle} key={id} id={id} data-index={index}>
              {onSelect ? (
                <View style={css.stopPropagation}>{content}</View>
              ) : (
                content
              )}
            </View>
          );
        })}
      </View>
    );
  };
  Slot = (slot: ScrollProps<T>['slot']) => {
    if (!slot?.height) return null;

    let height = rpx2rem(slot.height);
    return (
      <View style={{ height }}>
        {slot.template?.({
          height,
        })}
      </View>
    );
  };

  refContainer = React.createRef<HTMLDivElement>();
  render() {
    let { slot, animation = true, intoViewBtn, ...scrollProps } = this.props;
    let { intoViewState, showIntoViewBtn } = this.state;

    return (
      <View style={css.wrap} ref={this.refContainer}>
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
          {this.End('up')}

          {/* 固定 */}
          {this.Fixed()}

          {/* 插槽 */}
          {this.Slot(slot)}

          {/* 区块列表 */}
          {this.Scroll(this.List)}

          {this.End('down')}
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
