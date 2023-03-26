/*

import Placard from '../../components/Placard';
import { IConfig } from '../../components/Placard/taro-plugin-canvas/types';

this.setState(
  {
    config,
    showPlacard: true,
  },
);

<Placard
  config={config}
  show={showPlacard}
  onClose={this.onClosePlacard}
  onSuccess={this.onSuccessPlacard}
/>

*/

import React, { ComponentClass, PureComponent } from 'react';

import Taro from '@tarojs/taro';
import { View, Button, Image } from '@tarojs/components';

import TaroCanvasDrawer from './taro-plugin-canvas';
import { IConfig } from './taro-plugin-canvas/types';

import css from './index.module.scss';
import ShareWechat from './imgs/wechat.png';
import ShareDown from './imgs/down.png';
import ShareLink from './imgs/share.png';

type PageStateProps = {};
type PageDispatchProps = {};
type PageOwnProps = {
  /**是否显示 */ show: boolean;
  /**关闭事件 */ onClose: () => void;
  /**成功事件 */ onSuccess?: (url: string) => void;

  /**生成图片的参数 */ config?: IConfig;
  /**分享链接 */ link?: string;
};
interface Index {
  props: PageStateProps & PageDispatchProps & PageOwnProps;
}
class Index extends PureComponent<
  {},
  {
    shareImage: string;
    canvasStatus: boolean;
  }
> {
  // constructor(props) {
  //   super(props);
  // }

  state = {
    /**绘制的图片 */ shareImage: '',
    /**TaroCanvasDrawer 组件状态 */ canvasStatus: false,
  };

  shouldComponentUpdate(nextProps) {
    const { config: prevConfig } = this.props;
    const { config: nextConfig } = nextProps;
    if (!nextConfig?.width) return false;

    if (prevConfig === nextConfig) {
      /* 是否显示组件并绘制海报 */
      let isDraw = nextProps.show && !this.props.show;
      if (isDraw) this.canvasDrawFunc();
    } else {
      this.isSuccess = false;
      this.setState(
        {
          canvasStatus: false,
        },
        this.canvasDrawFunc,
      );
    }

    return true;
  }

  isSuccess = false;
  static options = {
    addGlobalClass: true,
  };

  /**调用绘画 */
  canvasDrawFunc = () => {
    if (this.isSuccess) {
      Taro.hideLoading();
    } else {
      Taro.showLoading({ title: '绘制中...' });
      this.setState({ canvasStatus: true }, () => {
        this.setTimeout();
      });
    }
  };

  /**超时 */
  timer: any = null;
  setTimeout = () => {
    if (this.timer !== null) return;

    this.timer = setTimeout(() => {
      this.onCreateFail('超时');
    }, 10000);
  };
  clearTimeout = () => {
    clearTimeout(this.timer);
    this.timer = null;
  };

  /**绘制成功回调函数 */
  onCreateSuccess = (result) => {
    const { errMsg, tempFilePath } = result;
    if (errMsg === 'canvasToTempFilePath:ok') {
      this.clearTimeout();

      this.setState({ shareImage: tempFilePath }, () => {
        this.isSuccess = true;

        const { onSuccess } = this.props;
        onSuccess && onSuccess(tempFilePath);

        Taro.hideLoading();
      });
    } else {
      this.onCreateFail(errMsg);
    }

    // 预览
    // Taro.previewImage({
    //   current: tempFilePath,
    //   urls: [tempFilePath]
    // })
  };

  /**绘制失败回调函数 */
  onCreateFail = (error) => {
    this.clearTimeout();

    console.error(error);

    this.isSuccess = false;
    this.setState({ canvasStatus: false }, () => {
      Taro.hideLoading();
      Taro.showModal({
        content: '生成图片失败',
        confirmText: '重试',
        success: ({ confirm }) => {
          if (confirm) this.canvasDrawFunc();
        },
      });
    });
  };

  /**阻止冒泡 */
  stopPropagation = (e) => {
    e.stopPropagation();
  };

  /**预览图片 */
  onPreview = (e) => {
    this.stopPropagation(e);

    const { shareImage } = this.state;
    Taro.previewImage({
      urls: [shareImage],
    });
  };

  /**保存相册 */
  saveToAlbum = () => {
    this.authorize('writePhotosAlbum').then(() => {
      Taro.saveImageToPhotosAlbum({
        filePath: this.state.shareImage,
        success: (res) => {
          if (res.errMsg === 'saveImageToPhotosAlbum:ok') {
            this.props.onClose();

            Taro.showToast({
              title: '保存图片成功',
              icon: 'success',
              duration: 2000,
            });
          }
        },
      });
    });
  };

  /** 判断是否拥有权限并处理 */
  authorize(key) {
    return new Promise((resolve, reject) => {
      // 获取设置
      Taro.getSetting({
        success({ authSetting }) {
          const scope = `scope.${key}`;
          const setting = authSetting[scope];

          switch (setting) {
            // 已授权
            case true:
              resolve(true);
              break;

            // 拒绝授权
            case false:
              // 调起客户端小程序设置界面
              Taro.openSetting({
                fail: reject,
              });
              break;

            // 未授权
            default:
              resolve(false);
              break;
          }
        },
      });
    });
  }

  /**复制链接 */
  copyLink = () => {
    const { link } = this.props;
    if (!link) return;

    Taro.setClipboardData({
      data: link,
      success() {
        console.log('已复制', link);
      },
      fail() {
        Taro.showToast({
          title: '该微信版本不支持此功能',
          icon: 'none',
        });
      },
    });
  };

  render() {
    const { canvasStatus, shareImage } = this.state;
    const { show, onClose, config = {} as IConfig, link } = this.props;

    return config.width ? (
      <View
        className={[css.wrap, show ? css.show : css.hide].join(' ')}
        catchMove
        onClick={onClose}
      >
        <View className={css.main}>
          <Image
            className={css.img}
            src={shareImage}
            mode='widthFix'
            onClick={this.onPreview}
          />

          {canvasStatus && (
            // 由于部分限制，目前组件通过状态的方式来动态加载
            <TaroCanvasDrawer
              config={config} // 绘制配置
              onCreateSuccess={this.onCreateSuccess} // 绘制成功回调
              onCreateFail={this.onCreateFail} // 绘制失败回调
            />
          )}
        </View>

        <View className={css.footer} onClick={this.stopPropagation}>
          <Button className={css.btn} openType='share'>
            <Image className={css.btn__icon} src={ShareWechat} />
            <View className={css.btn__text}>微信好友</View>
          </Button>

          {shareImage && (
            <Button className={css.btn} onClick={this.saveToAlbum}>
              <Image className={css.btn__icon} src={ShareDown} />
              <View className={css.btn__text}>保存相册</View>
            </Button>
          )}

          {link && (
            <Button className={css.btn} onClick={this.copyLink}>
              <Image className={css.btn__icon} src={ShareLink} />
              <View className={css.btn__text}>复制链接</View>
            </Button>
          )}
        </View>
      </View>
    ) : null;
  }
}

export default Index as ComponentClass<PageOwnProps>;
