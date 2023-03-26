/*

index.config.ts
usingComponents: {
  'ec-canvas': '../../components/ec-canvas/index',
},

index.tsx
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

import React, { memo } from 'react';
import { ECharts, EChartsOption } from 'echarts';

import Taro, { FC } from '@tarojs/taro';
import { View } from '@tarojs/components';

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
  let { options, width = '100%', height = '100%' } = props;
  if (!options) return null;

  let onReady = (e) => {
    let myChart: ECharts = e.detail;
    props.onReady?.(myChart);
  };

  return (
    <View
      style={{
        width: rpx2rem(width),
        height: rpx2rem(height),
      }}
    >
      <ec-canvas options={options} onReady={onReady} />
    </View>
  );
};

export default memo(Comp);
export type { ECharts, EChartsOption };
