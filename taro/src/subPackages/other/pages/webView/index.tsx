/*

let url = `/subPackages/other/pages/webView?src=${encodeURIComponent(src)}`;
let url = `/subPackages/other/pages/webView?src=${encodeURIComponent(src)}&image=${encodeURIComponent(image)}&title=${title}`;

Taro.navigateTo({ url });

*/

import React, { PureComponent } from 'react';
// import { connect } from 'react-redux';

import Taro from '@tarojs/taro';
import { WebView } from '@tarojs/components';

type StateProps = {};
type DispatchProps = {};
type OwnProps = {};
type OwnState = {
  src: string;
  imageUrl: string;
  title: string;
};

class Comp extends PureComponent<
  OwnProps & StateProps & DispatchProps,
  OwnState
> {
  state = {
    src: '',
    imageUrl: '',
    title: '',
  };

  onLoad(options) {
    console.log('页面参数', options);
    let { src, image, title } = options;
    if (src) {
      this.setState({
        src: decodeURIComponent(src),
        imageUrl: image || '',
        title: title || '',
      });
    }

    if (title) {
      Taro.setNavigationBarTitle({ title });
    }
  }

  onShareAppMessage(e) {
    let { webViewUrl } = e;
    let src = encodeURIComponent(webViewUrl);
    let path = `/Other/pages/webView/index?src=${src}`;
    console.log('分享地址', path);

    let { imageUrl, title } = this.state;

    return {
      path,
      imageUrl,
      title,
    };
  }

  render() {
    let { src } = this.state;
    if (!src) return null;

    return <WebView src={src} />;
  }
}

export default Comp;
// export default connect<StateProps, DispatchProps, OwnProps, any>(
//   (state) => ({}),
// )(Comp);
