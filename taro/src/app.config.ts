import Taro from '@tarojs/taro';

const opt: Taro.Config = {
  // window: {
  //   navigationBarTitleText: '',
  //   navigationBarTextStyle: 'black',
  //   navigationBarBackgroundColor: '#fff',
  //   navigationStyle: 'custom',
  // },

  pages: ['pages/index/index'],

  // tabBar: {
  //   color: '#6F6F6F',
  //   selectedColor: '#000000',
  //   backgroundColor: '#ffffff',
  //   borderStyle: 'white',

  //   custom: true,
  //   list: [
  //     {
  //       text: '',
  //       pagePath: 'pages/index/index',
  //       iconPath: '',
  //       selectedIconPath: '',
  //     },
  //   ],
  // },

  // subPackages: [
  //   {
  //     root: 'subPackages/other',
  //     name: 'other',
  //     pages: ['pages/webView/index'],
  //   },
  // ],

  // preloadRule: {
  //   'pages/index/index': {
  //     network: 'all',
  //     packages: [''],
  //   },
  // },
};

export default opt;
