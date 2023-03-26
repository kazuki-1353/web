/*

import ToWeMP from '../../components/ToWeMP';

<ToWeMP id={} path={}></ToWeMP>

center

layout='vertical
layout='horizontal

onClick={}
onReady={}
onLaunch={}
onError={}

*/

import React, {
  FC,
  memo,
  useCallback,
  CSSProperties,
  useMemo,
  useState,
} from 'react';

import Taro from '@tarojs/taro';
import { Block, View, Navigator } from '@tarojs/components';

let css: {
  [key: string]: CSSProperties;
} = {
  center: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  btn: {
    position: 'relative',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    verticalAlign: 'middle',
  },

  launch: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },

  loading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    border: 'none',
  },
};

const Comp: FC<{
  children: React.ReactChild | React.ReactChild[];
  id: string;
  path: string;

  center?: boolean;
  // layout?: 'vertical' | 'horizontal';

  /**准备就绪 */ onReady?: (e) => void;
  /**点击按钮 */ onClick?: (e) => void;
  /**跳转成功 */ onLaunch?: (e) => void;
  /**跳转失败 */ onError?: (err) => void;
}> = (props) => {
  let {
    children,
    id,
    path,
    center = false,
    onReady,
    onClick,
    onLaunch,
    onError,
  } = props;
  // let [isReady, setIsReady] = useState(false);

  /**按钮样式 */
  let btn = useMemo(
    () => ({
      ...css.btn,
      ...(center ? css.center : null),
    }),
    [center],
  );

  // let _onReady = useCallback(
  //   (e) => {
  //     // console.log('wx-open-launch-weapp 准备就绪', e);
  //     // setIsReady(true);
  //     onReady?.(e);
  //   },
  //   [onReady],
  // );

  let _onError = useCallback(
    (e) => {
      let isCancel = e.detail?.errMsg?.includes('cancel');
      if (isCancel) return;

      console.error(e);
      onError?.(e);
    },
    [onError],
  );

  let toMP = useCallback(
    (e) => {
      onClick?.(e);

      Taro.navigateToMiniProgram({
        appId: id,
        path,
        success: onLaunch,
        fail: _onError,
      });
    },
    [id, path, onClick, _onError],
  );

  return process.env.TARO_ENV === 'h5' ? (
    <View style={btn} onClick={onClick}>
      <Block>{children}</Block>

      <wx-open-launch-weapp
        style={css.launch}
        username={id}
        path={path}
        onReady={onReady}
        onLaunch={onLaunch}
        onError={_onError}
      >
        <script type='text/wxtag-template'>
          <div style={css.launch} />
        </script>
      </wx-open-launch-weapp>
    </View>
  ) : (
    <View style={btn} onClick={toMP}>
      {children}
    </View>
  );
};

export default memo(Comp);
