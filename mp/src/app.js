import config from './config';
import api from './api';

import system from './utils/system';

const app = {
  data: {
    ...config,
  },

  api, // 接口
  ...system,

  onLaunch(options) {},
  onShow(options) {},
  onHide() {},

  pageLoad(that) {
    that.setData({
      options: that.options,
      state: this.state,
    });
  },
  pageShow(that) {},

  // 分享
  shareAppMessage(opt) {
    console.log('分享', opt.path);

    return {
      title: opt.title,
      imageUrl: opt.imageUrl,
      path: opt.path || '/pages/index/index',
    };
  },
};

App(app);
