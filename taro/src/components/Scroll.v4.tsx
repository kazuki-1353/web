/* 


ScrollContent = ({ data, index }) => (
  <View key={index}></View>
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
state = {
  list: [],
  hasMore: false,
};

hasMore={hasMore}
onMore={this.onMore}

isLoading = false;

getList = (page: number) => {
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

onMore = (page: number) => {
  if (this.isLoading) return;
  this.getList(page);
};

*/

import React, { CSSProperties, PureComponent } from 'react';

import Taro from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';

const css: {
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
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  more: {
    margin: '5px 0 10px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#999',
  },
};

let rpx2rem = (rem, design = 750) => Taro.pxTransform(rem, design);

type Data = any;
type ItemProps = {
  row: number;
  index: number;
  data: Data;
  style: CSSProperties;
};

type StateProps = {};
type DispatchProps = {};
type OwnProps = {
  children: (props) => React.ReactNode;
  list: Data[];

  /**元素宽度 */ itemWidth: number;
  /**元素高度 */ itemHeight: number;
  /**行间距 */ gapRow: number;
  /**列间距 */ gapCol: number;

  /**方向 */ mode: 'down' | 'up';

  /**跳转到ID */ intoView?: string;
  /**是否使用弹性布局 */ isFlex?: boolean;

  /**是否拥有更多数据 */ hasMore?: boolean;
  /**加载更多事件 */ onMore?: (page: number) => void;

  /**滚动事件 */ onScroll?: (e) => void;
};
type OwnState = {
  span: number;
  listShow: ItemProps[];
};

class Comp extends PureComponent<
  OwnProps & StateProps & DispatchProps,
  OwnState
