/*

import SelectorQuery from '../../utils/SelectorQuery';

let ele = new SelectorQuery(`#${id}`);

ele.getFields().then((res) => {
  let fields = Array.isArray(res) ? res[0] : res;
});

ele.getRect().then((res) => {
  let rect = Array.isArray(res) ? res[0] : res;
});

ele.getOffset()
.then((res) => {
  let offset = Array.isArray(res) ? res[0] : res;
});

*/

import Taro, { NodesRef } from '@tarojs/taro';

const SelectorQuery = class {
  element: NodesRef | null = null;

  constructor(readonly select: string, readonly isMultiple = false) {
    let query = Taro.createSelectorQuery();
    this.element = isMultiple ? query.selectAll(select) : query.select(select);
  }

  /**获取节点 */
  getFields() {
    type Res = NodesRef.BoundingClientRectCallbackResult &
      NodesRef.ScrollOffsetCallbackResult;
    return new Promise<Res | Res[]>((resolve, reject) => {
      if (this.element) {
        this.element
          .fields(
            {
              id: true,
              size: true,
              rect: true,
              scrollOffset: true,
            },
            resolve,
          )
          .exec();
      } else {
        reject(new Error('获取元素失败'));
      }
    });
  }

  /**获取布局 */
  getRect() {
    type Res = NodesRef.BoundingClientRectCallbackResult;
    return new Promise<Res | Res[]>((resolve, reject) => {
      if (this.element) {
        this.element
          .boundingClientRect((rect) => {
            resolve(rect);
          })
          .exec();
      } else {
        reject(new Error('获取元素失败'));
      }
    });
  }

  /**获取位置, 节点必须是scroll-view或者viewport */
  getOffset() {
    type Res = NodesRef.ScrollOffsetCallbackResult;
    return new Promise<Res | Res[]>((resolve, reject) => {
      if (this.element) {
        this.element
          .scrollOffset((offset) => {
            resolve(offset);
          })
          .exec();
      } else {
        reject(new Error('获取元素失败'));
      }
    });
  }
};

export default SelectorQuery;
// export type { NodesRef };
