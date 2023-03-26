/*

import Debug from '../../components/Debug';

Debug.init()



<Debug></Debug>

duration={10}
clicks={5}

*/

import React, {
  CSSProperties,
  FC,
  memo,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';

let _eruda: any;
export const init = () => {
  if (_eruda) {
    return Promise.resolve(_eruda);
  } else {
    return import('eruda').then((eruda) => {
      eruda.init();
      window.localStorage['eruda-enable'] = 'true';

      _eruda = eruda;
      return eruda;
    });
  }
};

if (window.localStorage['eruda-enable']) {
  try {
    init();
  } catch {
    window.addEventListener('DOMContentLoaded', init);
  }
}

const Comp: FC<{
  children?: React.ReactElement;
  duration?: number;
  clicks?: number;
}> = (props) => {
  let { children = null, duration = 5, clicks = 10 } = props;

  let count = useRef(0);
  let timer = useRef<number>();

  let clearTimeout = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = undefined;
    count.current = 0;
  }, []);

  let setTimeout = useCallback(
    (s) => {
      if (timer.current) return;
      timer.current = window.setTimeout(clearTimeout, s * 1000);
    },
    [clearTimeout],
  );

  let onClick = useCallback(() => {
    setTimeout(duration); /* 在5秒内有效 */
    count.current += 1; /* 点击10次后触发 */
    if (count.current < clicks) return;

    if (window.localStorage['eruda-enable']) {
      console.log('禁用 eruda');
      window.localStorage['eruda-enable'] = '';
    } else {
      console.log('启用 eruda');
      init();
    }

    clearTimeout();
  }, [duration, clicks, setTimeout]);

  let css = useMemo<CSSProperties>(() => {
    return {
      width: '100%',
      height: '100%',
    };
  }, []);

  return (
    <div style={css} onClick={onClick}>
      {children}
    </div>
  );
};

export default memo(Comp);
