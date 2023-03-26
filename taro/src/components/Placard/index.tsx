import React, { ComponentClass, PureComponent } from 'react';

import Taro from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';

import TaroCanvasDrawer from './taro-plugin-canvas';
import { IConfig } from './taro-plugin-canvas/types';
export { IConfig } from './taro-plugin-canvas/types';

import system from '../../utils/system';

import css from './index.module.scss';
import ShareWechat from '../../img/wechat.png';
import ShareDown from '../../img/down.png';
import ShareLink from '../../img/shareLink.png';

/** rpx转换rem */
export const rpx2rem = (rpx: number | string, design = 750): string => {
  let num = Number(rpx);
  if (Number.isNaN(num)) {
    return `${rpx}`;
  } else {
    return Taro.pxTransform(num, design);
  }
};

type PageStateProps = {};
type PageDispatchProps = {};
type PageOwnProps = {
  /**是否隐藏 */ isHide: boolean;
  /**隐藏事件 */ onHide: () => void;
  /**成功事件 */ onSuccess?: (src: string) => void;

  /**生成图片的参数 */ config?: IConfig;
  /**分享链接 */ link?: string;

  /**定位 */ bottom?: string | number;
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
    const { config: nextConfig } = nextProps;
    const nextText = nextConfig?.texts?.[0]?.text;
    if (!nextText) return false;

    const { config: prevConfig } = this.props;
    const prevText = prevConfig?.texts?.[0]?.text;
    if (!prevText) return false;

    /* 更新海报 */
    if (nextText !== prevText) {
      this.isSuccess = false;
      setTimeout(() => {
        this.setState({
          canvasStatus: false,
        });
      });
    }

    /* 是否显示组件并绘制海报 */
    let isDraw = nextProps.isHide === false && this.props.isHide === true;
    if (isDraw) this.canvasDrawFunc();

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

  /**保存相册 */
  saveToAlbum = () => {
    system.authorize('writePhotosAlbum', this.state.shareImage).then(() => {
      this.props.onHide();
    });
  };

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
    const {
      isHide,
      onHide,
      config = {} as IConfig,
      link,
      bottom = 0,
    } = this.props;

    return config.width ? (
      <View
        className={[css.wrap, isHide ? '' : css.show].join(' ')}
        style={{ bottom: rpx2rem(bottom) }}
        onClick={onHide}
      >
        <View className={css.postersBox}>
          <Image className={css.postersImg} src={shareImage} mode='widthFix' />

          {// 由于部分限制，目前组件通过状态的方式来动态加载
          canvasStatus && (
            <TaroCanvasDrawer
              // 绘制配置
              config={config}
              onCreateSuccess={this.onCreateSuccess} // 绘制成功回调
              onCreateFail={this.onCreateFail} // 绘制失败回调
            />
          )}
        </View>

        <View className={css.dialog} onClick={(e) => e.stopPropagation()}>
          <View className={css.shareBtns}>
            <Button className={css.shareBtn + ' reset'} openType='share'>
              <Image className={css.shareIcon} src={ShareWechat} />
              <View>
                <Text>微信好友</Text>
              </View>
            </Button>

            {shareImage && (
              <Button
                className={css.shareBtn + ' reset'}
                onClick={this.saveToAlbum}
              >
                <Image className={css.shareIcon} src={ShareDown} />
                <View>
                  <Text>保存相册</Text>
                </View>
              </Button>
            )}

            {link && (
              <Button
                className={css.shareBtn + ' reset'}
                onClick={this.copyLink}
              >
                <Image className={css.shareIcon} src={ShareLink} />
                <View>
                  <Text>复制链接</Text>
                </View>
              </Button>
            )}
          </View>
        </View>
      </View>
    ) : null;
  }
}

export default Index as ComponentClass<PageOwnProps>;
