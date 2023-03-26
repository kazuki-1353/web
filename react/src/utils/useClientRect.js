/* 

import useClientRect from '../../utils/useClientRect';

let [rect,refRect]=useClientRect();

ref={refRect}

rect.top
rect.right
rect.bottom
rect.left
rect.width
rect.height
rect.x
rect.y

 */

import React from 'react';

let useClientRect = () => {
  const [rect, setRect] = React.useState({});

  // 确保即便子组件延迟显示被测量的节点 (比如为了响应一次点击)，我们依然能够在父组件接收到相关的信息，以便更新测量结果
  const refRect = React.useCallback(
    (ele) => {
      if (ele) setRect(ele.getBoundingClientRect());
    },
    [], // 确保了 ref callback 不会在再次渲染时改变
  );
  return [rect, refRect];
};

export default useClientRect;
