/*

// 在页面中声明自定义组件
"usingComponents": {
  "my-scroll": "/components/scroll/index",
}

<my-scroll></my-scroll>


// 触底获取更多
hasMore="{{hasMore}}"
bind:more="onMore"

data: {
  list: [],
  hasMore: true,
},

page: 0,
isLoading: false,

getList = () => {
  this.isLoading = true;
  this.page += 1;

  wx.showLoading({
    title: '加载中',
    mask: true,
  });

  api({page: this.page})
    .then((res) => {
      let { list, limit } = res;
      this.setState(
        (state) => ({
          list: [...state.list, ...list],
          hasMore: list.length >= limit, //根据每次请求返回的数组长度判断是否还有更多数据
        }),
        () => {
          this.isLoading = false;
          wx.hideLoading();
        },
      );
    })
    .catch((err) => {
      this.page -= 1;
      this.isLoading = false;
      wx.hideLoading();
      throw err;
    });
}

onMore() {
  if (this.isLoading) return;
  this.getList();
},


// 滚动到指定ID
intoView="{{intoView}}"

this.setData({ intoView: 'top' }, () => this.setData({ intoView: '' }));
this.setData({ intoView: 'bottom' }, () => this.setData({ intoView: '' }));

 */

let comp = {
  data: {
    scrollIntoView: '',
  },

  properties: {
    /**是否拥有更多数据 */
    hasMore: {
      type: Boolean,
      value: true,
    },

    /**滚动到指定ID */
    intoView: {
      type: String,
      value: '',
      observer(newVal) {
        switch (newVal) {
          case undefined:
          case '':
            break;

          case 'top':
            this.setData({ scrollIntoView: 'scrollUpper' });
            break;

          case 'bottom':
            this.setData({ scrollIntoView: 'scrollLower' });
            break;

          default:
            this.setData({ scrollIntoView: newVal });
            break;
        }
      },
    },

    /**方向 */
    mode: {
      type: String,
      value: 'down',
    },
  },

  methods: {
    /**获取更多 */
    onScrollToUpper() {
      this.onScrollToEnd('up');
    },
    onScrollToLower() {
      this.onScrollToEnd('down');
    },
    onScrollToEnd(direction) {
      let { mode, hasMore } = this.data;

      if (direction !== mode) return;
      if (!hasMore) return console.log('已无法获取更多');

      /* 自定义组件内触发页面事件 */
      this.triggerEvent('more');
    },
  },
};

Component(comp);
