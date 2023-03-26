/* 

import htmUnit from './htmUnit'; //转换单位

htmUnit.px2mm(NUM);
htmUnit.mm2px(NUM);

 */

let HtmUnit = class {
  constructor() {
    this.dip = this.getDPI()[0];
  }

  /**
   * 获取DPI
   * @returns {Array}
   */
  getDPI() {
    let arrDPI = [];
    let { deviceXDPI, deviceYDPI } = window.screen;
    if (deviceXDPI) {
      arrDPI = [deviceXDPI, deviceYDPI];
    } else {
      let tmpNode = document.createElement('div');
      tmpNode.style.cssText = `
        visibility:hidden;
        position:absolute;
        top: -999px;
        left:-999px;
        z-index: -999;
        width:1in;
        height:1in;
      `;

      document.body.appendChild(tmpNode);

      deviceXDPI = window.parseInt(tmpNode.offsetWidth, 10);
      deviceYDPI = window.parseInt(tmpNode.offsetHeight, 10);
      arrDPI = [deviceXDPI, deviceYDPI];

      tmpNode.parentNode.removeChild(tmpNode);
    }

    return arrDPI;
  }

  /**
   * px转换为mm
   * @param px
   * @returns {number}
   */
  px2mm(px) {
    let inch = px / this.dip;
    let mm = inch * 25.4;
    return Math.ceil(mm);
  }

  /**
   * mm转换为px
   * @param mm
   * @returns {number}
   */
  mm2px(mm) {
    let inch = mm / 25.4;
    let px = inch * this.dip;
    return Math.ceil(px);
  }
};

export default new HtmUnit();
