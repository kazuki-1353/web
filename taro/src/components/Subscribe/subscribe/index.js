/*

"usingComponents": {
  "my-subscribe": "../../components/subscribe/index"
}

<my-subscribe
  tmplIds="{{tmplIds}}"
  bind:success="onSubscribe"
  bind:fail=""
>
  <view class=""></view>
</my-subscribe>

// 强制订阅
<my-subscribe
  tmplIds="{{tmplIds}}"
  force
  bind:success="onSubscribe"
  bind:fail=""
>
  <view class=""></view>
  <view class="" slot="reject"></view>
</my-subscribe>

*/

let app = getApp();
let appData = app.data;

let compObj = {
  externalClasses: ['myclass'],
  options: {
    multipleSlots: true,
  },
  data: {
    disable: false,
  },
  properties: {
    tmplIds: {
      type: Array,
      value: [],
      observer(newVal) {
        let { force } = this.data;
        if (force) return;
        if (!newVal) return;
        if (!newVal.length) return;

        console.log('订阅模板', newVal);
        this.authorize(newVal);
      },
    },

    /**是否强制订阅 */
    force: {
      type: Boolean,
      value: false,
    },
  },
  methods: {
    /** 判断是否拥有权限并处理 */
    authorize(tmplIds) {
      wx.getSetting({
        withSubscriptions: true,
        success: (res) => {
          console.log('用户当前设置', res);

          let allReject = tmplIds.every(
            (i) => res.subscriptionsSetting[i] === 'reject',
          );

          if (allReject) this.setData({ disable: true });
        },
      });
    },

    onClick() {
      let { tmplIds } = this.data;
      if (!tmplIds) return;
      if (!tmplIds.length) return;

      console.log('订阅模板', tmplIds);

      wx.requestSubscribeMessage({
        tmplIds,
        success: (res) => {
          console.log('订阅消息成功', res);

          let keys = Object.keys(res);
          let accepts = keys.reduce((p, templateId) => {
            if (res[templateId] === 'accept') {
              return [...p, templateId];
            } else {
              return p;
            }
          }, []);

          this.triggerEvent('success', accepts);
        },
        fail: (err) => {
          console.log('订阅消息失败', err);
          this.triggerEvent('fail', err);
        },
      });
    },
  },
};

Component(compObj);
