import React, { memo, useState, useMemo, useCallback, useEffect } from 'react';
import type { CSSProperties, FC, ReactNode, ReactNodeArray } from 'react';

import { useModel, history, Link } from 'umi';
import { message, Space, Typography, List, Image, Button, Modal } from 'antd';

// import css from './index.less';

const { Paragraph, Text, Title } = Typography;

const Comp: FC<{
  // children: ReactNode | ReactNodeArray;
}> = memo((props) => {
  // let { children } = props;

  // let [data, setData] = useState();
  // let { initialState, setInitialState } = useModel('@@initialState');
  // let fun = useCallback(() => {}, []);

  // useEffect(() => {}, []);

  // let css = useMemo<Record<string, CSSProperties>>(() => {
  //   return {
  //     wrap: {},
  //   };
  // }, []);

  // if (!data) return null;

  return (
    <div
      // className={css.wrap}
      // style={css.wrap}
    ></div>
  );
});

export default Comp;
