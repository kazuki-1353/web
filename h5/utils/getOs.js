/**
 * @desc 获取操作系统类型
 * @return {String}
 */

export default () => {
  if (!window) return 'node';

  let { navigator } = window;
  let userAgent = navigator.userAgent.toLowerCase();
  let appVersion = navigator.appVersion.toLowerCase();

  switch (true) {
    case userAgent.includes('wechat'):
    case userAgent.includes('micromessenger'): {
      return 'wechat';
    }

    case userAgent.includes('android'): {
      return 'android';
    }

    case userAgent.includes('iphone'):
    case userAgent.includes('ipad'):
    case userAgent.includes('ipod'): {
      return 'ios';
    }

    case appVersion.includes('win'): {
      if (userAgent.includes('phone')) {
        return 'windowsPhone';
      } else {
        return 'windows';
      }
    }

    case appVersion.includes('mac'): {
      return 'MacOSX';
    }

    case appVersion.includes('linux'): {
      return 'linux';
    }

    default: {
      return userAgent;
    }
  }
};
