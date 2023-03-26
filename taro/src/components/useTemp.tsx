import React, {
  CSSProperties,
  memo,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
// import { useSelector } from 'react-redux';

import Taro, { FC } from '@tarojs/taro';
import { Block, View, Text, Image } from '@tarojs/components';

let css: {
  [key: string]: CSSProperties;
} = {};

const Comp: FC<{
  // children: React.ReactChild;
}> = (props) => {
  // let { children } = props;

  // let select = useSelector((state) => state);
  // let [data, setData] = useState();
  // useEffect(() => {}, []);

  return <View style={css.wrap}></View>;
};

export default (opt) => {
  // let MyComp = useCallback(() => <Comp></Comp>, []);

  return {
    MyComp: memo(Comp),
  };
};
