/*

import ECharts from '@/components/ECharts';
import type { EChartsOption } from '@/components/ECharts';

<ECharts options={options} />

onClick={onClick}
let onClick = useCallback((params) => {}, []);

 */

import React, { memo, useMemo, useCallback, useEffect, useState, useRef } from 'react';
import type { FC } from 'react';

import type { Properties, Property } from 'csstype';

import * as echarts from 'echarts/core';
import { TitleComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import type {
  TitleComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
} from 'echarts/components';
import { PieChart, RadarChart } from 'echarts/charts';
import type { PieSeriesOption, RadarSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { LabelLayout } from 'echarts/features';

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | LegendComponentOption
  | TooltipComponentOption
  | PieSeriesOption
  | RadarSeriesOption
>;

const Comp: FC<{
  options: EChartsOption;
  width?: Property.Width;
  height?: Property.Height;
  onReady?: (myChart: echarts.ECharts) => void;
  onClick?: Function;
}> = (props) => {
  const { options, width = '100%', height = '100%', onReady, onClick } = props;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    echarts.use([
      TitleComponent,
      LegendComponent,
      TooltipComponent,
      RadarChart,
      CanvasRenderer,
      PieChart,
      LabelLayout,
    ]);
  }, []);

  useEffect(() => {
    const chartDom = ref.current;
    if (!chartDom) return;
    if (!options) return;

    const myChart = echarts.init(chartDom);
    myChart.setOption(options);

    if (onClick) myChart.on('click', onClick);
    if (onReady) onReady(myChart);
  }, [ref, options, onClick, onReady]);

  const css = useMemo<Record<string, Properties>>(() => {
    return {
      wrap: {
        width,
        height,
      },
    };
  }, [width, height]);

  if (!options) return null;
  return <div style={css.wrap} ref={ref} />;
};

export default memo(Comp);
export type { EChartsOption };
