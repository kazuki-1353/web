import Taro from '@tarojs/taro';

const tools = {
  /** 判断是否拥有权限并处理 */
  authorize(key, val) {
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
    }).then(() => {
      return this.hasAuthorize(key, val);
    });
  },

  /** 根据权限分配API */
  hasAuthorize(key, val) {
    return new Promise((resolve, reject) => {
      switch (key) {
        /* 通讯地址 */
        case 'address':
          Taro.chooseAddress({
            success: resolve,
            fail: reject,
          });
          break;

        /* 保存图片 */
        case 'writePhotosAlbum':
          Taro.saveImageToPhotosAlbum({
            filePath: val,
            success: (res) => {
              if (res.errMsg === 'saveImageToPhotosAlbum:ok') {
                Taro.showToast({
                  title: '保存图片成功',
                  icon: 'success',
                  duration: 2000,
                });
                resolve(null);
              } else {
                reject();
              }
            },
            fail: reject,
          });
          break;

        default:
          break;
      }
    });
  },

  /** 个人设置 */
  mySetting(id, set) {
    const setting = Taro.getStorageSync('setting') || {};
    if (id === undefined) return setting;
    if (set === undefined) return setting[id];

    setting[id] = set;
    Taro.setStorageSync('setting', setting);
    return set;
  },
  mySettingSwitch(e) {
    const { id } = e.currentTarget.dataset;
    const setting = Taro.getStorageSync('setting');
    setting[id] = !setting[id];
    Taro.setStorageSync('setting', setting);
    this.setData({ setting });
  },

  /** 本地存储
    let prom = system.storage('KEY');

    let prom = system.storage('KEY', (cb) => {
      cb('VAL');
    });

    let prom = system.storage('KEY', (cb) => {
      return PROM.then((res) => cb(res));
    });

    prom.then((val) => {});
   */
  storagePromise: {},
  storage<T>(
    key: string,
    set?: (fun: (data: T) => void) => void | Promise<void>,
  ): Promise<T> {
    // 是否短期内多次调用
    if (this.storagePromise[key]) {
      // 指定时间后清除标志
      setTimeout(() => {
        this.storagePromise[key] = null;
      }, 5000);

      return this.storagePromise[key];
    } else {
      // 设置标志
      const prom = new Promise<T>((resolve, reject) => {
        this.hasStorage(key)
          .then(() => {
            Taro.getStorage({
              key,
              success: ({ data }) => {
                // 有本地存储
                resolve(data);
              },
              fail: reject,
            });
          })
          .catch(() => {
            // console.error('缺失本地存储:', key);

            if (set) {
              // 进行本地存储
              let cbProm = set((data) => {
                Taro.setStorage({
                  key,
                  data,
                  success: () => {
                    resolve(data);
                  },
                });
              });

              if (!cbProm?.catch) return;
              cbProm.catch((err) => {
                // 发生错误时清除标志
                this.storagePromise[key] = null;
                reject(err);
              });
            } else {
              reject(new Error('缺失本地存储初始化函数'));
            }
          });
      });

      // 有回调函数时才进行缓存
      if (set) this.storagePromise[key] = prom;
      return prom;
    }
  },
  hasStorage(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      Taro.getStorageInfo({
        success: ({ keys }) => {
          const hasKey = keys.includes(key);
          if (hasKey) {
            resolve();
          } else {
            reject();
          }
        },
        fail: reject,
      });
    });
  },
  removeStorage(key: string) {
    return new Promise((resolve, reject) => {
      this.storagePromise[key] = null;

      Taro.removeStorage({
        key,
        success: resolve,
        fail: reject,
      });
    });
  },

  /** 获取登录凭证
    let code = system.getLoginCode();
    let code = system.getLoginCode(true); //不缓存
   */
  getLoginCode(isCache: boolean): Promise<string> {
    return new Promise((resolve) => {
      const login = (setLoginCode) => {
        Taro.login({
          success: ({ code }) => {
            setLoginCode(code);
          },
        });
      };

      // 是否使用缓存
      if (isCache) {
        // 获取登录凭证本地存储
        const prom = () => this.storage('LoginCode', login);

        // 检查登录凭证是否过期
        Taro.checkSession({
          success: () => {
            prom().then(resolve);
          },
          fail: () => {
            // 重置登录凭证
            this.removeStorage('LoginCode')
              .then(prom)
              .then(resolve);
          },
        });
      } else {
        login(resolve);
      }
    });
  },

  /** 根据环境获取凭证 */
  envTokenKey(request: Function) {
    return new Promise((resolve, reject) => {
      if (request) {
        if (process.env.TARO_ENV === 'h5') {
          let res = request();
          resolve(res);
        } else {
          // 获取登录凭证
          this.getLoginCode()
            // 请求后台登录接口
            .then((code) => {
              let res = request(code);
              resolve(res);
            });
        }
      } else {
        reject(new Error('缺失获取 token 方法'));
      }
    });
  },

  /** 获取登录凭证 */
  getTokenKey(request: Function): Promise<string> {
    return this.storage('TokenKey', (setTokenKey) => {
      return (
        this.envTokenKey(request)
          // 登录成功
          .then((token) => {
            if (!token) throw new Error('缺失token');

            // 保存登录凭证
            setTokenKey(token);

            // 保存登录时间
            this.storage('TokenTime', (setTokenTime) => {
              setTokenTime(Date.now());
            });
          })

          // 登录失败
          .catch((err) => {
            // console.error('登录失败');
            throw err;
          })
      );
    });
  },

  /** 获取登录时间 */
  getTokenTime(time: number): Promise<boolean> {
    return (
      this.storage('TokenTime')
        .then((res) => {
          /**判断登录态是否有效 */
          const differ = Date.now() < time + res;
          if (differ) {
            return Promise.resolve('登录态有效');
          } else {
            return this.delToken().then(() => '登录态失效');
          }
        })
        // 禁止删除, 给getToken成功回调用
        .catch(() => '第一次登录')
    );
  },

  /** 获取登录态
   * @param {function} request 登录方法, 记忆函数
   * @param {number} [time=604800000] 默认7天过期
   * @returns
   */
  /*
    system.getToken().then((token) => {});
    system.getToken((code) => login(code)).then((token) => {});
    system.getToken((code) => login(code), TIME).then((token) => {});
   */
  getToken(
    request?: (code: string) => string | Promise<string>,
    time = 604800000,
  ): Promise<string> {
    // 获取登录时间
    return this.getTokenTime(time).then((msg) => {
      // console.log(msg);

      // 获取登录态本地存储
      return this.getTokenKey(request);
    });
  },

  /** 删除登录态 */
  delToken(): Promise<void[]> {
    return Promise.all([
      this.removeStorage('TokenTime'), // 清除登录时间
      this.removeStorage('TokenKey'), // 清除登录态
    ]);
  },

  /** 获取data- */
  getDataset(e) {
    return {
      ...e.target.dataset,
      ...e.currentTarget.dataset,
    };
  },

  copy(data, duration = 1500) {
    return new Promise((resolve, reject) => {
      Taro.setClipboardData({
        data,
        success() {
          /* H5需手动弹出调试 */
          if (process.env.TARO_ENV === 'h5') {
            Taro.showToast({
              title: '内容已复制',
              icon: 'success',
              duration,
            });
          }

          setTimeout(() => {
            resolve(data);
          }, duration);
        },
        fail(err) {
          Taro.showToast({
            title: '请长按复制',
            icon: 'none',
            duration,
          });

          reject(err);
        },
      });
    });
  },
};

export default tools;
