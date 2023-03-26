/* 

// 获取上一轮的 props 或 state
import usePrevious from '../../utils/usePrevious';
let previous=usePrevious(state);
let previous=usePrevious(state,默认值);

 */

import React from 'react';

let usePrevious = (val, init) => {
  const ref = React.useRef(init);
  React.useEffect(() => {
    ref.current = val;
  });
  return ref.current;
};

export default usePrevious;
