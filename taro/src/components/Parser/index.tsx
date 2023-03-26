/*

在页面里配置
index.config.ts
usingComponents: {
  parser: '../../../components/Parser/parser/parser',
},

*/

import React, { ComponentClass, CSSProperties, PureComponent } from 'react';

import { View } from '@tarojs/components';

import css from './index.module.scss';

interface Props {
  /**
   * 富文本数据，可以是 HTML 字符串、节点对象、节点数组
   *
   * @default []
   */
  html: string | object | object[];

  /**
   * 标签的默认样式
   *
   * @default {}
   */
  tagStyle?: object;

  /**
   * 图片加载完成前的占位图
   *
   * @default ''
   */
  loadingImg?: string;

  /**
   * 是否使用图片懒加载
   *
   * @default false
   */
  lazyLoad?: boolean;

  /**
   * 是否允许播放视频时自动暂停其他视频
   *
   * @default true
   */
  autopause?: boolean;

  /**
   * 是否自动将`<title>`标签的内容设置到页面标题上
   *
   * @default true
   */
  autosetTitle?: boolean;

  /**
   * 是否允许长按复制内容
   *
   * @default false
   */
  selectable?: boolean;

  /**
   * 是否使用页面内锚点
   *
   * @default false
   */
  useAnchor?: boolean;

  /**
   * 是否使用缓存
   *
   * @default false
   */
  useCache?: boolean;

  /**
   * 是否使用渐显动画
   *
   * @default false
   */
  showWithAnimation?: boolean;

  /**dom 加载完成时触发 */
  onLoad?: (e) => void;

  /**出错时触发 */
  onError?: (e) => void;

  /**图片被点击时触发 */
  onImgtap?: (e) => void;

  /**链接被点击时触发 */
  onLinkpress?: (e) => void;
}

/**
 * ParserRichText 富文本组件
 */
class ParserRichText extends PureComponent<Props> {
  refContainer = React.createRef();

  public render() {
    const {
      html = '',
      tagStyle = {},

      loadingImg = '',
      lazyLoad = false,
      autopause = true,
      autosetTitle = true,
      selectable = false,
      useAnchor = false,
      useCache = false,
      showWithAnimation = false,

      onLoad = () => {},
      onError = () => {},
      onImgtap = () => {},
      onLinkpress = () => {},

      children,
    } = this.props;

    if (!html) return null;

    return process.env.TARO_ENV === 'weapp' ? (
      <View className={css.wrap}>
        <parser
          html={html}
          tagStyle={{
            img: 'vertical-align:middle;',
            ...tagStyle,
          }}
          autopause={autopause}
          autosetTitle={autosetTitle}
          selectable={selectable}
          lazyLoad={lazyLoad}
          loadingImg={loadingImg}
          useAnchor={useAnchor}
          useCache={useCache}
          showWithAnimation={showWithAnimation}
          ref={this.refContainer}
          onLoad={onLoad}
          onError={onError}
          onImgtap={onImgtap}
          onLinkpress={onLinkpress}
        >
          {children}
        </parser>
      </View>
    ) : (
      <View className={css.wrap} dangerouslySetInnerHTML={{ __html: html }} />
    );
  }
}

export default ParserRichText as ComponentClass<Props>;
