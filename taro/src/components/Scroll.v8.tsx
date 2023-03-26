/*

import Scroll, {
  ScrollItemProps,
} from '../../components/Scroll';

ScrollItem = (props: ScrollItemProps<any>) => {
  let { item, index } = props;
  return <View></View>;
};

<Scroll list={scrollList}>
  {this.ScrollItem}
</Scroll>



// 弹性布局
flex

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



// 滚动到顶部按钮
intoViewBtn={this.ScrollIntoViewBtn}
IntoViewBtn = () => {}



// 滚动到指定ID
ref={this.scrollRef}
scrollRef = React.createRef<Scroll>();

let ref = this.scrollRef.current;
ref && ref.intoView();
ref && ref.intoView('bottom');



// 列表滚动到指定ID
ref={(ele) => ele && (this.scrollRef[k] = ele)}
scrollRef: Scroll[] = [];

this.scrollRef.forEach((ref) => ref.intoView('top'));



// 占位
placeholder={}

// 加载更多数据提示
footer={}



// 弹性布局的插槽
slot={this.ScrollSlot}

// 长列表的插槽
slot={{
  height: 330,
  template: this.ScrollSlot,
}}



// 点击元素
onSelect={this.onScrollSelect}

onScrollSelect = (e: ScrollItemProps<any>) => {
  let { item, index } = e;
};

*/

/* 触底请求更多

hasMore={this.state.hasScrollMore}
onMore={this.onScrollMore}

state = {
  scrollList: [],
  hasScrollMore: false,
};

scrollPage = 0;
isLoading = false;

getScrollList = () => {
  this.isLoading = true;
  this.scrollPage += 1;

  Taro.showLoading({
    title: '加载中',
    mask: true,
  });

  api({page: this.scrollPage})
    .then((res) => {
      let { list, limit } = res;

      this.setState(
        (state) => {
          if (list?.length) {
            // 根据每次请求返回的数组长度判断是否还有更多数据
            return {
              scrollList: this.scrollPage === 1 ? list: [...state.scrollList, ...list],
              hasScrollMore: list.length >= limit,
            };
          } else {
            return {
              scrollList: state.scrollList,
              hasScrollMore: false,
            };
          }
        },
        () => {
          this.isLoading = false;
          Taro.hideLoading();
        },
      );
    })
    .catch((err) => {
      this.scrollPage -= 1;
      this.isLoading = false;
      Taro.hideLoading();
      throw err;
    });
}
onScrollMore = () => {
  if (this.isLoading) return;
  this.getScrollList();
};

*/

/* 简单请求模式

import Scroll, {
  ScrollItemProps,
  ScrollRequest,
} from '../../components/Scroll';

request={this.scrollRequest}

scrollRequest: ScrollRequest<any> = (page) => {
  return api({
      page,
    })
    .then((res) => {
      let { list, limit } = res.data;

      // 根据每次请求返回的数组长度判断是否还有更多数据
      let hasMore = list?.length >= limit;

      return {
        list,
        hasMore,
      };
    });
};

*/

import React, { CSSProperties, PureComponent } from 'react';

import Taro from '@tarojs/taro';
import { Block, View, ScrollView } from '@tarojs/components';

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

  position: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'flex-start',
  },

  more: {
    margin: '20px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#999',
  },

  placeholder: {
    width: '100%',
    height: '100%',
  },

  icon: {
    position: 'absolute',
    zIndex: 1,
    bottom: '20px',
    right: '20px',
    transitionProperty: 'visibility,opacity',
    transitionDuration: '.5s',
  },
};

type Block<T> = null | {
  /**起始索引 */ start: number;
  /**区块列表 */ list: T[];
  /**定位 */ offset: number;
};

export type ScrollRequest<T> = (
  page: number,
) => Promise<{
  list: T[];
  hasMore: boolean;
}>;

