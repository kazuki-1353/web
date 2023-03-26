import React, { CSSProperties, memo } from 'react';
import Taro, { FC } from '@tarojs/taro';
import { View, Block } from '@tarojs/components';

let rpx2rem = (rpx, design = 750) => Taro.pxTransform(rpx, design);

let css: {
  [key: string]: CSSProperties;
} = {
  mask: {
    position: 'fixed',
    zIndex: 1000,
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,

    background: 'rgba(0, 0, 0, .6)',
    transition: 'all 0.2s ease-in',
  },

  dialog: {
    position: 'fixed',
    zIndex: 5000,
    top: '50%',
    left: rpx2rem(32),
    right: rpx2rem(32),

    opacity: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',

    margin: '0 auto',
    width: rpx2rem(640),
    maxHeight: '90%',
    borderRadius: rpx2rem(24),
    textAlign: 'center',

    background: '#fff',
    transform: 'scale3d(1, 1, 1) translateY(-50%)',
    transition: 'all 0.2s ease-in',
  },

  dialogHeader: {
    padding: `${rpx2rem(64)} ${rpx2rem(48)} ${rpx2rem(32)}`,
  },

  dialogTitle: {
    lineHeight: 1.4,
    fontSize: 17,
    fontWeight: 700,
  },

  dialogBody: {
    overflowY: 'auto',
    marginBottom: rpx2rem(64),
    padding: `0 ${rpx2rem(48)}`,
    lineHeight: 1.4,

    wordWrap: 'break-word',
    hyphens: 'auto',
    fontSize: 17,
    color: 'rgba(0, 0, 0, .5)',
  },

  dialogFooter: {
    position: 'relative',
    display: 'flex',
    minHeight: rpx2rem(112),
    lineHeight: rpx2rem(112),
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    borderRight: '1px solid rgba(0, 0, 0, 0.1)',
    fontSize: 17,
  },

  dialogBtn: {
    position: 'relative',
    flex: 1,
    display: 'block',
    borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
    fontWeight: 700,
    textDecoration: 'none',
    color: 'rgba(0, 0, 0, .9)',
  },

  primary: {
    color: 'rgb(87, 107, 149)',
  },
};

const Comp: FC<{
  /**是否开启弹窗 */ show: boolean;
  onClose: () => void;
  onConfirm?: () => boolean | void;

  /**弹窗标题 */ title?: string;
  /**是否需要遮罩层 */ mask?: boolean;
  /**弹窗能否关闭 */ maskClosable?: boolean;
  /**是否显示取消按钮 */ showCancel?: boolean;

  /**确定按钮 */
  confirm?: {
    text: string;
    style?: CSSProperties;
  };

  /**自定按钮 */
  buttons?: {
    text: string;
    style?: CSSProperties;
    onClick?: () => boolean | void;
  }[];

  footer?: JSX.Element;
}> = (props) => {
  let onMaskClose = () => {
    if (!props.maskClosable) return;
    props.onClose();
  };

  let onConfirm = () => {
    let stop = props.onConfirm?.();
    if (!stop) props.onClose();
  };

  let onClick = (i) => {
    let stop = i.onClick?.();
    if (!stop) props.onClose();
  };

  let { show, title, mask = true, confirm, showCancel } = props;

  return (
    <Block>
      {mask && <View onClick={onMaskClose} style={show ? css.mask : {}} />}

      {show && (
        <View style={css.wrap}>
          <View style={css.dialog}>
            {title && (
              <View style={css.dialogHeader}>
                <View style={css.dialogTitle}>{props.title}</View>
              </View>
            )}

            <View style={css.dialogBody}>{props.children}</View>

            <View style={css.dialogFooter}>
              {props.buttons?.map((v) => {
                return (
                  <View
                    style={{
                      ...css.dialogBtn,
                      ...v.style,
                    }}
                    key={v.text}
                    onClick={onClick.bind(null, v)}
                  >
                    {v.text}
                  </View>
                );
              })}

              {showCancel && (
                <View style={css.dialogBtn} onClick={props.onClose}>
                  取消
                </View>
              )}

              <View
                style={{
                  ...css.dialogBtn,
                  ...css.primary,
                  ...confirm?.style,
                }}
                onClick={onConfirm}
              >
                {confirm?.text ?? '确定'}
              </View>

              {props.footer}
            </View>
          </View>
        </View>
      )}
    </Block>
  );
};

export default memo(Comp);
