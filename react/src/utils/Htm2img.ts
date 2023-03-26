/* 


建议在初始化页面时创建, 避免无法渲染远端图片


*/

import ReactDOM from 'react-dom';
import html2canvas from 'html2canvas';

let { body } = document;
let id = Symbol('htm2img').toString();

export default class {
  constructor(jsx: JSX.Element) {
    let dom = document.getElementById(id);
    if (!dom) {
      dom = document.createElement('div');
      dom.id = id;

      // 使用固定定位, 避免滚动页面后定位偏移
      dom.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        transform: translate(-100%,-100%);
      `;

      body.appendChild(dom);
      // body.insertBefore(dom, body.firstChild);
    }

    ReactDOM.render(jsx, dom);
    this.dom = dom;
  }

  dom: HTMLElement;

  getImg() {
    return new Promise<string>((resolve) => {
      html2canvas(this.dom, {
        useCORS: true,
        allowTaint: true,

        // 固定位置, 避免滚动页面后定位偏移
        scrollX: 0,
        scrollY: 0,
      })
        .then((cvs) => cvs.toDataURL('image/png'))
        .then((img) => {
          body.removeChild(this.dom);
          resolve(img);
        });
    });
  }
}
