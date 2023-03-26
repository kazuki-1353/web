/*

import BDmap from '@/components/BDmap';

<BDmap ak={} />

point={}
zoom={}

width={}
height={}

onLoad={(map)=>{}}


// 标注
import type { MarkerEvent } from '@/components/BDmap';
markers={}
onClickMarker={}
const onClickMarker: MarkerEvent<Data> = useCallback((e) => {
  const { data, index } = e;
}, []);

*/

import React, { memo, useState, useEffect, useMemo } from 'react';
import type { FC } from 'react';
import type { Properties } from 'csstype';

export const rpx2px = (rpx: any, design = 750) => {
  const isNumber = Number(rpx);
  const width = document.body.scrollWidth;
  const pxRatio = width / design;
  const rem = isNumber ? pxRatio * +rpx : rpx;
  return rem ?? 0;
};

declare global {
  interface Window {
    BDmapCallback?: () => void;
  }
}
export declare class BMap {
  static Map: new (ele: string | Element) => any;
  static Point: new (x: number, y: number) => any;
  static Marker: new (point: any) => any;
}

export type Point = {
  x?: number;
  y?: number;
  longitude?: number;
  latitude?: number;
};
const getPoint = (point: Point) => {
  const x = Number(point.x ?? point.longitude);
  const y = Number(point.y ?? point.latitude);

  if (Number.isNaN(x) && Number.isNaN(y)) {
    throw new Error('缺失坐标');
  } else {
    const _point = new BMap.Point(x, y);
    return _point;
  }
};

export type MarkerEvent<T = any> = (e: { data: T; index: number }) => void;

const Comp: FC<{
  ak: string;

  /** 位置 */ point?: string | Point;
  /** 缩放 */ zoom?: number;

  /** 标注 */ markers?: Point[];
  /** 标注点击事件 */ onClickMarker?: MarkerEvent;

  // /** 禁止地图拖拽 */ noDragging?: boolean;
  // /** 禁止双击放大 */ noDoubleClickZoom?: boolean;
  // /** 禁止滚轮缩放 */ noScrollWheelZoom?: boolean;

  width?: number | string;
  height?: number | string;

  onLoad?: (map: any) => void;
}> = memo((props) => {
  const {
    ak,
    point = '北京',
    zoom = 9,

    markers = [],
    onClickMarker,

    // noDragging,
    // noDoubleClickZoom,
    // noScrollWheelZoom,

    width = '100%',
    height = '100%',

    onLoad,
  } = props;

  const [map, setMap] = useState<any>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.BDmapCallback = () => {
      if (!containerRef.current) throw new Error('缺失地图容器');

      const _map = new BMap.Map(containerRef.current);
      _map.enableScrollWheelZoom(); // 滚轮缩放

      setMap(_map);
      onLoad?.(_map);
    };

    const script = document.createElement('script');
    script.src = `https://api.map.baidu.com/api?v=3.0&ak=${ak}&callback=BDmapCallback`;

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [ak, onLoad]);

  /* 位置 */
  useEffect(() => {
    if (!map) return;

    if (typeof point === 'string') {
      map.centerAndZoom(point, zoom);
    } else {
      const _point = getPoint(point);
      map.centerAndZoom(_point, zoom);
    }
  }, [map, point, zoom]);

  /* 标注 */
  useEffect(() => {
    if (!map) return;

    map.clearOverlays();

    markers.forEach((data, index) => {
      const _point = getPoint(data);
      const marker = new BMap.Marker(_point);
      map.addOverlay(marker);

      if (onClickMarker) {
        marker.addEventListener(
          'click',
          onClickMarker.bind(null, {
            data,
            index,
          }),
        );
      }
    });
  }, [map, markers, onClickMarker]);

  const css = useMemo<Record<string, Properties>>(() => {
    return {
      wrap: {
        width: rpx2px(width),
        height: rpx2px(height),
      },
    };
  }, [width, height]);

  return <div style={css.wrap} ref={containerRef} />;
});

export default Comp;
