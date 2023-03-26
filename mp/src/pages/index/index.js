// const app = getApp();
// const appData = app.data;

const page = {
  data: {
    
  },

  navigate: app.navigate,
  toggleMask: app.toggleMask,
  onPullDownRefresh: app.pullDownRefresh,
  onShareAppMessage(res) {
    const opt = {
      from: res.from,
      target: res.target,
      title: '',
      imageUrl: '',
      path: '',
    };
    return app.shareAppMessage(opt);
  },

  onLoad(options) {
    app.pageLoad(this);
  },
  onShow() {
    app.pageShow(this);
  },
};

Page(page);
