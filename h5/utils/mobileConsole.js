/*

import mobileConsole from '../../utils/mobileConsole';

mobileConsole.init()
mobileConsole.onClick

<div onClick={mobileConsole.onClick}></div>
data-duration={}
data-clicks={}

*/

class MobileConsole {
  constructor() {
    if (!window?.localStorage?.['eruda-enable']) return;

    try {
      this.init();
    } catch {
      window.addEventListener('DOMContentLoaded', this.init);
    }
  }

  eruda = null;
  init = () => {
    if (this.eruda) {
      return this.eruda;
    } else {
      let eruda = require('eruda');
      eruda.init();
      window.localStorage['eruda-enable'] = 'true';

      this.eruda = eruda;
      return eruda;
    }
  };

  count = 0;
  onClick = (e) => {
    let { duration = 5, clicks = 10 } = e.currentTarget.dataset;

    this.setTimeout(+duration); /* 在5秒内有效 */
    this.count += 1; /* 点击10次后触发 */
    if (this.count < +clicks) return;

    if (window.localStorage['eruda-enable']) {
      console.log('禁用 eruda');
      window.localStorage['eruda-enable'] = '';
    } else {
      console.log('启用 eruda');
      this.init();
    }

    this.clearTimeout();
  };

  timer;
  setTimeout = (s) => {
    if (this.timer) return;
    this.timer = window.setTimeout(this.clearTimeout, s * 1000);
  };
  clearTimeout = () => {
    window.clearTimeout(this.timer);
    this.timer = undefined;
    this.count = 0;
  };
}

export default new MobileConsole();
