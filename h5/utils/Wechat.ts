/*

yarn add weixin-js-sdk

import Wechat, { ShareOption } from './utils/Wechat';

let wechat = new Wechat({
  appId,
  timestamp,
  nonceStr,
  signature,

  jsApiList: ['hideMenuItems', 'hideAllNonBaseMenuItem'],

  link,
  query: {},

  title,
  desc,
  imgUrl,
});

wechat.share();
wechat.share({
  link,
  query: {},

  title,
  desc,
  imgUrl,
});

*/

import wx from 'weixin-js-sdk';

let OPTION = {
  canShare: true,
  // canShare: false,
};

export type ShareOption = {
  /**分享链接 */ link?: string;

  /**分享链接参数 */
  query?: Record<string, string | number>;

  /**分享标题 */ title?: string;
  /**分享描述 */ desc?: string;
  /**分享图标 */ imgUrl?: string;
};

export type Props = ShareOption & {
  appId: string;
  timestamp: string | number;
  nonceStr: string;
  signature: string;

  jsApiList?: string[];
  openTagList?: string[];

  ready?: (_wx) => void;
  error?: (err) => void;
};

export default class {
  constructor(public props: Props) {
    let {
      appId,
      timestamp,
      nonceStr,
      signature,
      jsApiList = [],
      openTagList = [],

      ready,
      error,
    } = props;

    wx.config({
      appId,
      timestamp: timestamp + '',
      nonceStr,
      signature,
      jsApiList: [
        ...jsApiList,
        'onMenuShareAppMessage',
        'updateAppMessageShareData',
        'updateTimelineShareData',
      ],
      openTagList: [...openTagList, 'wx-open-launch-weapp'],
    });

    this.ready = new Promise((resolve, reject) => {
      let href = new String(window.location.href);
      let isDev = href.includes('localhost') || href.includes('192.168');
      if (isDev) {
        setTimeout(resolve, 1000);
      } else {
        wx.ready(resolve);
        wx.error(reject);
      }
    })
      .then(() => {
        console.log('js-sdk 配置成功');
        ready && ready(wx);
        return wx;
      })
      .catch((err) => {
        console.error('js-sdk 配置失败');
        error && error(err);
        throw err;
      });
  }

  ready: Promise<wx>;

  addQuery(url: string, query: Record<string, string | number>) {
    let entries = Object.entries(query);
    if (!entries.length) return url;

    let urlObj = new URL(url);
    let params = urlObj.searchParams;

    entries.forEach(([k, v]) => {
      if (v !== undefined) params.set(k, `${v}`);
    });

    return urlObj.toString();
  }

  share(option: ShareOption = {}) {
    if (!OPTION.canShare) return;

    this.ready.then(() => {
      let { props } = this;

      let userAgentObj = new String(window.navigator.userAgent).toLowerCase();
      let isShowLog = !userAgentObj.includes('wechatdevtools');

      let shareData = {
        link: option.link || props.link || window.location.href,
        query: {
          ...props.query,
          ...option.query,
        },

        title: option.title || props.title,
        desc: option.desc || props.desc,
        imgUrl: option.imgUrl || props.imgUrl,
        fail(err) {
          if (isShowLog) console.error(err.errMsg);
        },
      };

      shareData.link = this.addQuery(shareData.link, shareData.query);

      console.log('-------------------');
      console.log('--- js-sdk 分享 ---', isShowLog ? shareData : '');
      console.log('-------------------');

      wx.onMenuShareAppMessage(shareData);
      wx.updateAppMessageShareData(shareData);
      wx.updateTimelineShareData(shareData);
    });
  }

  /**H5传参数到小程序 */
  postMessage(data: Record<string, any>) {
    this.ready.then(() => {
      let mp = wx.miniProgram;
      mp.postMessage({ data });
    });
  }
}
