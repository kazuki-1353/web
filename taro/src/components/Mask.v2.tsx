/* 

showMask: false,
onMaskTrigger = () => this.setState((state) => ({ showMask: !state.showMask }));
let [showMask, setShowMask] = useState(false);

<Mask isShow={showMask} onClose={this.onMaskTrigger}></Mask>
<Mask isShow={showMask} onClose={setShowMask.bind(null, false)}></Mask>



// 关闭图标
close
closeIcon=''
closeStyle={{}}



position='center'
position='start'
position='end'

x={}
y={}

fill
anime
bg=''

*/

import React, {
  CSSProperties,
  FC,
  memo,
  useMemo,
  useCallback,
  useRef,
} from 'react';

import Taro from '@tarojs/taro';
import { View, Image, Icon } from '@tarojs/components';
import { Property } from 'csstype';

let rpx2rem = (rpx, design = 750) => {
  let isNumber = Number(rpx);
  let rem = isNumber ? Taro.pxTransform(rpx, design) : rpx;
  return rem ?? 0;
};

let css: {
  [key: string]: CSSProperties;
} = {
  wrap: {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 999,

    width: '100%',
    height: '100%',
  },

  box: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
  },

  content: {
    position: 'relative',

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    position: 'absolute',
    zIndex: 1,
    top: rpx2rem(-60),
    right: rpx2rem(-60),

    padding: rpx2rem(40),
    width: rpx2rem(40),
    height: rpx2rem(40),
  },
};

type Position = {
  style: CSSProperties;
  class: {
    in: string;
    out: string;
  };
};
let positions: {
  [key: string]: Position;
} = {
  center: {
    style: {
      justifyContent: 'center',
    },
    class: {
      in: 'zoomIn',
      out: 'zoomOut',
    },
  },
  start: {
    style: {
      justifyContent: 'flex-start',
    },
    class: {
      in: 'slideInDown',
      out: 'slideOutUp',
    },
  },
  end: {
    style: {
      justifyContent: 'flex-end',
    },
    class: {
      in: 'slideInUp',
      out: 'slideOutDown',
    },
  },
};

let Comp: FC<{
  children: JSX.Element;
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

  let _position = positions[position];

  let wrapCSS = useMemo(() => {
    let obj = {
      class: '',
      style: {
        ...css.wrap,
        background: bg,
      },
    };

    if (anime) {
      let name = isShow ? 'fadeIn' : 'fadeOut';
      obj.class = ['animate__animated', `animate__${name}`].join(' ');
      obj.style.transition = 'visibility 0.3s';
    }

    obj.style.visibility = isShow ? 'visible' : 'hidden';

    return obj;
  }, [isShow, anime, bg]);

  let boxCSS = useMemo(() => {
    let obj = {
      class: '',
      style: {
        ...css.box,
        ..._position.style,
      },
    };

    if (anime) {
      let name = isShow ? _position.class.in : _position.class.out;
      obj.class = ['animate__animated', `animate__${name}`].join(' ');
    }

    return obj;
  }, [isShow, anime, _position]);

  let contentCSS = useMemo(() => {
    let obj = {
      class: '',
      style: css.content,
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
      style: css.icon,
    };

    if (closeStyle) {
      obj.style = {
        ...obj.style,
        ...closeStyle,
      };
    }

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

  /**停止冒泡 */
  let stopPropagation = useCallback(
    (e) => {
      if (fill) return;

      e.stopPropagation();
    },
    [fill],
  );

  return ready.current ? (
    <View
      className={wrapCSS.class}
      style={wrapCSS.style}
      catchMove
      onClick={onClick}
    >
      <View className={boxCSS.class} style={boxCSS.style}>
        <View style={contentCSS.style} onClick={stopPropagation}>
          {close && (
            <Icon
              style={closeCSS.style}
              color={closeCSS.style.color}
              type='clear'
              onClick={onClose}
            />
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
