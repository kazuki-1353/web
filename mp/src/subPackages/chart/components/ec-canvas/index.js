/*

usingComponents: {
  'ec-canvas': '../../components/ec-canvas/index',
},

let options = {
  backgroundColor: '#ffffff',
  series: [
    {
      label: {
        normal: {
          fontSize: 14,
        },
      },
      type: 'pie',
      radius: '50%',
      data,
    },
  ],
};

<ec-canvas options={options} />

*/

import * as echarts from './echarts';

let ComponentOpt = {
  data: {
    ec: {},
  },
  properties: {
    options: {
      type: Object,
      value: null,
      observer(newVal) {
        if (!newVal) return;

        let ec = this.getEC(newVal);
        this.setData({ ec });
      },
    },
  },

  methods: {
    getEC(options) {
      return {
        onInit: (canvas, width, height, dpr) => {
          let chart = echarts.init(canvas, null, {
            width,
            height,
            devicePixelRatio: dpr,
          });

          canvas.setChart(chart);
          chart.setOption(options);
          return chart;
        },
      };
    },
  },
};

Component(ComponentOpt);
