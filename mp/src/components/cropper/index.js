/*

// 在页面中声明自定义组件
"usingComponents": {
  "my-cropper": "../../components/cropper/index",
}

<my-cropper 
  show="{{showCropper}}"
  bind:confirm="onCropperConfirm"
  bind:cancel="triggerCropper"
  bind:error=""
 />

triggerCropper() {
  let showCropper = !this.data.showCropper;
  this.setData({ showCropper });
},
onCropperConfirm(e) {
  let { detail } = e;
  this.setData(
    {
      img: detail,
    },
    this.triggerCropper,
  );
},

 */

// import WeCropper from './we-cropper.js';
import WeCropper from './we-cropper.min.js';

const theme = {
  green: '#04b00f',
  red: '#C20C0C',
  yellow: '#F0C040',
};

const device = wx.getSystemInfoSync();
const width = device.windowWidth;
const height = device.windowHeight - 50;

let ComponentOpt = {
  // externalClasses: ['myclass'],
  // options: {
  //   addGlobalClass: true,
  //   multipleSlots: true,
  // },

  data: {
    cropperOpt: {
      id: 'cropper',
      pixelRatio: device.pixelRatio,
      width,
      height,
      scale: 2.5,
      zoom: 8,

      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300,
      },

      boundStyle: {
        color: theme.green,
        mask: 'rgba(0,0,0,0.8)',
        lineWidth: 1,
      },
    },
  },

  properties: {
    show: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal, changedPath) {
        if (newVal) this.init();
      },
    },

    src: {
      type: String,
      value: '',
    },
  },

  // lifetimes: {
  //   created() {},
  //   attached() {},
  //   ready() {},
  //   detached() {},
  // },

  methods: {
    init() {
      if (this.hasInit) return;

      const { cropperOpt, src } = this.data;
      this.createSelectorQuery()
        .select(`#${cropperOpt.id}`)
        .fields({ node: true, size: true })
        .exec((res) => {
          this.hasInit = true;

          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');

          const dpr = wx.getSystemInfoSync().pixelRatio;
          canvas.width = res[0].width * dpr;
          canvas.height = res[0].height * dpr;
          ctx.scale(dpr, dpr);
          cropperOpt.canvas = canvas;
          cropperOpt.ctx = ctx;

          if (src) {
            this.creat(src);
          } else {
            this.upload();
          }
        });
    },

    upload() {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        complete: (res) => {
          const src = res.tempFilePaths ? res.tempFilePaths[0] : '';

          /* 判断是否已初始化裁剪工具 */
          if (this.cropper) {
            /* 如果上传了新图片则更新裁剪工具 */
            if (src) {
              const { cropperOpt } = this.data;
              cropperOpt.src = src;
              this.cropper.pushOrign(src);
            }
          } else {
            this.creat(src);
          }
        },
      });
    },

    creat(src) {
      const { cropperOpt } = this.data;
      cropperOpt.src = src;
      this.cropper = new WeCropper(cropperOpt)
        // .on('ready', (ctx) => {
        //   console.log(`wecropper is ready for work!`);
        // })
        .on('beforeImageLoad', (ctx) => {
          // console.log(`before picture loaded, i can do something`);
          // console.log(`current canvas context:`, ctx);
          wx.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 20000,
          });
        })
        .on('imageLoad', (ctx) => {
          // console.log(`picture loaded`);
          // console.log(`current canvas context:`, ctx);
          wx.hideToast();
        });
      // .on('beforeDraw', (ctx, instance) => {
      //   console.log(`before canvas draw,i can do something`);
      //   console.log(`current canvas context:`, ctx);
      // });
    },

    getCropperImage() {
      const { cropperOpt } = this.data;
      if (!cropperOpt.src) return;

      this.cropper.getCropperImage(
        {
          componentContext: this,
        },
        (path, err) => {
          if (err) {
            console.error(err);
            this.triggerEvent('error', err);

            wx.showModal({
              title: '温馨提示',
              content: err.errMsg || err.message,
            });
          } else {
            // wx.previewImage({
            //   current: '', // 当前显示图片的http链接
            //   urls: [path], // 需要预览的图片http链接列表
            // });

            this.triggerEvent('confirm', path);
          }
        },
      );
    },

    cancel() {
      this.triggerEvent('cancel');
    },

    removeImage() {
      this.cropper.removeImage();
    },
    touchStart(e) {
      this.cropper.touchStart(e);
    },
    touchMove(e) {
      this.cropper.touchMove(e);
    },
    touchEnd(e) {
      this.cropper.touchEnd(e);
    },
  },
};

Component(ComponentOpt);
