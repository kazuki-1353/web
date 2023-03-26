import React, { FC, memo, useState, useEffect } from 'react';

import { View, ScrollView } from '@tarojs/components';
import memoize from 'lodash/memoize';
import throttle from 'lodash/throttle';

import api, { Log as Msg } from '../../api';

import Item from '../components/ChatLogItem';

import css from './ChatLog.module.scss';

/**是否正在加载 */
let isLoading = true;
/**是否处于顶部 */
let isAtTop = true;
/**是否处于底部 */
let isAtBottom = false;
/**我的信息 */
let me;

/**自定义 */
const opt = {
  /**获取数据 */
  getData(roomId: string, lastTime: string) {
    return api
      .getChatLog({
        show: roomId,
        last_time: lastTime,
      })
      .then((res) => {
        const { detail } = res;
        return {
          list: detail.log.reverse(),
          perPage: detail.per_page,
        };
      });
  },

  /**获取元素id */
  getId: memoize((msg: Msg) => {
    let guid;
    switch (msg.type) {
      case 'chat': {
        const { sender } = msg;
        guid = sender ? sender.guid : '';
        break;
      }

      case 'join':
      case 'tips': {
        const { customer } = msg;
        guid = customer ? customer.guid : '';
        break;
      }

      default:
        break;
    }

    const time = msg.time.replace(/\W/g, 'T');
    const id = `${guid}_${time}`;
    return id;
  }),

  /**监听信息 */
  onMessage(msg: Msg, myId: string) {
    switch (msg.type) {
      case 'chat': {
        const { sender } = msg;
        if (sender) {
          // 是否为自己发言
          if (sender.guid === myId) return true;
        } else {
          // 主播发言
        }

        break;
      }

      case 'join': {
        // 是否为自己加入
        if (msg.customer.guid === myId) me = msg;
        break;
      }

      default:
        break;
    }

    return false;
  },
};

/**开始滚动 */
const onScroll = throttle(
  () => {
    isAtTop = false;
    isAtBottom = false;
  },
  1000,
  { trailing: false },
);

const Comp: FC<{
  roomId: string;
  myId: string;
  msg: Msg;
}> = (props) => {
  const { roomId, myId, msg } = props;

  const [data, setData] = useState([] as Msg[]);

  /**跳转到指定位置 */
  const [toId, setToId] = useState('');

  /**是否在跳转时动画 */
  const [isAnimation, setIsAnimation] = useState(true);

  /**列表元素的最终时间 */
  const [lastTime, setLastTime] = useState('');

  /**首页数据是否拥有更多 */
  const [hasMore, setHasMore] = useState(true);

  /**初始化 */
  useEffect(() => {
    isLoading = true;
    isAtTop = true;
    isAtBottom = false;
  }, []);

  useEffect(() => {
    if (!roomId) return;
    opt.getData(roomId, lastTime).then((res) => {
      const { list, perPage } = res;
      if (list.length) {
        setData((preData) => {
          // 是否为加载更多
          if (lastTime) {
            return [...list, ...preData];
          } else {
            // 自己是否已进入房间
            return me ? [...list, me] : list;
          }
        });

        /**根据每次请求返回的数组长度判断是否还有更多数据 */
        const { length } = list;
        setHasMore(length >= perPage);

        const id = opt.getId(list[length - 1]);
        if (isAtTop) setToId(id);

        isLoading = false;

        // 重新开启跳转动画
        setTimeout(() => {
          setIsAnimation(true);
        }, 1000);
      } else {
        isLoading = false;
        setHasMore(false);
        setIsAnimation(true);
      }
    });
  }, [roomId, lastTime]);

  /**套接字回调 */
  useEffect(() => {
    if (!msg || !msg.type) return;

    setData((preData) => {
      if (preData.length) {
        return [...preData, msg];
      } else {
        return [];
      }
    });

    const isToId = opt.onMessage(msg, myId);
    if (isToId) {
      const id = opt.getId(msg);
      setToId(id);
    } else if (isAtBottom) {
      // 是否处于底部
      const id = opt.getId(msg);
      setToId(id);
    }
  }, [msg, myId]);

  /**到达底部 */
  const onScrollToLower = () => {
    isAtBottom = true;
  };

  /**到达顶部 */
  const onScrollToUpper = () => {
    isAtTop = true;

    if (isLoading) return;
    if (!hasMore) return;

    isLoading = true;
    setIsAnimation(false);

    // 加载更多
    setLastTime(data[0].time);
  };

  return data.length ? (
    <ScrollView
      className={css.scroll}
      scroll-y
      scroll-with-animation={isAnimation}
      scroll-into-view={toId}
      onScrollToLower={onScrollToLower}
      onScrollToUpper={onScrollToUpper}
      onScroll={onScroll}
    >
      <View className={css.more}>
        {hasMore ? '正在加载数据......' : '---- 萌萌是有底线的 ----'}
      </View>

      {data.map((i) => {
        const id = opt.getId(i);
        return (
          <View className={css.item} id={id} key={id}>
            <Item data={i} />
          </View>
        );
      })}
    </ScrollView>
  ) : null;
};

export default memo(Comp);
