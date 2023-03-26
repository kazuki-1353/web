/* 

ScrollContent = (props) => (
  let { data, index } = props;
  <View></View>
)

<Scroll
  list={list}
  itemWidth={100}
  itemHeight={100}
>
  {this.ScrollContent}
</Scroll>


// 间距
gapRow={10}
gapCol={10}


// 跳转到ID
intoView={intoView}

this.setState({intoView:'top'})
this.setState({intoView:'bottom'})
setTimeout(() => {
  this.setState({intoView:''});
});


// 触底获取更多
hasMore={hasMore}
onMore={this.onMore}

state = {
  list: [],
  hasMore: false,
};

isLoading = false;

getList = (page) => {
  this.isLoading = true;
  Taro.showLoading({
    title: '加载中',
    mask: true,
  });

  api({page})
    .then((res) => {
      let { list, limit } = res;
      this.setState(
        (state) => ({
          list: [...state.list, ...list],
          hasMore: list.length >= limit, //根据每次请求返回的数组长度判断是否还有更多数据
        }),
        () => {
          Taro.hideLoading();
          this.isLoading = false;
        },
      );
    })
    .catch((err) => {
      Taro.hideLoading();
      this.isLoading = false;
      throw err;
    });
}

onMore = (page) => {
  if (this.isLoading) return;
  this.getList(page);
};

*/

import React, { CSSProperties, PureComponent } from 'react';

import Taro from '@tarojs/taro';
import { View, ScrollView, Block } from '@tarojs/components';

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
    margin: '5px 0 10px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#999',
  },
};

let rpx2rem = (rpx, design = 750) => (rpx ? Taro.pxTransform(rpx, design) : 0);

type OwnProps = {
  list: any[];
  children: (props) => React.ReactNode;

  /**元素宽度 */ itemWidth: number;
  /**元素高度 */ itemHeight: number;

  /**行间距 */ gapRow: number;
  /**列间距 */ gapCol: number;

  /**方向 */ mode: 'down' | 'up';
  /**跳转到ID */ intoView?: string;

  /**是否拥有更多数据 */ hasMore?: boolean;
  /**加载更多事件 */ onMore?: (page: number) => void;

  /**滚动事件 */ onScroll?: (e) => void;
};
type OwnState = {
  /**起始索引 */ start: number;
  /**终止索引 */ end: number;
  /**显示区定位 */ offset: number;

  /**元素样式 */
  itemStyle: {
    margin: string;
    width: string | number;
    height: string | number;
  };
};

class Comp extends PureComponent<OwnProps, OwnState> {
  static defaultProps = {
    /**元素宽度 */ itemWidth: 0,
    /**元素高度 */ itemHeight: 0,
    /**行间距 */ gapRow: 0,
    /**列间距 */ gapCol: 0,
    /**滚动模式 */ mode: 'down',
  };

  state = {
    start: 0,
    end: 0,
    offset: 0,

    itemStyle: {
      margin: '0px',
      width: '100%',
      height: '100%',
    },
  };

  componentDidMount() {
    const { itemWidth, itemHeight, gapRow, gapCol } = this.props;

    this.colWidth = itemWidth + gapCol;
    this.rowHeight = itemHeight + gapRow;

    this.getSystemInfo().then((res) => {
      this.px2rpx = (px) => {
        let rpxRatio = 750 / res.windowWidth;
        let rpx = Math.round(px * rpxRatio);
        return rpx;
      };

      this.rowShowCount = Math.ceil(
        this.px2rpx(res.windowHeight) / this.rowHeight,
      );
      this.colShowCount =
        this.colWidth === 0 ? 1 : Math.floor(750 / this.colWidth);
      this.itemShowCount = this.rowShowCount * this.colShowCount;

      this.setState({
        start: 0,
        end: this.itemShowCount * 2, // 预留2屏数据

        itemStyle: {
          margin: `0 ${rpx2rem(gapCol)} ${rpx2rem(gapRow)}`,
          width: itemWidth ? rpx2rem(itemWidth) : '100%',
          height: itemHeight ? rpx2rem(itemHeight) : '100%',
        },
      });
    });
  }

