import React, { PureComponent } from 'react';

import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

import css from './index.module.scss';

type Data = [string, string[]];

class Comp extends PureComponent {
  state = {
    systemInfo: ['', []] as Data,
    storageInfo: ['', []] as Data,
    ECMAScript: ['', []] as Data,
    others: ['', []] as Data,
  };

  componentDidMount() {
    this.getSystemInfo();
    this.getStorageInfo();
    this.ECMAScript();
    this.others();
  }

  /**获取系统信息 */
  getSystemInfo() {
    Taro.getSystemInfo({
      success: (info) => {
        let systemInfo = [
          '系统信息',

          ['手机品牌', info.brand],
          ['手机型号', info.model],
          ['设备像素比', info.pixelRatio],
          ['屏幕宽度', info.screenWidth],
          ['屏幕高度', info.screenHeight],
          ['可使用窗口宽度', info.windowWidth],
          ['可使用窗口高度', info.windowHeight],
          ['状态栏的高度', info.statusBarHeight],

          [],

          ['客户端平台', info.platform],
          ['操作系统版本', info.system],
          ['客户端基础库版本', info.SDKVersion],
          ['微信版本号', info.version],
          ['微信设置的语言', info.language],
          ['系统当前主题', info.theme],
          ['用户字体大小设置', info.fontSizeSetting],

          [],

          ['WiFi的系统开关', info.wifiEnabled],
          ['蓝牙的系统开关', info.bluetoothEnabled],
          ['地理位置的系统开关', info.locationEnabled],
          ['定位的开关', info.locationAuthorized],
          ['摄像头的开关', info.cameraAuthorized],
          ['麦克风的开关', info.microphoneAuthorized],
          ['微信通知的开关', info.notificationAuthorized],
        ];

        /* 安全区域 */
        let { safeArea } = info;
        if (safeArea) {
          systemInfo.push(
            [],
            ['安全区域左上角X', safeArea.left],
            ['安全区域左上角Y', safeArea.top],
            ['安全区域右下角X', safeArea.right],
            ['安全区域右下角Y', safeArea.bottom],
            ['安全区域的宽度', safeArea.width],
            ['安全区域的高度', safeArea.height],
          );
        }

        /* 右上角胶囊按钮 */
        if ('getMenuButtonBoundingClientRect' in Taro) {
          let menuButtonBoundingClientRect = Taro.getMenuButtonBoundingClientRect();
          systemInfo.push(
            [],
            ['胶囊按钮左上角X', menuButtonBoundingClientRect.left],
            ['胶囊按钮左上角Y', menuButtonBoundingClientRect.top],
            ['胶囊按钮右下角X', menuButtonBoundingClientRect.right],
            ['胶囊按钮右下角Y', menuButtonBoundingClientRect.bottom],
            ['胶囊按钮的宽度', menuButtonBoundingClientRect.width],
            ['胶囊按钮的高度', menuButtonBoundingClientRect.height],
          );
        }

        this.setState({
          systemInfo,
        });
      },
    });
  }

  /**获取本地缓存 */
  getStorageInfo() {
    Taro.getStorageInfo({
      success: (res) => {
        let proms = res.keys.map((key) => {
          return new Promise<string[]>((resolve, reject) => {
            Taro.getStorage({
              key,
            })
              .then(({ data }) => resolve([key, data]))
              .catch(() => resolve([]));
          });
        });

        Promise.all(proms).then((data) => {
          let storageInfo = [
            '本地缓存',

            ['当前占用的空间大小', res.currentSize],
            ['限制的空间大小', res.limitSize],
          ];

          if (data.length) storageInfo.push([], ...data);

          this.setState({
            storageInfo,
          });
        });
      },
    });
  }

  /**ECMA */
  ECMAScript() {
    let ECMAScript = [
      'ECMA',

      ['es2015.Number', `${!!Number.isNaN}`],
      ['es2015.Math', `${!!Math.log2}`],
      ['es2015.RegExp', `${!!typeof RegExp.prototype.flags}`],
      ['es2015.String', `${!!String.raw}`],
      ['es2015.Array', `${!!Array.from}`],
      ['es2015.Object', `${!!Object.assign}`],
      ['es2015.Function', `${!!Function.name}`],
      ['es2015.Symbol', `${!!global.Symbol}`],
      ['es2015.Map', `${!!global.Map}`],
      ['es2015.Set', `${!!global.Set}`],
      ['es2015.Proxy', `${!!global.Proxy}`],
      ['es2015.Reflect', `${!!global.Reflect}`],
      ['es2015.Promise', `${!!global.Promise}`],

      [],

      ['es2016.Array', `${!!Array.prototype.includes}`],

      [],

      ['es2017.String', `${!!String.prototype.padEnd}`],
      ['es2017.Object', `${!!Object.entries}`],
      ['es2017.Atomics', `${!!global.Atomics}`],
      ['es2017.Intl', `${!!global.Intl}`],

      [],

      ['es2018.Promise', `${!!global.Promise?.prototype?.finally}`],

      [],

      ['es2019.String', `${!!String.prototype.trimEnd}`],
      ['es2019.Array', `${!!Array.prototype.flat}`],
      ['es2019.Object', `${!!Object.fromEntries}`],
      ['es2019.Symbol', `${!!typeof global.Symbol?.('')?.description}`],

      [],

      ['es2020.String', `${!!String.prototype.matchAll}`],
      ['es2020.Promise', `${!!global.Promise?.allSettled}`],
      ['es2020.BigInt', `${!!global.BigInt}`],
    ];

    this.setState({
      ECMAScript,
    });
  }

  others() {
    // this.setState({
    //   others: ['', ['']],
    // });
  }

  ItemVal = (v, k?) => {
    switch (true) {
      case v === undefined:
      case v === null: {
        return null;
      }

      case Array.isArray(v): {
        return (
          <View className={css.list}>
            {v.map((item, index) => (
              <View className={css.item} key={index}>
                {k ?? index}:{item}
              </View>
            ))}
          </View>
        );
      }

      case typeof v === 'object': {
        return Object.keys(v).map((key) => this.ItemVal(v[key], key));
      }

      default: {
        return v;
      }
    }
  };
  Item = (item, index) => {
    switch (true) {
      case item === undefined: {
        return null;
      }

      case typeof item === 'string': {
        return (
          <View className={css.header} key={index}>
            {item}
          </View>
        );
      }

      default: {
        let [k, v] = item;

        return (
          <View className={css.row} key={index}>
            <View className={`${css.cell} ${css.key}`}>{k}</View>
            <View className={`${css.cell} ${css.val}`}>{this.ItemVal(v)}</View>
          </View>
        );
      }
    }
  };

  render() {
    let { systemInfo, storageInfo, ECMAScript, others } = this.state;

    return (
      <View className={css.wrap}>
        <View className={css.table}>{systemInfo.map(this.Item)}</View>
        <View className={css.table}>{storageInfo.map(this.Item)}</View>
        <View className={css.table}>{ECMAScript.map(this.Item)}</View>
        <View className={css.table}>{others.map(this.Item)}</View>
      </View>
    );
  }
}

export default Comp;
