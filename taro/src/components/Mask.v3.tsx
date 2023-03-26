/*

import Mask from '@/components/Mask';
import Mask, { rpx2rem } from '@/components/Mask';



showMask: false,
onMaskTrigger = () => this.setState((state) => ({ showMask: !state.showMask }));
let [showMask, setShowMask] = useState(false);

<Mask isShow={showMask} onClose={this.onMaskTrigger}></Mask>
<Mask isShow={showMask} onClose={setShowMask.bind(null, false)}></Mask>



// 铺满屏幕, 可滚动
fill

// 关闭图标
close
closeIcon=''
closeStyle={{}}
closeStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: rpx2rem(-100),
  height: rpx2rem(100),
};

position='center'
position='start'
position='end'

x={}
y={}

anime
bg=''


// 防止滚动穿透
overscroll-behavior:contain;

*/

import React, {
  CSSProperties,
  ReactNode,
  FC,
  memo,
  useMemo,
  useCallback,
  useRef,
} from 'react';

import Taro from '@tarojs/taro';
import { View, Image, Icon } from '@tarojs/components';

import { Property } from 'csstype';

export const rpx2rem = (rpx, design = 750) => {
  let isNumber = Number(rpx);
  let rem = isNumber ? Taro.pxTransform(rpx, design) : rpx;
  return rem ?? 0;
};

export const CrossHollow: FC = memo(() => {
  let css = useMemo<{
    [key: string]: CSSProperties;
  }>(() => {
    let child: CSSProperties = {
      position: 'absolute',
      top: '0.3125em',
      left: '0.1em',

      display: 'block',
      width: '0.6em',
      height: '0.15em',
      borderRadius: '0.25em',
      background: 'currentColor',
    };

    return {
      cross: {
        position: 'relative',
        boxSizing: 'content-box',
        overflow: 'hidden',
        display: 'inline-block',

        width: '0.8em',
        height: '0.8em',
        border: '0.1em solid currentColor',
        borderRadius: '1.25em',
        verticalAlign: 'middle',
      },
      child1: {
        ...child,
        transform: 'rotate(-45deg)',
      },
      child2: {
        ...child,
        transform: 'rotate(45deg)',
      },
    };
  }, []);

  return (
    <View style={css.cross}>
      <View style={css.child1} />
      <View style={css.child2} />
    </View>
  );
});

type Position = {
  class: {
    in: string;
    out: string;
  };
  style: CSSProperties;
};
let positions: {
  [key: string]: Position;
} = {
  center: {
    class: {
      in: 'zoomIn',
      out: 'zoomOut',
    },
    style: {
      justifyContent: 'center',
    },
  },
  start: {
    class: {
      in: 'slideInDown',
      out: 'slideOutUp',
    },
    style: {
      justifyContent: 'flex-start',
    },
  },
  end: {
    class: {
      in: 'slideInUp',
      out: 'slideOutDown',
    },
    style: {
      justifyContent: 'flex-end',
    },
  },
};

let Comp: FC<{
  children: ReactNode | ReactNode[];
  isShow: boolean;
  onClose?: (e) => void;

  /**弹窗内容位置 */ position?: 'center' | 'start' | 'end';
  /**水平偏移 */ x?: number | string;
  /**垂直偏移 */ y?: number | string;
  /**关闭图标样式 */ closeStyle?: CSSProperties;

  /**背景 */ bg?: Property.Background;
  /**铺满 */ fill?: boolean;
  /**动画 */ anime?: boolean | string;

  /**关闭按钮 */ close?: boolean;
  /**自定义关闭图标 */ closeIcon?: string;
}> = (props) => {
  let {
    isShow = false,
    onClose,

    position = 'center',
    x,
    y,
    closeStyle,

    bg = 'rgba(0,0,0,.7)',
    fill = false,
    anime = false,

    close = false,
    closeIcon,
  } = props;

  let ready = useRef(false);
  if (isShow) ready.current = true;

  let wrapCSS = useMemo(() => {
    let obj = {
      class: '',
      style: {
        position: 'fixed',
        zIndex: 999,
        top: 0,
        left: 0,

        width: '100%',
        height: '100%',

        background: bg,
        visibility: isShow ? 'visible' : 'hidden',
        touchAction: 'none', // 防止滚动穿透
      } as CSSProperties,
    };

    if (anime) {
      let name = isShow ? 'fadeIn' : 'fadeOut';
      obj.class = ['animate__animated', `animate__${name}`].join(' ');
      obj.style.transition = 'visibility 0.3s';
    }

    return obj;
  }, [isShow, anime, bg]);

  let boxCSS = useMemo(() => {
    let _position = positions[position];

    let obj = {
      class: '',
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

        boxSizing: 'border-box',
        width: '100%',
        height: '100%',

        ..._position.style,
      } as CSSProperties,
    };

    if (anime) {
      let name = isShow ? _position.class.in : _position.class.out;
      obj.class = ['animate__animated', `animate__${name}`].join(' ');
    }

    return obj;
  }, [isShow, position, anime]);

  let contentCSS = useMemo(() => {
    let obj = {
      class: '',
      style: {
        position: 'relative',

        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      } as CSSProperties,
    };

    if (fill) {
      obj.style = {
        ...obj.style,
        justifyContent: 'unset',
        overflow: 'auto',
        width: '100%',
        height: '100%',
      };
    }

    if (x || y) {
      obj.style = {
        ...obj.style,
        top: rpx2rem(y),
        left: rpx2rem(x),
      };
    }

    return obj;
  }, [fill, x, y]);

  let closeCSS = useMemo(() => {
    let obj = {
      class: '',
      style: (closeStyle || {
        position: 'absolute',
        zIndex: 1,
        top: rpx2rem(-60),
        right: rpx2rem(-60),
        boxSizing: 'content-box',
        padding: rpx2rem(20),
        fontSize: rpx2rem(40),
      }) as CSSProperties,
    };

    return obj;
  }, [closeStyle]);

  let onClick = useCallback(
    (e) => {
      if (close) return;
      if (closeIcon) return;

      onClose && onClose(e);
    },
    [close, closeIcon, onClose],
  );

  /**阻止点击冒泡 */
  let stopPropagation = useCallback(
    (e) => {
      if (fill) return;

      e.stopPropagation();
    },
    [fill],
  );

  return ready.current ? (
    <View
      catchMove
      className={wrapCSS.class}
      style={wrapCSS.style}
      onClick={onClick}
    >
      <View className={boxCSS.class} style={boxCSS.style}>
        <View style={contentCSS.style} onClick={stopPropagation}>
          {close && (
            <View style={closeCSS.style} onClick={onClose}>
              <CrossHollow />
            </View>
          )}

          {closeIcon && (
            <Image style={closeCSS.style} src={closeIcon} onClick={onClose} />
          )}

          {props.children}
        </View>
      </View>
    </View>
  ) : null;
};

export default memo(Comp);