> {
  static defaultProps = {
    itemWidth: 'auto',
    itemHeight: 'auto',
    gapRow: 0,
    gapCol: 0,
    mode: 'down',
  };

  state = {
    span: 2,
    listShow: [] as ItemProps[],
  };

  componentDidMount() {
    const { itemWidth, itemHeight, gapRow, gapCol, isFlex } = this.props;
    if (isFlex) return;

    this.colWidth = itemWidth + gapCol;
    this.rowHeight = itemHeight + gapRow;

    // 获取屏幕尺寸
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

        this.px2rpx = (px) => {
          let rpxRatio = 750 / windowWidth;
          let rpx = Math.round(px * rpxRatio);
          return rpx;
        };

        this.windowHeight = this.px2rpx(info.windowHeight);

        let rowShow = Math.ceil(this.windowHeight / this.rowHeight);
        this.rowShowCount = rowShow * 3; //预留3屏数据

        let span =
          typeof this.colWidth === 'number'
            ? Math.floor(750 / this.colWidth)
            : 1;

        this.setState({ span }, this.initListShow);
      },
    });
  }
  componentDidUpdate(prevProps) {
    const { isFlex } = this.props;
    if (isFlex) return;

    let update = (key, fun) => {
      let next = this.props[key];
      let prev = prevProps[key];
      if (next !== prev) fun(next);
      return next;
    };

    // 更新列表时手动渲染
    update('list', () => {
      this.moreListShow();
    });
  }

  /**列宽 */ colWidth: number;
  /**行高 */ rowHeight: number;
  /**显示行数 */ rowShowCount: number;
  /**视窗高度 */ windowHeight: number;
  /**px换算rpx */ px2rpx: (px: number) => number;

  /**获取行中所有的元素 */
  getCells(row: number) {
    let { list = [], itemWidth, itemHeight } = this.props;
    if (!list.length) return [];

    let cells: ItemProps[] = [];

    let { span } = this.state;
    for (let i = 0; i < span; i++) {
      let index = row * span + i;
      let data = list[index];
      if (data) {
        let style: CSSProperties = {
          position: 'absolute',
          top: rpx2rem(this.rowHeight * row),
          width: typeof itemWidth === 'number' ? rpx2rem(itemWidth) : '100%',
          height: rpx2rem(itemHeight),
        };

        switch (span) {
          case 1:
            style.left = 0;
            break;

          case 2:
            if (i) {
              style.right = 0;
            } else {
              style.left = 0;
            }
            break;

          default:
            style.left = rpx2rem(this.colWidth * i);
            break;
        }

        cells.push({
          row,
          index,
          data,
          style,
        });
      }
    }

    return cells;
  }

  /**初始化区域列表显示元素 */
  initListShow() {
    let listShow: ItemProps[] = [];
    for (let i = 0; i < this.rowShowCount; i++) {
      let rows = this.getCells(i);
      listShow = [...listShow, ...rows];
    }

    this.setState({
      listShow,
    });
  }

  /**加载更多区域列表显示元素 */
  scrollTop = 0;
  moreListShow() {
    let top = this.scrollTop - this.windowHeight;
    let topRow = top < 0 ? 0 : Math.floor(top / this.rowHeight);

    /**获取应当显示区域的所有元素 */
    let cells: ItemProps[] = [];
    for (let i = 0; i < this.rowShowCount; i++) {
      let topCells = this.getCells(topRow + i);
      cells = [...cells, ...topCells];
    }

    this.setState((state) => {
      let { listShow } = state;

      /**当前区域元素 */ let oldItems: ItemProps[] = [];
      /**加载更多元素 */ let newItems: ItemProps[] = [];

      /**区分新旧元素 */
      cells.forEach((newItem) => {
        /**重复元素 */
        let equal = listShow.find((oldItem) => oldItem.index === newItem.index);
        if (equal) {
          /* 判断旧元素是否更新 */
          if (equal.data === newItem.data) {
            oldItems.push(equal);
          } else {
            newItems.push(newItem);
          }
        } else {
          newItems.push(newItem);
        }
      });

      /**如果元素不足时补全数组列表 */
      let arr =
        cells.length > listShow.length
          ? cells.map((v, k) => listShow[k])
          : listShow;

      let newList = this.replaceItem(arr, oldItems, newItems, true);
      return { listShow: newList };
    });
  }

  /**替换数组内的元素 */
  replaceItem(arr, source, target, isDiff = false) {
    if (!source.length) return arr;
    if (!target.length) return arr;

    let indexs = arr.reduce((p, v, k) => {
      let index = source.findIndex((item) => v === item);
      if (~index) {
        return isDiff ? p : [...p, k];
      } else {
        return isDiff ? [...p, k] : p;
      }
    }, []);

    let newArr = [...arr];

    target.forEach((v, k) => {
      let index = indexs[k];
      newArr[index] = v;
    });

    return newArr;
  }

  onScroll = (e) => {
    this.props.onScroll?.(e);

    const { isFlex } = this.props;
    if (isFlex) return;

    const { detail } = e;
    this.scrollTop = this.px2rpx?.(detail.scrollTop);
    this.moreListShow();
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

  Item = () => {
    let { span, listShow } = this.state;
    if (!listShow.length) return null;

    let { children, list } = this.props;
    let count = Math.ceil(list.length / span);
    let height = rpx2rem(this.rowHeight * count);

    return (
      <View
        style={{
          height,
        }}
      >
        {listShow.map((props: ItemProps) => {
          let { row, index, data, style } = props;
          let id = `ScrollItem_r${row}_i${index}`;
          return (
            <View style={style} key={id} id={id}>
              {children({
                index,
                data,
              })}
            </View>
          );
        })}
      </View>
    );
  };

  FlexItemStyle: CSSProperties = {
    width: rpx2rem(this.props.itemWidth),
    marginBottom: rpx2rem(this.props.gapRow),
  };
  FlexItem = () => {
    let { children, list } = this.props;
    if (!list.length) return null;

    return (
      <View style={css.list}>
        {list.map((data, index) => (
          <View style={this.FlexItemStyle} key={index}>
            {children({
              index,
              data,
            })}
          </View>
        ))}
      </View>
    );
  };

  refContainer = React.createRef<HTMLDivElement>();
  render() {
    let { intoView = '', isFlex } = this.props;

    let item = isFlex ? this.FlexItem() : this.Item();
    if (!item) return null;

    return (
      <View style={css.wrap} ref={this.refContainer}>
        <ScrollView
          style={css.scroll}
          scroll-y
          enable-back-to-top
          scroll-with-animation
          scroll-into-view={this.ids[intoView]}
          onScroll={this.onScroll}
          onScrollToLower={this.onScrollToEnd.bind(this, 'down')}
          onScrollToUpper={this.onScrollToEnd.bind(this, 'up')}
        >
          {this.More('up')}

          {item}

          {this.More('down')}
        </ScrollView>
      </View>
    );
  }
}

export default Comp;
