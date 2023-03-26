/*

import RichText from '../../components/RichText.v2';

<RichText html={} />

// 标准化
normalize

*/

import React, { CSSProperties, memo, useMemo } from 'react';

import Taro, { FC } from '@tarojs/taro';
import { Block, View, RichText } from '@tarojs/components';

const Comp: FC<{
  html: string;
  /**标准化 */ normalize?: boolean;
}> = (props) => {
  let { html, normalize } = props;

  let css = useMemo<Record<string, CSSProperties>>(() => {
    return {
      wrap: {
        width: '100%',
        height: '100%',
      },
    };
  }, []);

  let __html = useMemo(() => {
    if (!html) return '';

    if (normalize) {
      return html.replace(/(<img)(.*?)(\/?>)/gi, (match, g1, g2, g3) => {
        let style = 'width:100%;vertical-align:middle;';
        return `${g1}${g2} style="${style}" ${g3}`;
      });
    } else {
      return html;
    }
  }, [html, normalize]);

  if (!html) return null;
  return <RichText style={css.wrap} nodes={__html} />;

  // return process.env.TARO_ENV === 'weapp' ? (
  //   <RichText style={css.wrap} nodes={__html} />
  // ) : (
  //   <View style={css.wrap} dangerouslySetInnerHTML={{ __html }} />
  // );
};

export default memo(Comp);
