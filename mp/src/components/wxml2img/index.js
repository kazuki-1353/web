let ComponentOpt = {
  data: {
    src: '',
  },
  properties: {
    data: {
      type: Object,
      value: {
        wxml: '',
        style: {},
      },
      observer(newVal) {
        if (!newVal) return;
        this.create();
      },
    },

    width: {
      type: Number,
      value: 300,
    },

    height: {
      type: Number,
      value: 200,
    },
  },

  lifetimes: {
    // created() {},
    // attached() {},
    ready() {
      this.widget = this.selectComponent('.widget');
      this.create();
    },
    // detached() {},
  },

  widget: null,
  methods: {
    create() {
      if (!this.widget) return;

      let { data } = this.data;
      if (!data || !data.wxml) return;

      this.getCanvas(data)
        .then(this.getPath.bind(this))
        .then((res) => {
          this.triggerEvent('success', res);
        })
        .catch((err) => {
          this.triggerEvent('fail', err);
        });
    },

    getCanvas(data) {
      return this.widget.renderToCanvas({
        wxml: data.wxml,
        style: data.style,
      });
    },

    getPath(canvas) {
      return this.widget.canvasToTempFilePath().then((res) => {
        return {
          ...canvas.layoutBox,
          path: res.tempFilePath,
        };
      });
    },
  },
};

Component(ComponentOpt);
