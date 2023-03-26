/* 

队列: 遵循 FIFO（First In First Out）, 先进先出, 后进后出

 */

let Queue = class {
  constructor(arr = []) {
    this.items = arr;
  }

  /**向队列尾部添加元素 */
  enqueue(element) {
    this.items.push(element);
  }

  /**移除队列的第一个元素，并返回被移除的元素 */
  dequeue() {
    return this.items.shift();
  }

  /**返回队列的第一个元素 */
  front() {
    return this.items[0];
  }

  /**获取队列的长度 */
  size() {
    return this.items.length;
  }

  /**判断是否为空队列 */
  isEmpty() {
    return this.items.length === 0;
  }

  /**清空队列 */
  clear() {
    this.items = [];
  }

  /**打印栈里的元素 */
  log() {
    console.log(this.items);
  }
};

module.exports = Queue;
