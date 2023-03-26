/*

import LongText from '../components/LongText';

<LongText></LongText>

mode='ellipsis' // 单行省略
mode='multiline' // 多行省略
mode='between' // 中间省略

mode='scroll' // 滚动
mode='hover' // 鼠标悬停时滚动
speed={} // 滚动速度

begin={} // 指定字串长度, 没达到则使用单行省略

*/

import React, {
  CSSProperties,
  memo,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';

/* 字串滚动组件 */
export const Scrolling = memo((props: Props) => {
  let { children, mode = 'scroll', speed = 1 } = props;

  let isHover = mode === 'hover';
  let base = (3 * speed) / children.length;

  let ref = useRef<number>(NaN);
  let [x, setX] = useState(0);

  let start = useCallback(() => {
    if (!children) return;

    ref.current = requestAnimationFrame(() => {
      setX((_x) => {
        let a = _x - base;
        let b = a % 50;
        let c = +b.toFixed(2);
        return c;
      });
      start();
    });
  }, [children, base]);

  let stop = useCallback(() => {
    cancelAnimationFrame(ref.current);
  }, []);

  useEffect(() => {
    if (!isHover) start();
    return stop;
  }, [isHover, start, stop]);

  let css = useMemo<Record<string, CSSProperties>>(() => {
    return {
      wrap: {
        overflow: 'hidden',
      },
      texts: {
        display: 'inline-block' /* 使宽度跟随文本内容 */,
        whiteSpace: 'nowrap',
        transform: `translateX(${x}%)`,
      },
      text: {
        paddingRight: '5em' /*无缝滚动的首位间隙*/,
      },
    };
  }, [x]);

  return (
    <div
      style={css.wrap}
      onMouseOver={isHover ? start : undefined}
      onMouseOut={isHover ? stop : undefined}
    >
      <div style={css.texts}>
        <span style={css.text}>{children}</span>
        <span style={css.text}>{children}</span>
      </div>
    </div>
  );
});

/* 中间省略组件 */
export const Between = memo((props: Props) => {
  let { children } = props;

  let centre = Math.floor(children.length / 2);
  let left = children.slice(0, centre);
  let right = children.slice(centre, children.length);

  let css = useMemo<Record<string, CSSProperties>>(() => {
    let ellipsis: CSSProperties = {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    };

    return {
      wrap: {
        display: 'flex',
        flexDirection: 'row',
      },
      textL: {
        ...ellipsis,
        direction: 'ltr', //文本从左到右
      },
      textR: {
        ...ellipsis,
        direction: 'rtl', //文本从右到左
      },
    };
  }, []);

  return (
    <div style={css.wrap} title={children}>
      <span style={css.textL}>{left}</span>
      <span style={css.textR}>{right}</span>
    </div>
  );
});

/* 多行省略组件 */
export const Multiline = memo((props: Props) => {
  let { children } = props;

  let css = useMemo<Record<string, CSSProperties>>(() => {
    return {
      wrap: {
        position: 'relative',
        overflow: 'hidden',
        display: 'inline-block',
        width: '100%',
        height: '100%',
        background: 'inherit',
      },
      ellipsis: {
        float: 'right', //右浮动
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end', //居下对齐
        height: '100%',
        shapeOutside: 'inset(calc(100% - 1em) 0 0)', //缩进到靠近省略号位置
      },
      cover: {
        position: 'absolute',
        width: '999vh',
        height: '999vh',
        background: 'inherit', //设置和底色相同的颜色
        boxShadow: '-2em 2em inherit', //左下的阴影
      },
    };
  }, []);

  return (
    <div style={css.wrap} title={children}>
      <span style={css.ellipsis}>...</span>
      <span>{children}</span>
      <span style={css.cover} />
    </div>
  );
});

/* 单行省略组件 */
export const Ellipsis = memo((props: Props) => {
  let { children } = props;

  let css = useMemo<Record<string, CSSProperties>>(() => {
    return {
      wrap: {
        overflow: 'hidden',
        display: 'inline-block',
        width: '100%',
        verticalAlign: 'middle',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    };
  }, []);

  return (
    <span style={css.wrap} title={children}>
      {children}
    </span>
  );
});

export type Props = {
  children: string;

  mode?:
    | 'ellipsis' // 单行省略
    | 'multiline' // 多行省略
    | 'between' // 中间省略
    | 'scroll' // 滚动
    | 'hover'; // 鼠标悬停时滚动

  begin?: number;
  /**滚动速度 */ speed?: number;
};
const LongText = memo((props: Props) => {
  let { children, mode = 'ellipsis', begin = 20 } = props;
  if (!children) return null;

  let len = children?.length || 0;
  if (len >= begin) {
    switch (mode) {
      /* 滚动 */
      case 'scroll':
      case 'hover':
        return <Scrolling {...props} />;

      /* 中间省略 */
      case 'between':
        return <Between {...props} />;

      /* 多行省略 */
      case 'multiline':
        return <Multiline {...props} />;

      /* 单行省略 */
      case 'ellipsis':
        return <Ellipsis {...props} />;

      default:
        return <Ellipsis>{children}</Ellipsis>;
    }
  } else {
    return <Ellipsis>{children}</Ellipsis>;
  }
});

export default LongText;
