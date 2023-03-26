/* 

// 触底获取更多
 <Scroll
  hasMore={hasMore}
  onMore={onMore}
>
  {list.map((i) => ())}
</Scroll>

page = 1;
isLoading = false;

getList = () => {
    this.isLoading = true;
    Taro.showLoading({
      title: '加载中',
      mask: true,
    });

  this.setState(
    (state) => ({
      list: [...state.list, ...res.list],
      hasMore: res.list.length >= limit, //根据每次请求返回的数组长度判断是否还有更多数据
    }),
    () => {
      Taro.hideLoading();
      this.isLoading = false;
    },
  );
}

onMore = () => {
  if (this.isLoading) return;

  this.page += 1;
  this.getList();
};

*/

import Taro, { FC, memo } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';

import { CSSProperties } from 'react';

const flex: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
};

const css: {
  [key: string]: CSSProperties;
} = {
  wrap: {
    height: '100%',
  },
  scroll: {
    height: '100%',
  },
  more: {
    margin: '10px',
    textAlign: 'center',
    color: '#999',
  },
};

type Comp = FC<{
  /**是否拥有更多数据 */ hasMore: boolean;
  /**加载更多事件 */ onMore: () => void;

  isFlex?: boolean;
  /**方向 */ mode?: 'down' | 'up';

  /**跳转到顶部 */ toTop?: boolean;
  /**跳转到底部 */ toBottom?: boolean;

  /**滚动事件 */ onScroll?: (e) => void;
}>;
const Comp: Comp = (props) => {
  const {
    hasMore = false,
    onMore,

    isFlex = true,
    mode = 'down',

    toTop,
    toBottom,

    onScroll,
  } = props;

  let intoView;
  if (toTop) intoView = 'scrollTop';
  if (toBottom) intoView = 'scrollBottom';

  const More = (
    <View style={css.more}>
      {hasMore ? '正在加载数据......' : '---- 萌萌为您甄选优质好物 ----'}
    </View>
  );

  /**获取更多 */
  const onScrollToEnd = (direction) => {
    if (direction !== mode) return;
    if (!hasMore) return console.log('已无法获取更多');
    if (!onMore) throw new Error('缺失 onMore 方法');
    onMore();
  };

  return (
    <View style={css.wrap}>
      <ScrollView
        style={css.scroll}
        scroll-y
        enable-back-to-top
        scroll-with-animation
        scroll-into-view={intoView}
        onScroll={onScroll}
        onScrollToLower={onScrollToEnd.bind(this, 'down')}
        onScrollToUpper={onScrollToEnd.bind(this, 'up')}
      >
        {mode === 'up' ? More : <View id='scrollTop' />}

        <View style={isFlex ? flex : {}}>{props.children}</View>

        {mode === 'down' ? More : <View id='scrollBottom' />}
      </ScrollView>
    </View>
  );
};

export default memo(Comp);
