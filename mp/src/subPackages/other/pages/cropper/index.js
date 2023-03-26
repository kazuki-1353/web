/* 

let url='/subPackages/other/pages/cropper/index';
<navigator url=""></navigator>

onShow() {
  wx.getStorage({
    key: 'cropperImage',
    success: (res) => {
      let { data } = res;
    },
  });
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

Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      targetId: 'targetCropper',
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

  onLoad(option) {
    let { src } = option;
    if (src) {
      this.creat(src);
    } else {
      wx.getStorage({
        key: 'cropperImage',
        complete: (res) => {
          let { data } = res;
          if (data) {
            this.creat(data);
          } else {
            this.upload();
          }
        },
      });
    }
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
          if (src) this.cropper.pushOrign(src);
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
    this.cropper.getCropperImage(function(path, err) {
      if (err) {
        wx.showModal({
          title: '温馨提示',
          content: err.message,
        });
      } else {
        wx.setStorage({
          key: 'cropperImage',
          data: path,
          success: wx.navigateBack,
        });

        // wx.previewImage({
        //   urls: [path], // 需要预览的图片 http 链接列表
        // });
      }
    });
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
});
