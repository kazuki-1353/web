/* 

双向循环链表

 */

/**节点 */
let Node = class {
  /**当前节点的值 */ value = null;
  /**下一个节点指针 */ next = null;
  /**上一个节点指针 */ prev = null;

  constructor(value = null) {
    this.value = value;
  }
};

let LinkedList = class {
  /**链表的长度 */ length = 0;
  /**链表的头部节点 */ head = null;
  /**链表的尾部节点 */ tail = null;

  constructor(arg) {
    if (arg instanceof Object && 'head' in arg && 'length' in arg) {
      this.head = arg.head;
      this.tail = arg.tail;
      this.length = arg.length;
    } else {
      this.init(arg);
    }
  }

  /**初始化 */
  init(value) {
    let node = new Node(value);
    node.next = node;
    node.prev = node;

    // 把当前节点作为头部与尾部节点
    this.head = node;
    this.tail = node;

    this.length = 1;
  }

  /**链接两项 */
  connect(prevNode, nextNode) {
    prevNode.next = nextNode;
    nextNode.prev = prevNode;
  }

  /**链接三项 */
  connect3(node, prevNode, nextNode) {
    node.prev = prevNode;
    prevNode.next = node;

    node.next = nextNode;
    nextNode.prev = node;
  }

  /**向链表的指定位置插入一项 */
  insert(value, position = this.length) {
    let { length } = this;
    if (position < 0 || position > length) throw new Error('位置不合法');

    if (length === 0) {
      this.init(value);
    } else {
      let node = new Node(value);

      let headNode = this.head;
      let tailNode = this.tail;

      switch (position) {
        // 在最前插入节点
        case 0: {
          this.head = node;
          this.connect3(node, tailNode, headNode);
          break;
        }

        // 在最后插入节点
        case length: {
          this.tail = node;
          this.connect3(node, tailNode, headNode);
          break;
        }

        // 在内部插入节点
        default: {
          let currentNode = this.find((_, index) => index === position);
          this.connect3(node, currentNode.prev, currentNode);
          break;
        }
      }

      this.length += 1;
      return node;
    }
  }

  /**从链表的指定位置移除一项 */
  removeAt(position) {
    let { length } = this;
    if (length === 0) throw new Error('链表为空');
    if (position < 0 || position >= length) throw new Error('位置不合法');

    if (length === 1) {
      this.length = 0;
      this.head = null;
      this.tail = null;
    } else {
      this.length -= 1;

      let headNode = this.head;
      let tailNode = this.tail;

      switch (position) {
        // 移除最前的节点
        case 0: {
          this.head = headNode.next;
          this.connect(tailNode, headNode.next);
          return headNode;
        }

        // 移除最后的节点
        case length - 1: {
          this.tail = tailNode.prev;
          this.connect(tailNode.prev, headNode);
          return tailNode;
        }

        // 移除内部的节点
        default: {
          let currentNode = this.find((_, index) => index === position);
          this.connect(currentNode.prev, currentNode.next);
          return currentNode;
        }
      }
    }
  }

  /**从链表中移除指定项 */
  remove(value) {
    let { length } = this;
    if (length === 0) throw new Error('链表为空');

    let currentNode = this.find((i) => i === value);
    if (!currentNode) return;

    this.connect(currentNode.prev, currentNode.next);

    this.length -= 1;
    return currentNode;
  }

  /**获取链表头部节点 */
  getHead() {
    return this.head;
  }

  /**获取链表尾部节点 */
  getTail() {
    return this.tail;
  }

  /**返回链表包含的节点个数 */
  size() {
    return this.length;
  }

  /**判断是否为空链表 */
  isEmpty() {
    return this.size() === 0;
  }

  /**返回链表中指定个数随机节点的值 */
  random(n = 1) {
    let res = [];
    let node = this.head;

    // 前 n 个元素先默认选上
    for (let i = 0; i < n && node != null; i++) {
      res[i] = node.value;
      node = node.next;
    }

    let i = n;

    // 循环遍历链表
    while (node != this.head) {
      i++;

      // 生成一个 [0, i) 之间的整数
      let random = Math.floor(Math.random() * i);

      // random 小于 n 的概率就是 n/i
      if (random < n) {
        res[random] = node.value;
      }

      node = node.next;
    }

    return res;
  }

  /**循环链表 */
  each(cb, mode) {
    if (this.length === 0) return;

    let index = 0;
    let recursive = (node) => {
      if (index === this.length) return;

      let isFound = cb(node.value, index);

      switch (mode) {
        case 'find': {
          if (isFound) return node;
        }

        case 'findIndex': {
          if (isFound) return index;
        }

        default:
          index += 1;
          return recursive(node.next);
      }
    };

    return recursive(this.head);
  }

  /**根据函数返回指定项在链表的节点 */
  find(cb) {
    let node = this.each(cb, 'find');
    return node;
  }

  /**根据函数返回指定项在链表的索引 */
  findIndex(cb) {
    let index = this.each(cb, 'findIndex');
    return index ?? -1;
  }

  /**返回指定项在链表的索引, 如果链表中没有该节点则返回 -1 */
  indexOf(value) {
    let index = this.each((i) => i === value, 'findIndex');
    return index ?? -1;
  }

  toArray() {
    let arr = [];
    this.each((i) => arr.push(i));
    return arr;
  }

  toString() {
    return this.toArray().toString();
  }

  /**打印链表数据 */
  log() {
    console.log(this.toString());
  }
};

module.exports = LinkedList;

/* 测试 */
// {
//   let linkedList = new LinkedList(0);
//   Array.from({ length: 9 }, (v, k) => {
//     linkedList.insert(k + 1);
//   });

//   // {
//   //   linkedList.log();

//   //   let node = linkedList.head;
//   //   console.log(node.value);
//   //   node = node.next;
//   //   console.log(node.value);
//   //   node = node.next;
//   //   console.log(node.value);
//   //   node = node.next;
//   //   console.log(node.value);
//   //   node = node.next;
//   //   console.log(node.value);
//   // }

//   // {
//   //   console.log(linkedList.random(3));
//   //   console.log(linkedList.random(3));
//   //   console.log(linkedList.random(3));

//   //   let arr = linkedList.toArray();

//   //   // 记录每个元素被选中的次数
//   //   let count = arr.reduce((p, i) => {
//   //     return {
//   //       ...p,
//   //       [i]: 0,
//   //     };
//   //   }, {});

//   //   let n = 1_000_000; // 重复 100 万次

//   //   for (let i = 0; i < n; i++) {
//   //     let res = linkedList.random(3);
//   //     res.forEach((v) => {
//   //       // 对随机选取的元素进行记录
//   //       count[v] = count[v] + 1;
//   //     });
//   //   }

//   //   console.log(count);
//   // }
// }
