/*

import Mask from '@/components/Mask';
import Mask, { rpx2px } from '@/components/Mask';



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
  bottom: rpx2px(-100),
  height: rpx2px(100),
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
  FC,
  memo,
  useMemo,
  useCallback,
  useRef,
} from 'react';

import { Property } from 'csstype';

export const rpx2px = (rpx: any, design = 750) => {
  let isNumber = Number(rpx);
  let width = document.body.scrollWidth;
  let pxRatio = width / design;
  let rem = isNumber ? pxRatio * +rpx : rpx;
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
    <div style={css.cross}>
      <div style={css.child1} />
      <div style={css.child2} />
    </div>
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
  children: React.ReactChild | React.ReactChild[];
  isShow: boolean;
  onClose?: (e: React.MouseEvent) => void;

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
        top: rpx2px(y),
        left: rpx2px(x),
      };
    }

    return obj;
  }, [fill, x, y]);

  let childrenCSS = useMemo(() => {
    let obj = {
      class: '',
      style: {
        position: 'relative',
        zIndex: 0,
        width: '100%',
        height: '100%',
      } as CSSProperties,
    };

    return obj;
  }, []);

  let closeCSS = useMemo(() => {
    let obj = {
      class: '',
      style: (closeStyle || {
        position: 'absolute',
        zIndex: 999,
        top: rpx2px(-60),
        right: rpx2px(-60),
        boxSizing: 'content-box',
        padding: rpx2px(20),
        fontSize: rpx2px(40),
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
    <div className={wrapCSS.class} style={wrapCSS.style} onClick={onClick}>
      <div className={boxCSS.class} style={boxCSS.style}>
        <div style={contentCSS.style} onClick={stopPropagation}>
          {close && (
            <div style={closeCSS.style} onClick={onClose}>
              <CrossHollow />
            </div>
          )}

          {closeIcon && (
            <img style={closeCSS.style} src={closeIcon} onClick={onClose} />
          )}

          <div style={childrenCSS.style}>{props.children}</div>
        </div>
      </div>
    </div>
  ) : null;
};

export default memo(Comp);
