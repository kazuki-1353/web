/* 

import Scroll, { ScrollItmeProps } from '../../components/Scroll.v7';

ScrollItem: ScrollItmeProps<any> = (props) => {
  let { item, index } = props;
  return <View></View>;
};

<Scroll
  list={scrollList}
  itemWidth={100}
  itemHeight={100}
>
  {this.ScrollItem}
</Scroll>



// 触底获取更多
hasMore={hasScrollMore}
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
        (state) => ({
          list: [...state.scrollList, ...list],
          hasScrollMore: list.length >= limit, //根据每次请求返回的数组长度判断是否还有更多数据
        }),
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



// 点击元素
onSelect={this.onScrollSelect}

onScrollSelect: ScrollItmeProps<any> = (e) => {
  let { item, index } = e;
};



// 滚动到指定ID
intoView={intoView}

this.setState({ intoView: '' });
this.setState({ intoView: 'top' });
this.setState({ intoView: 'bottom' });
setTimeout(() => this.setState({ intoView: '' }));



// 行间距
rowGap={10}

// 样式
listStyle?: CSSProperties;
itemStyle?: CSSProperties;

// 弹性布局
flex

// 弹性布局的插槽
slot={this.Banner}

// 长列表的插槽
slot={{
  height: 330,
  template: this.Banner,
}}

// 占位图
placeholder={<NoData />}

*/

import React, { CSSProperties, PureComponent } from 'react';

import Taro from '@tarojs/taro';
import { View, ScrollView, Block } from '@tarojs/components';

let rpx2rem = (rpx, design = 750) => (rpx ? Taro.pxTransform(rpx, design) : 0);

let css: {
  [key: string]: CSSProperties;
} = {
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },

  scroll: {
    position: 'relative',
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
    marginBottom: 20,
    textAlign: 'center',
    fontSize: '14px',
    color: '#999',
  },

  placeholder: {
    flex: 1,
  },
};

export type Block = {
  /**起始索引 */ start: number;
  /**区块列表 */ list: any[];
  /**定位 */ offset: number;
};

export type ScrollItmeProps<T> = { item: T; index: number };
export type ScrollProps<T> = {
  children: (props: ScrollItmeProps<T>) => React.ReactNode;
  list: T[];

  listStyle?: CSSProperties;
  itemStyle?: CSSProperties;

  /**方向 */ mode?: 'down' | 'up';
  /**滚动动画 */ animation?: boolean;

  /**占位 */
  placeholder?: () => React.ReactNode;

  /**滚动到指定ID */ intoView?: string;
  /**滚动事件 */ onScroll?: (e) => void;
  /**点击事件 */ onSelect?: (e: ScrollItmeProps<T>) => void;

  /**是否拥有更多数据 */ hasMore?: boolean;
  /**加载更多事件 */ onMore?: () => void;
} & (
  | {
      /**弹性布局 */ flex?: false;

      /**元素宽度 */ itemWidth: number;
      /**元素高度 */ itemHeight: number;
      /**行间距 */ rowGap: number;

      /**插槽 */
      slot?: {
        template: () => React.ReactNode;
        height: number;
      };
    }
  | {
      /**弹性布局 */ flex: true;

      /**元素宽度 */ itemWidth?: number;
      /**元素高度 */ itemHeight?: number;
      /**行间距 */ rowGap?: number;

      /**插槽 */ slot?: () => React.ReactNode;
    }
);

type ScrollState = {
  block0: null | Block;
  block1: null | Block;
  block2: null | Block;

  /**元素样式 */
  itemStyle: CSSProperties;
};
class Comp extends PureComponent<ScrollProps<any>, ScrollState> {
  static defaultProps = {
    /**元素宽度 */ itemWidth: 0,
    /**元素高度 */ itemHeight: 0,
    /**行间距 */ rowGap: 0,
    /**滚动模式 */ mode: 'down',

    flex: false,
    animation: true,

    /**插槽 */
    slot: {
      height: 0,
      template: null,
    },
  };

  state = {
    block0: null as ScrollState['block0'],
    block1: null as ScrollState['block1'],
    block2: null as ScrollState['block2'],

    itemStyle: {
      marginBottom: '0px',
      width: '100%',
      height: '100%',
    },
  };

