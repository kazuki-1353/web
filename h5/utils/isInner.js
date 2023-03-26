/* 

判断元素是否在视窗内

import HtmIsInner from './HtmIsInner';

let htmIsInner = new HtmIsInner(DOM);
let htmIsInner = new HtmIsInner('ID');
htmIsInner.watch((res) => {}); //监听状态
htmIsInner.clear(); //清除事件

*/

let HtmIsInner = class {
  constructor(arg) {
    //如果为字串时获取元素
    this.ele = typeof arg === 'string' ? document.getElementById(arg) : arg;
    if (!this.ele) throw new Error('该元素不存在');
  }

  /**监听状态 */
  watch(res) {
    this.event = () => {
      this.raf = window.requestAnimationFrame(() => {
        let { top, bottom } = this.ele.getBoundingClientRect(); //获取元素位置
        if (bottom < 0) return res(false); //元素在视窗上方时终止

        let clientHeight = document.documentElement.clientHeight;
        if (top > clientHeight) return res(false); //元素在视窗下方时终止

        return res(true); //进行回调
      });
    };

    this.event(); //立即回调
    window.addEventListener('scroll', this.event); //监听滚动
  }

  /**清除事件 */
  clear() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener('scroll', this.event);
  }
};

export default HtmIsInner;
