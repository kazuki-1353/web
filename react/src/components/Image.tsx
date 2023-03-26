import React, {
  FC,
  memo,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { Properties, Property } from 'csstype';

type ImgProps = React.ImgHTMLAttributes<any>;

export const rpx2px = (rpx: any, design = 750) => {
  let isNumber = Number(rpx);
  let width = document.body.scrollWidth;
  let pxRatio = width / design;
  let rem = isNumber ? pxRatio * +rpx : rpx;
  return rem ?? 0;
};

const Comp: FC<
  ImgProps & {
    /**默认地址 */ defaultSrc?: string;
    /**图片填充方式 */ mode?: Property.ObjectFit;
    /**图片对齐方式 */ position?: Property.ObjectPosition;
    /**设计稿宽度 */ design?: number;
    /**是否懒加载 */ lazy?: boolean;

    onLoad?: (e) => void;
    onError?: (err) => void;
  }
> = (props) => {
  let {
    width: propsWidth,
    height: propsHeight,

    defaultSrc,
    mode = 'contain',
    position = 'center',
    design = 750,
    lazy = false,

    onLoad,
    onError,

    ...imgProps
  } = props;

  let [src, setSrc] = useState('');
  let ref = useRef(null);

  let load = useCallback(() => {
    const img = new Image(); // 新建一个虚拟的 img
    img.src = imgProps.src; // 将传入的 src 赋值给虚拟节点

    img.addEventListener('load', (e) => {
      onLoad?.(e);
      setSrc(imgProps.src);
    });

    img.addEventListener('error', (err) => {
      onError?.(err);
      setSrc(defaultSrc);
    });
  }, [imgProps.src, defaultSrc, onLoad, onError]);

  useEffect(() => {
    /* 是否懒加载 */
    if (lazy) {
      let observer = new IntersectionObserver((entries) => {
        let [entry] = entries;
        if (!entry.isIntersecting) return;

        load();
        observer.unobserve(ref.current);
      });

      observer.observe(ref.current);
    } else {
      load();
    }
  }, [load, lazy]);

  let width = useMemo<ImgProps['width']>(() => {
    if (propsWidth === undefined) {
      return 'auto';
    } else {
      return rpx2px(propsWidth, design);
    }
  }, [propsWidth, design]);
  let height = useMemo<ImgProps['height']>(() => {
    if (propsHeight === undefined) {
      return 'auto';
    } else {
      return rpx2px(propsHeight, design);
    }
  }, [propsHeight, design]);
  let style = useMemo<Properties>(() => {
    return {
      width: width + 'px',
      height: height + 'px',
      verticalAlign: 'middle',
      objectFit: mode,
      objectPosition: position,
    };
  }, [width, height, mode, position]);

  return <img {...imgProps} src={src} style={style} ref={ref} />;
};

export default memo(Comp);
