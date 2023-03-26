/*

componentDidShow() {
  let instance = Taro.getCurrentInstance();
  let comp = instance.page?.getTabBar?.();
  if (comp) {
    let currentPath = 'pages/index/index';
    comp.setData({ currentPath });
  }
}

*/

import config from '../app.config';

// let app = getApp();
// let appData = app.data;

let ComponentOpt = {
  data: {
    tabBar: {},
    list: [],
    currentPath: '',
  },

  lifetimes: {
    // created() {},
    attached() {
      let { tabBar } = config;

      // 给图标重新定位
      let list = tabBar.list.map((i) => ({
        ...i,
        icon: i.iconPath.replace(/(\.)+/, ''),
        select: i.selectedIconPath.replace(/(\.)+/, ''),
      }));

      this.setData({ tabBar, list });
    },
    ready() {
      // this.init();
    },
    // detached() {},
  },

  methods: {
    // init() {
    //   let pages = getCurrentPages();
    //   let page = pages[pages.length - 1];

    //   this.setData({ currentPath: page.route });
    // },

    onClick(e) {
      let { index, mode = 'switchTab' } = e.target.dataset;
      if (index === undefined) return;

      let { list } = this.data;
      if (!list.length) return;

      let item = list[index];
      if (!item) return;

      let currentPath = item.pagePath;
      let navigate = wx[mode];
      navigate({ url: `/${currentPath}` });
    },
  },
};

Component(ComponentOpt);
