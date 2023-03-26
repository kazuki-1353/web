/*

import NavBar from '../../components/NavBar.v2';

<NavBar></NavBar>

fixed //固定定位到顶部
back //后退图标
home='' //首页地址

style={{
  height: 0,//固定定位时不占位
  color: '',//图标颜色
  background: '',//背景颜色
}}



import NavBar, { getNavBarSize } from '../../components/NavBar.v2';

type NavBarSize = ReturnType<typeof getNavBarSize>;
let navBarSize: NavBarSize = getNavBarSize();

style={{
  top: navBarSize.height + 'px',
}}

*/

import React, {
  CSSProperties,
  memo,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

import Taro, { FC } from '@tarojs/taro';
import { Block, View } from '@tarojs/components';

let navBarSize: {
  /**导航栏顶部 */ navBarTop: number;
  /**导航栏底部 */ navBarBottom: number;
  /**导航栏宽度 */ navBarWidth: number;
  /**导航栏高度 */ navBarHeight: number;

  /**菜单高度 */ menuHeight: number;
  /**菜单宽度两边 */ menuWidthBetween: number;
  /**菜单宽度中间 */ menuWidthCentre: number;

  /**整体高度 */ height: number;
};

/** 获取导航栏相关尺寸 */
export const getNavBarSize = () => {
  if (navBarSize) return navBarSize;

  let info = Taro.getSystemInfoSync();
  navBarSize = {
    navBarTop: info.statusBarHeight || 0,
    navBarBottom: 6,
    navBarWidth: info.screenWidth,
    navBarHeight: 44,

    menuHeight: 44,
    menuWidthBetween: 0,
    menuWidthCentre: 0,

    height: 50,
  };

  /* 是否为小程序 */
  if ('getMenuButtonBoundingClientRect' in Taro) {
    let rect = Taro.getMenuButtonBoundingClientRect();

    /**菜单按钮与状态栏的间距 */
    let marginTop = rect.top - navBarSize.navBarTop;

    /**菜单按钮与右边界的间距 */
    let marginRight = info.screenWidth - rect.right;

    navBarSize.navBarWidth = rect.left - marginRight * 2;
    navBarSize.navBarHeight = rect.bottom + marginTop;

    navBarSize.menuHeight = navBarSize.navBarHeight - navBarSize.navBarTop;
    navBarSize.menuWidthBetween = rect.width + marginRight * 2;
    navBarSize.menuWidthCentre =
      info.screenWidth - navBarSize.menuWidthBetween * 2;

    navBarSize.height = navBarSize.navBarHeight + navBarSize.navBarBottom;
  }

  return navBarSize;
};

export const rpx2rem = (rpx: number) => Taro.pxTransform(rpx, 750);

type Props = {
  children?: React.ReactChild | React.ReactChild[];

  /**类型 */ type?: 'normal' | 'title';
  /**固定定位 */ fixed?: boolean;
  /**样式 */ style?: CSSProperties;

  /**后退图标 */ back?: boolean;
  /**后退图标样式 */ backStyle?: CSSProperties;
  /**首页地址 */ home?: string;
};
let Comp: FC<Props> = (props) => {
  let {
    children,
    type = 'normal',
    fixed = false,
    style,

    back = false,
    backStyle,
    home,
  } = props;

  /**是否只有一页 */
  let isSingle = useMemo(() => {
    let currentPages = Taro.getCurrentPages();
    return currentPages.length === 1;
  }, []);

  /**导航栏尺寸 */
  let size = useMemo(getNavBarSize, []);

  let css = useMemo(() => {
    let center: CSSProperties = {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    };

    return {
      wrap: {
        height: size.height + 'px',
        ...style,
      },

      main: {
        position: fixed ? 'fixed' : 'relative',
        zIndex: 99,
        top: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        boxSizing: 'content-box',
        paddingBottom: size.navBarBottom + 'px' /* 额外增加底部高度 */,
        height: size.navBarHeight + 'px',
        background: 'inherit',
        ...center,
      },

      menu: {
        position: 'relative',
        marginTop: 'auto',
        width: '100%',
        height: size.menuHeight + 'px',
      },
      content: {
        marginLeft: 'auto',
        marginRight: size.menuWidthBetween + 'px',
        width: size.navBarWidth + 'px',
        height: '100%',
        ...center,
      },

      icon: {
        flex: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 0,
        marginRight: 0,
        width: size.menuHeight - 6 + 'px',
        height: size.menuHeight - 6 + 'px',
        borderRadius: '50%',
        fontSize: rpx2rem(40),
        color: '#000',
        background: '#fff',
        opacity: 0.8,
        cursor: 'pointer',
        ...backStyle,
      },

      home: {
        position: 'relative',
        overflow: 'hidden',
        width: '1em',
        height: '1em',
      },
      home__before: {
        position: 'absolute',
        top: 0,
        left: 0,
        boxSizing: 'content-box',
        borderWidth: '0.5em',
        borderStyle: 'solid',
        borderColor: 'transparent',
        borderTop: 0,
        borderBottomColor: 'currentColor',
      },
      home__after: {
        position: 'absolute',
        top: '0.45em',
        left: '0.15em',
        boxSizing: 'content-box',
        width: '0.3em',
        height: '0.3em',
        borderWidth: '0.2em',
        borderStyle: 'solid',
        borderColor: 'currentColor',
        borderTopWidth: '0.25em',
        borderBottom: 0,
      },

      back: {
        position: 'relative',
        overflow: 'hidden',
        width: '0.625em',
        height: '1em',
      },
      back__before: {
        position: 'absolute',
        top: '0.175em',
        left: '0.175em',
        boxSizing: 'content-box',
        width: '0.5em',
        height: '0.5em',
        borderWidth: '0.125em',
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderStyle: 'solid',
        borderColor: 'currentColor',
        transform: 'rotate(-45deg)',
      },

      normal: {
        flex: 1,
        height: '100%',
        ...center,
      },

      title: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,

        overflow: 'hidden',
        margin: 'auto',
        width: size.menuWidthCentre + 'px',
        lineHeight: size.menuHeight + 'px',

        textAlign: 'center',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
      },
    } as {
      [key: string]: CSSProperties;
    };
  }, [fixed, style, backStyle, size]);

  /**返回首页 */
  let goHome = useCallback(() => {
    new Promise<string>((resolve) => {
      if (home) {
        resolve(home);
      } else {
        let config = import('../app.config');
        config.then((res) => {
          let { pages } = res.default || res;
          let page = pages?.[0];
          resolve(`/${page}`);
        });
      }
    }).then((url) => {
      Taro.redirectTo({ url }).catch(() => Taro.switchTab({ url }));
    });
  }, [home]);

  /**返回上一页 */
  let goBack = useCallback(() => Taro.navigateBack(), []);

  return (
    <View style={css.wrap}>
      <View style={css.main}>
        <View style={css.menu}>
          <View style={css.content}>
            {back && (
              <View style={css.icon} onClick={isSingle ? goHome : goBack}>
                {isSingle ? (
                  <View style={css.home}>
                    <View style={css.home__before} />
                    <View style={css.home__after} />
                  </View>
                ) : (
                  <View style={css.back} onClick={goBack}>
                    <View style={css.back__before} />
                  </View>
                )}
              </View>
            )}

            {type === 'normal' && <View style={css.normal}>{children}</View>}
          </View>

          {type === 'title' && <View style={css.title}>{children}</View>}
        </View>
      </View>
    </View>
  );
};

export default memo<Props>(
  process.env.TARO_ENV === 'weapp' ? Comp : () => null,
);