  componentDidMount() {
    const { itemWidth, itemHeight = 0, rowGap = 0, flex } = this.props;
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
          this.setBlock(0);
        },
      );
    });
  }

  componentDidUpdate(prevProps) {
    const { flex } = this.props;
    if (flex) return;

    let update = (key, fun) => {
      let next = this.props[key];
      let prev = prevProps[key];
      if (next !== prev) fun(next);
      return next;
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
    let { list, slot } = this.props;
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
    this.props.onScroll && this.props.onScroll(e);

    let { flex } = this.props;
    if (flex) return;

    const { detail } = e;
    let scrollTop = this.px2rpx ? this.px2rpx(detail.scrollTop) : 0;

    let rowCurrent = Math.floor(scrollTop / this.rowHeight);
    if (rowCurrent === this.rowCurrent) return;

    this.rowCurrent = rowCurrent;
    this.setBlock(this.rowCurrent);
  };

  /**获取更多 */
  onScrollToEnd = (direction) => {
    let { mode, hasMore, onMore } = this.props;

    if (direction !== mode) return;
    if (!hasMore) return console.log('已无法获取更多');
    if (!onMore) throw new Error('缺失 onMore 方法');

    onMore();
  };

  onSelect = (e) => {
    let { onSelect } = this.props;
    if (!onSelect) return;

    let { dataset } = e.target;
    if (!dataset.item) return;

    onSelect(dataset);
  };

  ids = {
    top: 'scrollUpper',
    bottom: 'scrollLower',
    up: 'scrollUpper',
    down: 'scrollLower',
  };
  More = (_mode: 'down' | 'up') => {
    const { list, mode, hasMore } = this.props;

    return (
      <View id={this.ids[_mode]}>
        {mode === _mode && (
          <View style={css.more}>
            {list.length
              ? hasMore
                ? '正在加载数据......'
                : '---- 已经达到底部 ----'
              : null}
          </View>
        )}
      </View>
    );
  };

  FlexScroll = () => {
    let { list, listStyle, itemStyle, placeholder, children } = this.props;

    return list.length ? (
      <View
        style={{
          ...css.flex,
          ...listStyle,
        }}
        onClick={this.onSelect}
      >
        {list.map((item, index) => {
          return (
            <View
              style={itemStyle}
              id={`ScrollItem__${index}`}
              key={index}
              data-index={index}
              data-item={item}
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
    let { list, placeholder } = this.props;
    let { block0, block1, block2 } = this.state;

    return (
      <Block>
        {block0 && List(block0)}
        {block1 && List(block1)}
        {block2 && List(block2)}

        {/* 占位  */}
        {list.length ? (
          <View
            style={{
              height: `${rpx2rem(
                Math.ceil(list.length / this.colShowCount) * this.rowHeight,
              )}`,
            }}
          />
        ) : (
          <View style={css.placeholder}>{placeholder?.()}</View>
        )}
      </Block>
    );
  };
  List = (block: Block) => {
    if (!block.list.length) return null;

    let { children, listStyle } = this.props;
    let { itemStyle } = this.state;

    return (
      <View
        style={{
          ...css.position,
          ...css.flex,
          ...listStyle,
          transform: `translate3d(0, ${rpx2rem(block.offset)}, 0)`,
        }}
        onClick={this.onSelect}
      >
        {block.list.map((item, index) => {
          let id = block.start + index;
          return (
            <View
              style={itemStyle}
              id={`ScrollItem__${id}`}
              key={id}
              data-index={id}
              data-item={item}
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
    let { animation, intoView = '', flex, slot } = this.props;

    return (
      <View style={css.wrap} ref={this.refContainer}>
        <ScrollView
          style={css.scroll}
          scrollY
          enableBackToTop
          scrollWithAnimation={animation}
          scrollIntoView={this.ids[intoView]}
          onScroll={this.onScroll}
          onScrollToLower={this.onScrollToEnd.bind(this, 'down')}
          onScrollToUpper={this.onScrollToEnd.bind(this, 'up')}
        >
          {this.More('up')}

          {/* 插槽 */}
          {this.Slot(slot)}

          {/* 区块列表 */}
          {flex ? this.FlexScroll() : this.Scroll(this.List)}

          {this.More('down')}
        </ScrollView>
      </View>
    );
  }
}

export default Comp;
