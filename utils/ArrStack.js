/* 

栈: 遵循 LIFO（Last In First Out）, 后进先出, 先进后出

 */

let Stack = class {
  constructor(arr = []) {
    this.items = arr;
  }

  /**添加新元素到栈顶 */
  push(item) {
    this.items.push(item);
  }

  /**移除栈顶元素，同时返回被移除的元素 */
  pop() {
    return this.items.pop();
  }

  /**查看栈顶元素 */
  peek() {
    let index = this.size() - 1;
    return this.items[index];
  }

  /**查询栈的长度 */
  size() {
    return this.items.length;
  }

  /**判断是否为空栈 */
  isEmpty() {
    return this.items.length === 0;
  }

  /**清空栈 */
  clear() {
    this.items = [];
  }

  /**打印栈里的元素 */
  log() {
    console.log(this.items);
  }
};

module.exports = Stack;
