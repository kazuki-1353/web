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

<ec-canvas options="options" />
bind:init=""

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
        if (newVal) this.setOption();
      },
    },
  },

  lifetimes: {
    ready() {
      let ec = this.init();
      this.setData({ ec });
    },
  },

  methods: {
    init() {
      return {
        onInit: (canvas, width, height, dpr) => {
          let myChart = echarts.init(canvas, null, {
            width,
            height,
            devicePixelRatio: dpr,
          });

          canvas.setChart(myChart);
          this.myChart = myChart;
          this.setOption();

          return myChart;
        },
      };
    },

    setOption() {
      let { options } = this.data;
      if (!options) return;
      if (!this.myChart) return;

      this.myChart.setOption(options);
      this.onReady(this.myChart);
    },

    onReady(myChart) {
      this.triggerEvent('ready', myChart);
    },
  },
};

Component(ComponentOpt);
