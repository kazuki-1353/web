const config = {
  projectName: 'my-taro',
  date: '2020-6-1',

  /* 因 Taro.pxTransform 异常而特殊处理 */
  designWidth: process.env.TARO_ENV === 'h5' ? 640 : 750,
  deviceRatio: {
    640: process.env.TARO_ENV === 'h5' ? 1 : 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },

  sourceRoot: 'src',
  outputRoot: `dist/${process.env.TARO_ENV}`,

  plugins: [],

  /**全局变量设置 */
  defineConstants: {},

  copy: {
    patterns: [
      {
        from: 'src/static',
        to: `dist/${process.env.TARO_ENV}/static`,
      },
    ],
    options: {},
  },
  framework: 'react',
  compiler: 'webpack5',
  cache: {
    enable: false, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },

  mini: {
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: ['last 3 versions', 'Android >= 4.1', 'ios >= 8'],
        },
      },
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
    optimizeMainPackage: {
      enable: true,
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },

    router: {
      mode: 'browser',
    },
  },

  rn: {
    appName: 'taroDemo',
    output: {
      ios: './ios/main.jsbundle',
      iosAssetsDest: './ios',
      android: './android/app/src/main/assets/index.android.bundle',
      androidAssetsDest: './android/app/src/main/res',
      // iosSourceMapUrl: '',
      iosSourcemapOutput: './ios/main.map',
      // iosSourcemapSourcesRoot: '',
      // androidSourceMapUrl: '',
      androidSourcemapOutput: './android/app/src/main/assets/index.android.map',
      // androidSourcemapSourcesRoot: '',
    },
    postcss: {
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
};
switch (process.env.TARO_ENV) {
  case 'weapp':
    config.copy.patterns.push({
      from: 'src/sitemap.json',
      to: `dist/${process.env.TARO_ENV}/sitemap.json`,
    });
    break;

  default:
    break;
}

module.exports = function(merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
};
