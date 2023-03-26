/*

import ECcanvas, {
  ECharts,
  EChartsOption,
} from '../../components/ECcanvas';

<ECcanvas options={options} />
width=''
height=''

onReady={this.onReady}
onReady = (myChart: ECharts) => {};

*/

import React, { memo, useEffect, useRef } from 'react';

import Taro, { FC } from '@tarojs/taro';
import { View } from '@tarojs/components';

import * as echarts from 'echarts';
import { ECharts, EChartsOption } from 'echarts';

export const rpx2rem = (rpx: number | string, design = 750): string => {
  let num = Number(rpx);
  if (Number.isNaN(num)) {
    return `${rpx}`;
  } else {
    return Taro.pxTransform(num, design);
  }
};

const Comp: FC<{
  options: EChartsOption;
  width?: number;
  height?: number;
  onReady?: (myChart: ECharts) => void;
}> = (props) => {
  let { options, width = '100%', height = '100%', onReady } = props;

  let ref = useRef<HTMLDivElement>();
  let myChart = useRef<ECharts>();

  useEffect(() => {
    let dom = ref.current;
    if (!dom) return;

    // 基于准备好的dom，初始化echarts实例
    myChart.current = echarts.init(dom);
  }, []);

  useEffect(() => {
    if (!myChart.current) return;

    // 绘制图表
    myChart.current.setOption(options);

    onReady?.(myChart.current);
  }, [options, onReady]);

  return (
    <View
      style={{
        width: rpx2rem(width),
        height: rpx2rem(height),
      }}
      ref={ref}
    />
  );
};

export default memo(Comp);
export type { ECharts, EChartsOption };
