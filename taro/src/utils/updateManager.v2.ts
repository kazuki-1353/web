/*

import updateManager from './utils/updateManager.v2';

updateManager.update();
updateManager.hasUpdate();
updateManager.onUpdate();

*/

import Taro from '@tarojs/taro';

/**显示更新模态框 */
const showModal: typeof Taro.showModal = (opt = {}) => {
  let { title, content, success, fail } = opt;

  return new Promise((resolve, reject) => {
    Taro.showModal({
      title,
      content,
      success(res) {
        success?.(res);

        if (res.confirm) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail(err) {
        fail?.(err);
        reject(err);
      },
    });
  });
};

let UpdateManager = class {
  constructor() {
    if (Taro.getUpdateManager) this.manager = Taro.getUpdateManager();
  }

  manager: Taro.UpdateManager | null = null;

  update(
    opt: {
      showModal?: boolean;
      beforeUpdate?: () => void;
    } = {},
  ) {
    return this.hasUpdate().then((hasUpdate) => {
      if (!hasUpdate) return Promise.resolve();

      return this.onUpdate()
        .then(() => {
          // 是否需要用户同意
          if (opt.showModal) {
            return showModal({
              title: '更新提示',
              content: '新版本已准备好，是否重启小程序？',
            });
          }
        })
        .then(() => {
          opt.beforeUpdate?.();
          this.manager?.applyUpdate();
        });
    });
  }

  /**获取是否有新的版本 */
  hasUpdate() {
    return new Promise<boolean>((resolve, reject) => {
      if (this.manager) {
        this.manager.onCheckForUpdate((res) => {
          res.hasUpdate ? resolve(true) : resolve(false);
        });
      } else {
        reject('非小程序无需获取新版本');
      }
    }).catch(console.log);
  }

  /**监听新版本下载结果 */
  onUpdate() {
    return new Promise((resolve, reject) => {
      if (this.manager) {
        // 下载成功
        this.manager.onUpdateReady(resolve);

        // 下载失败
        this.manager.onUpdateFailed(reject);
      } else {
        reject();
      }
    });
  }
};

export default new UpdateManager();
