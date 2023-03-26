import React, {
  FC,
  CSSProperties,
  ReactNode,
  memo,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useRequest } from 'ahooks';

import Taro from '@tarojs/taro';
import { Block, View, Text, Image } from '@tarojs/components';

// import api from '../../services';

import css from './index.module.scss';

const Comp: FC<{
  // children: ReactNode | ReactNode[];
}> = memo((props) => {
  // let { children } = props;

  // let request = useRequest(() => {
  //   return api;
  // });

  // let [state, setState] = useState();
  // let select = useSelector((state) => state);
  // let fun = useCallback(() => {}, []);

  // useEffect(() => {}, []);

  // let css = useMemo<Record<string, CSSProperties>>(() => {
  //   return {
  //     wrap: {},
  //   };
  // }, []);

  // let { data, loading, run } = request;
  // if (!data) return null;

  return (
    <View
      className={css.wrap}
      // style={css.wrap}
    ></View>
  );
});

export default Comp;
