/*

在页面里配置
index.config.ts
usingComponents: {
  'my-subscribe': '../../../components/Subscribe/subscribe/index',
},

import Subscribe from '../../components/Subscribe';

<Subscribe tmplIds={tmplIds} ></Subscribe>

force
reject={this.SubscribeReject}

onSuccess={this.onSubscribeSuccess}
onFail={this.onSubscribeFail}

*/

import React, {
  CSSProperties,
  memo,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

import Taro, { FC } from '@tarojs/taro';
// import { Block, View, Text, Image } from '@tarojs/components';

import css from './index.module.scss';

const Comp: FC<{
  children: React.ReactElement;
  tmplIds: string[];

  /**是否强制订阅 */ force?: boolean;
  /**全部拒绝后的内容 */ reject?: () => React.ReactElement;

  onSuccess?: (e) => void;
  onFail?: (e) => void;
}> = (props) => {
  let { children, tmplIds = [], force, reject } = props;

  let onSuccess = useCallback(
    (e) => {
      let { detail } = e;
      props.onSuccess?.(detail);
    },
    [props],
  );
  let onFail = useCallback(
    (err) => {
      props.onFail?.(err);
    },
    [props],
  );

  return process.env.TARO_ENV === 'weapp' ? (
    <my-subscribe
      tmplIds={tmplIds}
      force={force}
      onSuccess={onSuccess}
      onFail={onFail}
    >
      <view>{children}</view>
      {reject && <view slot='reject'>{reject()}</view>}
    </my-subscribe>
  ) : (
    children
  );
};

export default memo(Comp);
