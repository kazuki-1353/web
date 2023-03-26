import { defineConfig } from 'umi';
import pxToViewPort from 'postcss-px-to-viewport';
// import pxtorem from 'postcss-pxtorem';

/* 禁止使用完整路径, 避免 connect 失效 */
let base = process.env.NODE_ENV === 'development' ? '/' : '/';

export default defineConfig({
  base,
  publicPath: base,

  hash: true,
  nodeModulesTransform: {
    type: 'none',
  },
  // routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},

  proxy: {
    '/api': {
      target: '/',
      changeOrigin: true,
    },
  },

  dva: {
    immer: true,
    hmr: false,
  },

  sass: {},

  // postcssLoader: {},
  extraPostCSSPlugins: [
    pxToViewPort({
      viewportWidth: 750,
      propList: ['*'],
      mediaQuery: true,
      exclude: /node_modules/,
    }),

    // pxtorem({
    //   rootValue: 16 * 2,
    //   propList: ['*'],
    // }),
  ],

  chainWebpack(config) {
    /* 把 css 打包成一个文件 */
    config.optimization.splitChunks({
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(css|less|scss)$/,
          chunks: 'async',
          minChunks: 1,
          minSize: 0,
        },
      },
    });
  },
});
