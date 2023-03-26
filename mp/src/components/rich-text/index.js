/* 

"usingComponents": {
  "my-rich-text": "../component/rich-text/index"
}

<my-rich-text htm="{{}}" />
myclass=""

imgWidth="50%" //图片宽度
imgMiddle=false //图片是否无间隙

space="ensp" //中文字符空格一半大小
space="emsp" //中文字符空格大小
space="nbsp" //根据字体设置的空格大小

*/

const app = getApp();
const appData = app.data;
let comp;

const compObj = {
  externalClasses: ['myclass'],
  data: {
    nodes: '',
  },
  properties: {
    htm: {
      type: String,
      value: '',
      observer(newVal) {
        if (!newVal) return;

        this.setData({
          nodes: this.setImgStyle(newVal),
        });
      },
    },

    space: {
      type: String,
      value: '',
    },

    /**图片宽度 */
    imgWidth: {
      type: String,
      value: '100%',
    },

    /**图片垂直居中 */
    imgMiddle: {
      type: Boolean,
      value: true,
    },
  },
  // created() {
  //   comp = this;
  // },
  // attached() {},
  // detached() {},
  // lifetimes: {
  //   created() {},
  //   attached() {},
  //   detached() {},
  // },
  // pageLifetimes: {
  //   show() {},
  //   hide() {},
  // },
  methods: {
    setImgStyle(htm) {
      let { imgWidth, imgMiddle } = this.data;

      let _htm = htm.replace(/(<img)(.*?)(\/?>)/gi, (match, g1, g2, g3) => {
        let style = `width:${imgWidth};${
          imgMiddle ? 'vertical-align:middle;' : ''
        }`;
        let str = `${g1}${g2} style="${style}" ${g3}`;
        return str;
      });

      return _htm;
    },
  },
};

Component(compObj);