export type ScrollItemProps<T> = { item: T; index: number };
export type ScrollProps<T> = {
  children: (props: ScrollItemProps<T>) => React.ReactNode;

  list?: T[];
  /**是否拥有更多数据 */ hasMore?: boolean;
  /**加载更多事件 */ onMore?: () => void;
  /**请求方法 */ request?: ScrollRequest<T>;

  /**弹性布局 */ flex?: boolean;
  /**元素宽度 */ itemWidth?: number;
  /**元素高度 */ itemHeight?: number;
  /**行间距 */ rowGap?: number;

  /**元素键 */ itemKey?: string;
  /**列表样式 */ listStyle?: CSSProperties;

  /**占位 */ placeholder?: () => React.ReactNode;
  /**底部 */ footer?: (hasMore: boolean) => React.ReactNode;

  /**插槽 */
  slot?:
    | (() => React.ReactNode)
    | {
        template: () => React.ReactNode;
        height: number;
      };

  /**滚动模式 */ mode?: 'down' | 'up';
  /**滚动动画 */ animation?: boolean;
  /**滚动到指定ID */ intoView?: (id?: string) => void;
  /**滚动到顶部按钮 */ intoViewBtn?: () => React.ReactNode;

  /**滚动事件 */ onScroll?: (e) => void;
  /**点击事件 */ onSelect?: (e: ScrollItemProps<T>) => void;
};

type ScrollState<T> = {
  block0: Block<T>;
  block1: Block<T>;
  block2: Block<T>;

  /**元素样式 */ itemStyle: CSSProperties;

  intoViewState: string;
  showIntoViewBtn: boolean;

  list: T[];
  hasMore: boolean;
};
class Comp extends PureComponent<ScrollProps<any>, ScrollState<any>> {
  static defaultProps = {
    flex: false,

    itemWidth: 0,
    itemHeight: 0,
    rowGap: 0,

    slot: {
      height: 0,
      template: null,
    },

    mode: 'down',
    animation: true,
  };

  state = {
    list: [] as any[],
    hasMore: false,

    block0: null as Block<any>,
    block1: null as Block<any>,
    block2: null as Block<any>,

    itemStyle: {
      marginBottom: '0px',
      width: '100%',
      height: '100%',
    },

    intoViewState: 'null',
    showIntoViewBtn: false,
  };

  componentDidMount() {
    let {
      request,
      flex,
      itemWidth = 0,
      itemHeight = 0,
      rowGap = 0,
    } = this.props;

    let prom = request && this.getList();
    if (flex) return;

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
    let { flex, request } = this.props;
    if (flex) return;
    if (request) return;

    let update = (key, fun) => {
      let prev = prevProps[key];
      let next = this.props[key];
      if (next !== prev) fun(next);
    };

    // 更新列表时手动渲染
    update('list', () => {
      /* 因屏幕差异, 最好调用2遍 */
      this.setBlock(this.rowCurrent - 1);
      this.setBlock(this.rowCurrent);
    });
  }

  /**当前行号 */ rowCurrent = 0;
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

  setBlock = (rowCurrent) => {
    if (rowCurrent === 0) {
      let block = this.getBlock(0);
      this.setState({
        block0: block,
      });
    } else {
      let blockCurrent = Math.floor(rowCurrent / this.rowShowCount);
      let beforeBlock = this.getBlock(blockCurrent - 1);
      let afterBlock = this.getBlock(blockCurrent + 1);

      switch (blockCurrent % 3) {
        case 0:
          this.setState({
            block2: beforeBlock,
            block1: afterBlock,
          });
          break;

        case 1:
          this.setState({
            block0: beforeBlock,
            block2: afterBlock,
          });
          break;

        case 2:
          this.setState({
            block1: beforeBlock,
            block0: afterBlock,
          });
          break;

        default:
          break;
      }
    }
  };
  getBlock = (current) => {
    let { request, slot } = this.props;
    let list = request ? this.state.list : this.props.list;
    if (!list?.length) return null;

    let slotHeight = typeof slot === 'object' ? slot.height : 0;

    if (current) {
      /* 正在滚动 */
      let start = current * this.itemShowCount;
      if (start >= 0) {
        return {
          start,
          list: list.slice(start, start + this.itemShowCount),
          offset: current * this.blockHeight + slotHeight,
        };
      } else {
        return null;
      }
    } else {
      /* 初始化 */
      return {
        start: 0,
        list: list.slice(0, this.itemShowCount),
        offset: slotHeight,
      };
    }
  };

