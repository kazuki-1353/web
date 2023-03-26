/* keep alive

import Conditional from '@/components/Conditional';

<Conditional active={}></Conditional>

*/

import React, { useLayoutEffect, useState, useRef } from 'react';
import type { FC } from 'react';
import ReactDOM from 'react-dom';

const Conditional: FC<{
  active: boolean;
}> = (props) => {
  const { children, active } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  /* 在内存中创建一个元素 */
  const elementRef = useRef<HTMLDivElement>(document.createElement('div'));

  /* 记录组件是否被激活过 */
  const [isActivated, setActivated] = useState(false);

  useLayoutEffect(() => {
    if (active) {
      /* 手动添加 element 到 container 的内部 */
      containerRef.current?.appendChild(elementRef.current);
      setActivated(true);
    } else if (containerRef.current?.hasChildNodes()) {
      /* 从 container 内部移除 element */
      containerRef.current?.removeChild(elementRef.current);
    }
  }, [active]);

  return (
    <>
      <div ref={containerRef} />

      {/* 被激活过才渲染 children */}
      {isActivated
        ? /* 将子节点渲染到存在于父组件以外的 DOM 节点 */
          ReactDOM.createPortal(children, elementRef.current)
        : null}
    </>
  );
};

export default Conditional;