  // shouldComponentUpdate(_nextProps, _nextState) {
  //   if (_nextProps.list !== this.props.list) return true;
  //   if (_nextState.start !== this.state.start) return true;
  //   if (_nextState.end !== this.state.end) return true;

  //   return false;
  // }

  /**行高 */ rowHeight: number;
  /**列宽 */ colWidth: number;
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

  onScroll = (e) => {
    this.props.onScroll?.(e);

    const { detail } = e;
    let scrollTop = this.px2rpx?.(detail.scrollTop);

    let row = Math.floor(scrollTop / this.rowHeight);
    let start = row * this.colShowCount;
    let end = start + this.itemShowCount * 2;
    let offset = scrollTop - (scrollTop % this.rowHeight);

    // let count = row * this.colShowCount - this.itemShowCount;
    // let start = count > 0 ? count : 0;
    // let end = count + this.itemShowCount * 3 + 1; // 预留3屏数据
    // let offset = count > 0 ? scrollTop - (scrollTop % this.rowHeight) : 0;

    this.setState({
      start,
      end,
      offset,
    });
  };

  /**获取更多 */
  page = 1;
  onScrollToEnd = (direction) => {
    let { mode, hasMore, onMore } = this.props;

    if (direction !== mode) return;
    if (!hasMore) return console.log('已无法获取更多');
    if (!onMore) throw new Error('缺失 onMore 方法');

    this.page += 1;
    onMore(this.page);
  };

  ids = {
    top: 'scrollUpper',
    bottom: 'scrollLower',
    up: 'scrollUpper',
    down: 'scrollLower',
  };
  More = (_mode: 'down' | 'up') => {
    const { mode, hasMore } = this.props;

    return (
      <View id={this.ids[_mode]}>
        {mode === _mode && (
          <View style={css.more}>
            {hasMore ? '正在加载数据......' : '---- 已经达到底部 ----'}
          </View>
        )}
      </View>
    );
  };

  List = (Item, renderList) => {
    let { list } = this.props;
    let { offset } = this.state;

    let height = `${rpx2rem(
      (list.length / this.colShowCount) * this.rowHeight,
    )}`;
    console.log(99, offset);

    return (
      <Block>
        {/* 占位作用  */}
        <View style={{ height }} />

        <View
          style={{
            ...css.list,
            // top: rpx2rem(offset),
            transform: `translate3d(0, ${rpx2rem(offset)}, 0)`,
          }}
        >
          {Item(renderList)}
        </View>
      </Block>
    );
  };
  Item = (renderList) => {
    let { children } = this.props;
    let { start, itemStyle } = this.state;

    return renderList.map((data, index) => {
      let id = `ScrollItem__${start + index}`;
      return (
        <View style={itemStyle} key={id} id={id} data-index={id}>
          {children({
            data,
            index,
          })}
        </View>
      );
    });
  };

  refContainer = React.createRef<HTMLDivElement>();
  render() {
    let { list, intoView = '' } = this.props;
    let { start, end } = this.state;
    let renderList = list.slice(start, end);

    return (
      <View style={css.wrap} ref={this.refContainer}>
        {renderList?.length ? (
          <ScrollView
            style={css.scroll}
            scrollY
            enableBackToTop
            scrollWithAnimation
            scrollIntoView={this.ids[intoView]}
            onScroll={this.onScroll}
            onScrollToLower={this.onScrollToEnd.bind(this, 'down')}
            onScrollToUpper={this.onScrollToEnd.bind(this, 'up')}
          >
            {this.More('up')}

            {this.List(this.Item, renderList)}

            {this.More('down')}
          </ScrollView>
        ) : null}
      </View>
    );
  }
}

export default Comp;
