import React, {
  CSSProperties,
  ReactNode,
  ReactNodeArray,
  memo,
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
// import { useSelector, useDispatch } from 'react-redux';

import Taro, { FC } from '@tarojs/taro';
import { Block, View, Text, Image, Map, MapProps } from '@tarojs/components';
import { MapContext } from '@tarojs/taro/types';

let select = 'mapID_' + Date.now();

const Comp: FC<MapProps & {
  name: string;
}> = memo((props) => {
  let { name, longitude, latitude, ...mapProps } = props;

  // let [data, setData] = useState();
  // let select = useSelector((state) => state);
  // let fun = useCallback(() => {}, []);

  let markers = useMemo(() => {
    return [
      {
        id: 0,
        name,
        longitude,
        latitude,
        iconPath: '',
        // width: '',
        // height: '',
      },
    ];
  }, [name, longitude, latitude]);

  let mapCtx = useRef<MapContext>();
  useEffect(() => {
    mapCtx.current = Taro.createMapContext(select);

    mapCtx.current.addMarkers({
      markers,
      clear: true,
    });
  }, [markers]);
  // useEffect(() => {}, []);

  let css = useMemo<Record<string, CSSProperties>>(() => {
    return {
      map: {
        width: '100%',
        height: '100%',
      },
    };
  }, []);

  // if (!data) return null;

  return (
    <Map
      id={select}
      style={css.map}
      longitude={longitude}
      latitude={latitude}
      scale={14}
      showLocation
      {...mapProps}
    />
  );
});

export default Comp;
