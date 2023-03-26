/*

import withLayout, { Layout } from '../../../components/withLayout';

interface Comp extends Layout {}

export default withLayout({
  footer: {},
})(Comp);

export default connect<StateProps, DispatchProps, OwnProps, any>((state) => {
  let { userInfoPDD } = state.api;
  return {
    userInfoPDD,
  };
})(
  withLayout({
    footer: {},
  })(Comp),
);

*/

import React, { CSSProperties, ComponentClass } from 'react';

import Taro from '@tarojs/taro';
import { View, ScrollView, Text } from '@tarojs/components';

import H5Header from './H5Header';
import H5Footer from './H5Footer';
import Tutorial from './Tutorial';

import config from '../config';
import store from '../store';
import wechat from '../wechat';
import { obj2query } from '../utils/navigate';
import { rpx2rem } from '../utils/getSystemInfo';

let css: {
  [key: string]: CSSProperties;
} = {
  wrap: {
    position: 'relative',
    zIndex: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    position: 'relative',
    zIndex: 0,
    overflow: process.env.TARO_ENV === 'rn' ? 'scroll' : 'auto',
    flexGrow: 1,
    height: process.env.TARO_ENV === 'rn' ? 300 : '100%',
  },
  footer: {
    flexShrink: 0,
  },
};

type Opt = {
  content?: {
    heightAuto?: boolean;
  };
  header?: {
    title: string;
    back?: boolean;
  };
  footer?: {};
};

export interface Layout {
  /**分享选项 */
  shareOption: {
    /**默认分享地址 */ path: string;
    /**默认分享标题 */ title: string;
    /**默认分享图片 */ imageUrl: string;
    /**默认分享地址参数 */ query: Record<string, any>;
  };

  /**设置分享选项 */
  setShareOption(shareOption: {
    /**分享地址 */ path?: string;
    /**分享标题 */ title?: string;
    /**分享标题 */ text?: string;
    /**分享图片 */ imageUrl?: string;
    /**分享图片 */ image?: string;
    /**分享地址参数 */ query?: Record<string, any>;
  }): void;
}

export default (opt: Opt) => {
  let { content, header, footer } = opt;
  let { title, back = false } = header || {};

  return (Wrap: ComponentClass) => {
    let HOC = class extends Wrap implements Layout {
      // constructor(props) {
      //   super(props);
      // }

      componentDidMount() {
        super.componentDidMount && super.componentDidMount();
        wechat.share();
      }

      shareOption = {
        path: '',
        title: config.projectName,
        imageUrl: '',
        query: {},
      };
      setShareOption = (shareOption) => {
        if (shareOption.path) this.shareOption.path = shareOption.path;

        if (shareOption.title) this.shareOption.title = shareOption.title;
        if (shareOption.text) this.shareOption.title = shareOption.text;

        if (shareOption.imageUrl)
          this.shareOption.imageUrl = shareOption.imageUrl;
        if (shareOption.image) this.shareOption.imageUrl = shareOption.image;

        if (shareOption.query) this.shareOption.query = shareOption.query;

        wechat.share({
          link: shareOption.path,
          desc: shareOption.title || shareOption.text,
          imgUrl: shareOption.imageUrl || shareOption.image,
          query: shareOption.query,
        });
      };
      onShareAppMessage = () => {
        let state = store.getState();
        let userInfo = state.api.userInfoPDD;

        let shareOption = { ...this.shareOption };
        if (shareOption.path) {
          let params = `pid=${userInfo.p_id}&customer_id=${userInfo.id}`;

          shareOption.path.includes('?')
            ? (shareOption.path += '&' + params)
            : (shareOption.path += '?' + params);
        } else {
          let current = Taro.getCurrentInstance();
          let { router } = current;
          if (router) {
            let query = obj2query({
              ...router.params,
              ...shareOption.query,
              pid: userInfo.p_id,
              customer_id: userInfo.id,
            });

            shareOption.path = router.path + query;
          } else {
            let query = obj2query({
              ...shareOption.query,
              pid: userInfo.p_id,
              customer_id: userInfo.id,
            });

            shareOption.path = `/pages/h5/index/index${query}`;
          }
        }

        console.log('分享参数', shareOption);
        return shareOption;
      };

      render() {
        return (
          <View
            style={{
              ...css.wrap,
              height: content?.heightAuto ? 'auto' : '100%',
            }}
          >
            {header && <H5Header back={back}>{title}</H5Header>}

            <View style={css.content}>{super.render()}</View>

            {footer && (
              <View style={css.footer}>
                <H5Footer />
              </View>
            )}

            <Tutorial />
          </View>
        );
      }
    };

    // HOC.displayName = `HOC(${Wrap.name})`; //设置 React Developer Tools 显示

    return HOC;
  };
};