  onScroll = (e) => {
    let { detail } = e;
    let { flex, intoViewBtn, onScroll } = this.props;

    onScroll && onScroll(e);

    // 如果有滚动到顶部按钮
    if (intoViewBtn) {
      if (detail.scrollTop > 1000) {
        this.setState({ showIntoViewBtn: true });
      } else {
        this.setState({ showIntoViewBtn: false });
      }
    }

    if (flex) return;

    let scrollTop = this.px2rpx ? this.px2rpx(detail.scrollTop) : 0;

    let rowCurrent = Math.floor(scrollTop / this.rowHeight);
    if (rowCurrent === this.rowCurrent) return;

    this.rowCurrent = rowCurrent;
    this.setBlock(this.rowCurrent);
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
        let { list, hasMore } = res;

        this.setState(
          (state) => {
            if (list?.length) {
              return {
                list: [...state.list, ...list],
                hasMore,
              };
            } else {
              return {
                list: state.list,
                hasMore: false,
              };
            }
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
    let { request, mode, onMore } = this.props;
    if (direction !== mode) return;

    if (request) {
      if (!this.state.hasMore) return console.log('已无法获取更多');
      if (this.isLoading) return;

      this.getList().then(() => this.setBlock(this.rowCurrent));
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
    let { request, footer, rowGap = 0 } = this.props;
    let list = request ? this.state.list : this.props.list;
    let isMore = list?.length && mode === this.props.mode;
    if (isMore) {
      let hasMore = request ? this.state.hasMore : this.props.hasMore;

      let style =
        rowGap > 10
          ? {
              ...css.more,
              marginTop: 0,
            }
          : css.more;

      return (
        <View id={this.ids[mode]}>
          {footer ? (
            <View style={style}>{footer(hasMore ?? false)}</View>
          ) : (
            <View style={style}>
              {hasMore ? '正在加载数据......' : '---- 已经达到底部 ----'}
            </View>
          )}
        </View>
      );
    } else {
      return <View id={this.ids[mode]} />;
    }
  };

  FlexScroll = () => {
    let {
      children,
      request,
      listStyle,
      itemKey = 'id',
      placeholder,
      onSelect,
    } = this.props;
    let list = request ? this.state.list : this.props.list;

    return list?.length ? (
      <View
        style={{
          ...css.flex,
          ...listStyle,
        }}
        onClick={onSelect && this.onSelect}
      >
        {list.map((item, index) => {
          return (
            <View
              key={item[itemKey]}
              id={`ScrollItem__${index}`}
              data-index={index}
            >
              {children({
                item,
                index,
              })}
            </View>
          );
        })}
      </View>
    ) : (
      <View style={css.placeholder}>{placeholder?.()}</View>
    );
  };
  Scroll = (List) => {
    let { request, placeholder } = this.props;
    let { block0, block1, block2 } = this.state;
    let list = request ? this.state.list : this.props.list;

    return list?.length ? (
      <Block>
        {block0 && List(block0)}
        {block1 && List(block1)}
        {block2 && List(block2)}

        {/* 占位 */}
        <View
          style={{
            height: `${rpx2rem(
              Math.ceil(list.length / this.colShowCount) * this.rowHeight,
            )}`,
          }}
        />
      </Block>
    ) : (
      <View style={css.placeholder}>{placeholder?.()}</View>
    );
  };
  List = (block: Block<any>) => {
    if (!block?.list?.length) return null;

    let { children, itemKey = 'id', listStyle, onSelect } = this.props;
    let { itemStyle } = this.state;

    return (
      <View
        style={{
          ...css.position,
          ...css.flex,
          ...listStyle,
          transform: `translate3d(0, ${rpx2rem(block.offset)}, 0)`,
        }}
        onClick={onSelect && this.onSelect}
      >
        {block.list.map((item, index) => {
          let id = block.start + index;
          return (
            <View
              style={itemStyle}
              key={item[itemKey]}
              id={`ScrollItem__${id}`}
              data-index={id}
            >
              {children({
                item,
                index,
              })}
            </View>
          );
        })}
      </View>
    );
  };
  Slot = (slot: ScrollProps<any>['slot']) => {
    if (!slot) return null;
    if (typeof slot === 'function') return slot();

    let { template, height } = slot;
    if (typeof template === 'function') {
      return (
        <View
          style={{
            height: rpx2rem(height),
          }}
        >
          {template()}
        </View>
      );
    } else {
      return null;
    }
  };

  refContainer = React.createRef<HTMLDivElement>();
  render() {
    let { flex, slot, animation, intoViewBtn } = this.props;
    let { intoViewState, showIntoViewBtn } = this.state;

    return (
      <View style={css.wrap} ref={this.refContainer}>
        <ScrollView
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

          {/* 插槽 */}
          {this.Slot(slot)}

          {/* 区块列表 */}
          {flex ? this.FlexScroll() : this.Scroll(this.List)}

          {this.End('down')}
        </ScrollView>

        {intoViewBtn && (
          <View
            style={{
              ...css.icon,
              visibility: showIntoViewBtn ? 'visible' : 'hidden',
              opacity: showIntoViewBtn ? '1' : '0',
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
