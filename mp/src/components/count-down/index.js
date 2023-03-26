Component({
  properties: {
    /**类型 */
    type: {
      type: String,
      value: '',
    },

    /**时间 */
    end: {
      type: Number,
      value: 0,
      observer(newVal) {
        if (!newVal) return;

        this.stop();

        let time = newVal;
        this.timer = setInterval(() => {
          this.run(time);
          time -= 1;
        }, 1000);
      },
    },

    /**单位 */
    unit: {
      type: String,
      value: 's',
    },
  },

  data: {
    date: '0',
    hour: '00',
    minute: '00',
    second: '00',
  },

  detached() {
    this.stop();
  },

  methods: {
    stop() {
      clearInterval(this.timer);
    },

    run(time) {
      let { unit = 's', type } = this.data;

      if (time > 0) {
        let base = unit === 's' ? 1 : 1000;

        /**天 */ let date = Math.floor(time / 86400 / base); /* 60*60*24 */
        /**时 */ let hour = Math.floor(time / 3600 / base) % 24; /* 60*60 */
        /**分 */ let minute = Math.floor(time / 60 / base) % 60;
        /**秒 */ let second = Math.floor(time / base) % 60;

        this.setData({
          date: `${date}`,
          hour: hour < 10 ? `0${hour}` : `${hour}`,
          minute: minute < 10 ? `0${minute}` : `${minute}`,
          second: second < 10 ? `0${second}` : `${second}`,
        });
      } else {
        this.stop();

        this.setData({
          date: '0',
          hour: '00',
          minute: '00',
          second: '00',
        });

        this.triggerEvent('onEnd', {
          type
        });
      }
    },
  },
});
