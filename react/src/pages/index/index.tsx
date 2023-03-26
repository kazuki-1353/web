import React, { memo, useMemo, useCallback, useEffect, useState, useRef } from 'react';
import type { FC } from 'react';

import css from './index.css';
// import css from './index.module.scss';

const Comp: FC = (props) => {
  // let { children } = props;

  // let [data, setData] = useState();
  // if (!data) return null;

  // useEffect(() => {}, []);
  // let fun = useCallback(() => {}, []);

  return <div className={css.wrap}></div>;
};

export default memo(Comp);
